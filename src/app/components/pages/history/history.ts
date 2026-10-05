import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { FORM_SECTIONS } from '../../../config/form-config';
import { AdaptiveStatus } from '../../../models/adaptive.model';
import {
  HistoryItem,
  HistoryListResponse,
  PredictionDetail,
  HistoryFeedbackEntry,
} from '../../../models/history.model';
import { FeedbackType, HelpfulnessLevel, VerifiedOutcome } from '../../../models/feedback.model';

type RiskFilter = 'all' | 'higher' | 'moderate' | 'lower';
type FeedbackFilter = 'all' | 'pending' | 'submitted';

@Component({
  selector: 'app-history',
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Prediction History</h1>
        <p class="text-sm text-slate-500 mt-1">
          Submitted cases stored in the backend database — review inputs, model result,
          explanations and human feedback. Research prototype; synthetic data only.
        </p>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <div class="card !p-4 text-center">
          <p class="text-[11px] text-slate-500">Total Predictions</p>
          <p class="text-2xl font-bold text-slate-800">{{ history()?.count_total ?? '—' }}</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-[11px] text-slate-500">Feedback Submitted</p>
          <p class="text-2xl font-bold text-green-600">{{ feedbackSubmitted() }}</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-[11px] text-slate-500">Pending Feedback</p>
          <p class="text-2xl font-bold text-amber-600">{{ feedbackPending() }}</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-[11px] text-slate-500">Active Model</p>
          <p class="text-2xl font-bold text-indigo-600">{{ status()?.active_version ?? '—' }}</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-[11px] text-slate-500">Threshold</p>
          <p class="text-2xl font-bold text-slate-800">{{ latestThreshold() }}</p>
        </div>
        <div class="card !p-4 text-center">
          <p class="text-[11px] text-slate-500">Adaptive Update</p>
          <p class="text-sm font-semibold" [class]="status()?.adaptive_enabled ? 'text-green-600' : 'text-amber-600'">
            {{ status() ? (status()!.adaptive_enabled ? 'Enabled (manual)' : 'Disabled (TEST MODE)') : '—' }}
          </p>
        </div>
      </div>

      @if (loading()) {
        <div class="card flex items-center justify-center py-12">
          <svg class="animate-spin w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      } @else if (error()) {
        <div class="card">
          <div class="rounded-lg bg-red-50 border border-red-200 p-4">
            <p class="text-sm font-medium text-red-800">Unable to load submitted predictions.</p>
            <p class="text-sm text-red-600 mt-1">{{ error() }}</p>
          </div>
        </div>
      } @else if (history()?.items?.length === 0) {
        <div class="card text-center py-12">
          <h2 class="text-lg font-semibold text-slate-700">No Predictions Submitted Yet</h2>
          <p class="text-sm text-slate-500 mt-2">
            Submit a case through the Assessment form — it will appear here from the database.
          </p>
        </div>
      } @else if (history()) {
        <!-- Filters -->
        <div class="card mb-6">
          <div class="flex flex-wrap items-center gap-3">
            <input type="text" [(ngModel)]="searchTerm" name="search"
                   placeholder="Search by Prediction ID…"
                   class="flex-1 min-w-52 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <div class="flex flex-wrap gap-2">
              @for (f of riskFilters; track f.value) {
                <button class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                        [class]="riskFilter() === f.value ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-600 hover:border-slate-400'"
                        (click)="riskFilter.set(f.value)">{{ f.label }}</button>
              }
            </div>
            <div class="flex gap-2">
              @for (f of feedbackFilters; track f.value) {
                <button class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                        [class]="feedbackFilter() === f.value ? 'bg-slate-700 text-white border-slate-700' : 'border-slate-300 text-slate-600 hover:border-slate-400'"
                        (click)="feedbackFilter.set(f.value)">{{ f.label }}</button>
              }
            </div>
            <button class="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-300 text-slate-600 hover:border-slate-400"
                    (click)="toggleSort()">{{ newestFirst() ? 'Newest ↓' : 'Oldest ↑' }}</button>
          </div>
        </div>

        <!-- Table -->
        <div class="card mb-6 overflow-x-auto !p-0">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th class="px-4 py-3">Prediction ID</th>
                <th class="px-4 py-3">Submitted At</th>
                <th class="px-4 py-3">Model</th>
                <th class="px-4 py-3">Result</th>
                <th class="px-4 py-3">Probability</th>
                <th class="px-4 py-3">Risk</th>
                <th class="px-4 py-3">Feedback</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredItems(); track item.prediction_id) {
                <tr class="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    [class.bg-indigo-50]="selected()?.prediction_id === item.prediction_id"
                    (click)="select(item)">
                  <td class="px-4 py-3 font-mono text-xs text-slate-700">{{ item.prediction_id }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ item.created_at | date:'yyyy-MM-dd HH:mm' }}</td>
                  <td class="px-4 py-3">
                    <span class="badge bg-indigo-50 text-indigo-700">{{ item.model_version ?? '—' }}</span>
                  </td>
                  <td class="px-4 py-3 font-medium"
                      [class]="item.prediction === 1 ? 'text-red-600' : 'text-green-600'">
                    {{ item.prediction === 1 ? 'Diabetes Risk' : item.prediction === 0 ? 'No Diabetes Risk' : '—' }}
                  </td>
                  <td class="px-4 py-3 text-slate-700">
                    {{ item.probability != null ? (item.probability * 100 | number:'1.1-1') + '%' : '—' }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="badge" [class]="riskBadge(item)">{{ item.risk_category ?? '—' }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="badge" [class]="feedbackBadge(item)">{{ feedbackLabel(item) }}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <span class="text-xs font-medium text-indigo-600">Review →</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredItems().length === 0) {
            <p class="text-sm text-slate-400 text-center py-8">No records match the current filters.</p>
          }
        </div>

        <!-- Detail (modal popup) -->
        @if (selected(); as detail) {
          <div class="fixed inset-0 z-40 bg-slate-900/50" (click)="closeDetail()"></div>
          <div class="fixed inset-0 z-50 overflow-y-auto py-8 px-4 pointer-events-none">
          <div class="card border-indigo-200 max-w-4xl mx-auto shadow-2xl pointer-events-auto">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold text-slate-800">Prediction Details</h2>
                <p class="text-xs font-mono text-slate-500 mt-0.5">{{ detail.prediction_id }}</p>
              </div>
              <button class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      aria-label="Close details" (click)="closeDetail()">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- A. Model Result -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Prediction</p>
                <p class="text-sm font-semibold" [class]="detail.result.prediction === 1 ? 'text-red-600' : 'text-green-600'">
                  {{ detail.result.prediction === 1 ? 'Diabetes Risk' : 'No Diabetes Risk' }}
                </p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Probability</p>
                <p class="text-sm font-semibold text-slate-800">
                  {{ detail.result.probability != null ? (detail.result.probability * 100 | number:'1.1-2') + '%' : '—' }}
                </p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Risk Category</p>
                <p class="text-sm font-semibold text-slate-800">{{ detail.result.risk_category ?? '—' }}</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Model</p>
                <p class="text-sm font-semibold text-indigo-600">{{ detail.model_version ?? detail.result.model_version ?? '—' }}</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Threshold</p>
                <p class="text-sm font-semibold text-slate-800">{{ detail.result.threshold != null ? (detail.result.threshold | number:'1.2-2') : '—' }}</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Submitted</p>
                <p class="text-sm font-semibold text-slate-800">{{ detail.created_at | date:'yyyy-MM-dd HH:mm' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <!-- B. Submitted input data -->
              <div>
                <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Submitted Input Data</h3>
                @if (featureRows(detail).length > 0) {
                  <dl class="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    @for (row of featureRows(detail); track row.key) {
                      <div class="flex items-start justify-between gap-4 px-3 py-2">
                        <dt class="text-xs text-slate-500">{{ row.label }}</dt>
                        <dd class="text-xs font-medium text-slate-800 text-right">{{ row.value }}</dd>
                      </div>
                    }
                  </dl>
                } @else {
                  <p class="text-sm text-slate-400">No input data was stored for this prediction.</p>
                }
              </div>

              <!-- C. Explanation -->
              <div>
                <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Explanation (XAI)</h3>
                @if (detail.result.explanations && detail.result.explanations!.length > 0) {
                  <div class="space-y-2">
                    @for (e of detail.result.explanations; track e.feature) {
                      <div class="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-2">
                        <span class="text-base leading-6" [class]="e.direction === 'increase' ? 'text-red-500' : 'text-green-600'">
                          {{ e.direction === 'increase' ? '↑' : '↓' }}
                        </span>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <p class="text-xs font-semibold text-slate-800">{{ e.display_name }}</p>
                            <p class="text-xs font-medium" [class]="e.direction === 'increase' ? 'text-red-600' : 'text-green-600'">
                              {{ e.direction === 'increase' ? '+' : '-' }}{{ e.contribution | number:'1.2-2' }}%
                            </p>
                          </div>
                          <p class="text-[11px] text-slate-500">{{ e.explanation }}</p>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-sm text-slate-400">Explanation data was not returned for this prediction.</p>
                }
              </div>
            </div>

            <!-- D. Human feedback records -->
            <div class="mb-6">
              <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Human Feedback</h3>
              @if (detail.feedback.length > 0) {
                <div class="space-y-2">
                  @for (fb of detail.feedback; track fb.feedback_id) {
                    <div class="rounded-lg border border-slate-200 px-3 py-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="badge" [class]="fb.feedback === 'agree' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                          Human feedback: {{ fb.feedback === 'agree' ? 'Agree' : 'Disagree' }}
                        </span>
                        <span class="badge bg-slate-100 text-slate-600">Helpfulness: {{ fb.helpfulness ?? '—' }}</span>
                        <span class="badge bg-slate-100 text-slate-600">Reward: {{ fb.reward }}</span>
                        <span class="badge" [class]="fb.has_verified_label ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'">
                          {{ fb.has_verified_label
                             ? 'Verified Outcome: ' + (fb.verified_label === 1 ? 'Diabetes' : 'No Diabetes')
                             : 'Verified Outcome: Not recorded' }}
                        </span>
                        <span class="badge" [class]="fb.adaptive_processed ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'">
                          Adaptive Processing: {{ fb.adaptive_processed ? 'Processed' : 'Not processed' }}
                        </span>
                      </div>
                      @if (fb.comment) {
                        <p class="text-xs text-slate-600 mt-2">“{{ fb.comment }}”</p>
                      }
                      <p class="text-[11px] text-slate-400 mt-1">{{ fb.feedback_id }} · {{ fb.created_at | date:'yyyy-MM-dd HH:mm' }}</p>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-sm text-slate-500 mb-3">No feedback submitted yet for this prediction.</p>
              }

              @if (feedbackSuccess()) {
                <div class="rounded-lg bg-green-50 border border-green-200 px-3 py-2 mt-2">
                  <p class="text-sm font-medium text-green-800">Feedback submitted successfully.</p>
                  <p class="text-[11px] text-green-700 mt-0.5">
                    Recorded as human feedback only. Verified label and adaptive processing
                    are unchanged; no adaptive update was triggered.
                  </p>
                </div>
              }

              @if (detail.feedback.length === 0) {
                <!-- E. Feedback form -->
                <div class="rounded-lg bg-slate-50 border border-slate-200 p-4 mt-3">
                  <p class="form-label mb-2">Do you agree with this prediction?</p>
                  <div class="flex gap-3 mb-4">
                    <button type="button"
                            class="flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all"
                            [class]="feedbackType() === 'agree' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
                            (click)="feedbackType.set('agree')">👍 Agree</button>
                    <button type="button"
                            class="flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all"
                            [class]="feedbackType() === 'disagree' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
                            (click)="feedbackType.set('disagree')">👎 Disagree</button>
                  </div>
                  <div class="flex flex-wrap gap-2 mb-4">
                    @for (opt of helpfulnessOptions; track opt.value) {
                      <button type="button"
                              class="px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all"
                              [class]="helpfulness() === opt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
                              (click)="helpfulness.set(opt.value)">{{ opt.label }}</button>
                    }
                  </div>
                  <textarea [(ngModel)]="comment" name="detail-comment"
                            placeholder="Optional comment…"
                            class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"></textarea>

                  @if (feedbackError()) {
                    <p class="text-sm text-red-600 mb-2">{{ feedbackError() }}</p>
                  }
                  <button type="button" class="btn-primary text-sm"
                          [disabled]="!feedbackType() || !helpfulness() || feedbackLoading()"
                          (click)="submitFeedback(detail)">
                    {{ feedbackLoading() ? 'Submitting…' : 'Submit Feedback' }}
                  </button>
                  <p class="text-[11px] text-slate-400 mt-2">
                    Feedback is stored as a learning signal only. It is not a verified label
                    and does not trigger adaptive retraining.
                  </p>
                </div>
              }
            </div>

            <!-- F. Verified Outcome (Doctor/Reviewer only) -->
            @if (detail.feedback.length > 0) {
              <div class="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 mb-6">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm font-bold uppercase tracking-wide text-indigo-700">Verified Outcome</h3>
                  <span class="badge bg-indigo-100 text-indigo-700">Doctor/Reviewer only — requires reviewer authorisation</span>
                </div>
                <p class="text-[11px] text-slate-500 mb-3">
                  In this research prototype there is no login system; in deployment this action must be
                  restricted to an authorised Doctor/Reviewer role. Only a verified outcome creates a
                  supervised training label — Agree/Disagree never does. This does NOT trigger retraining.
                </p>
                @if (latestFeedback(detail); as fb) {
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    @for (opt of verifyOptions; track opt.value) {
                      <button type="button"
                              class="px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all"
                              [class]="verifyOutcome() === opt.value ? 'border-indigo-500 bg-indigo-100 text-indigo-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                              (click)="verifyOutcome.set(opt.value)">{{ opt.label }}</button>
                    }
                  </div>
                  @if (verifyError()) {
                    <p class="text-sm text-red-600 mb-2">{{ verifyError() }}</p>
                  }
                  @if (verifySuccess()) {
                    <div class="rounded-lg bg-green-50 border border-green-200 px-3 py-2 mb-2">
                      <p class="text-sm font-medium text-green-800">{{ verifySuccess() }}</p>
                    </div>
                  }
                  <button type="button" class="btn-primary text-sm"
                          [disabled]="!verifyOutcome() || verifyLoading()"
                          (click)="submitVerifiedOutcome(detail, fb)">
                    {{ verifyLoading() ? 'Saving…' : 'Save Verified Outcome' }}
                  </button>
                }
              </div>
            }

            <!-- G. Adaptive learning status -->
            <div class="rounded-lg border border-slate-200 p-4 mb-6">
              <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Adaptive Learning</h3>
              @if (latestFeedback(detail); as fb) {
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div class="bg-slate-50 rounded-lg p-3">
                    <dt class="text-[11px] text-slate-500">Human Feedback</dt>
                    <dd class="text-sm font-semibold text-slate-800">{{ fb.feedback === 'agree' ? 'Agree' : 'Disagree' }}</dd>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3">
                    <dt class="text-[11px] text-slate-500">Verified Outcome</dt>
                    <dd class="text-sm font-semibold text-slate-800">
                      {{ fb.has_verified_label ? (fb.verified_label === 1 ? 'Diabetes' : 'No Diabetes') : 'Not recorded' }}
                    </dd>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3">
                    <dt class="text-[11px] text-slate-500">Training Eligibility</dt>
                    <dd class="text-sm font-semibold" [class]="fb.has_verified_label ? 'text-green-600' : 'text-amber-600'">
                      {{ fb.has_verified_label ? 'Eligible for adaptive training: YES' : 'Eligible for adaptive training: NO' }}
                    </dd>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3">
                    <dt class="text-[11px] text-slate-500">Adaptive Processing</dt>
                    <dd class="text-sm font-semibold" [class]="fb.adaptive_processed ? 'text-indigo-600' : 'text-slate-800'">
                      {{ fb.adaptive_processed ? 'Processed' : (fb.has_verified_label ? 'Pending' : 'Not applicable') }}
                    </dd>
                  </div>
                </dl>
                @if (fb.has_verified_label) {
                  <p class="text-[11px] text-slate-500">
                    Verified outcome recorded. This feedback is eligible for the controlled
                    adaptive-learning pipeline (Verified Label → Eligibility Check → Candidate Dataset →
                    Candidate Model Training → Evaluation → Candidate Model → Controlled Activation).
                    "Eligible" does not mean retraining has happened — candidates are never activated
                    automatically.
                  </p>
                } @else {
                  <p class="text-[11px] text-slate-500">
                    Human feedback has been recorded, but no verified outcome has been provided.
                    This record is not eligible for adaptive retraining.
                  </p>
                }
              } @else {
                <p class="text-sm text-slate-500">
                  No feedback submitted yet. Adaptive eligibility is assessed only after review.
                </p>
              }
            </div>

            <p class="text-[11px] text-slate-400">
              Human feedback is collected during review, while only verified labels are eligible
              to contribute supervised training data to the controlled adaptive-learning pipeline.
            </p>
          </div>
          </div>
        }
      }
    </div>
  `
})
export class History implements OnInit {
  private readonly api = inject(ApiService);

  readonly history = signal<HistoryListResponse | null>(null);
  readonly status = signal<AdaptiveStatus | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly selected = signal<PredictionDetail | null>(null);
  readonly searchTerm = signal('');
  readonly riskFilter = signal<RiskFilter>('all');
  readonly feedbackFilter = signal<FeedbackFilter>('all');
  readonly newestFirst = signal(true);

  readonly feedbackType = signal<FeedbackType | null>(null);
  readonly helpfulness = signal<HelpfulnessLevel | null>(null);
  comment = '';
  readonly feedbackLoading = signal(false);
  readonly feedbackError = signal<string | null>(null);
  readonly feedbackSuccess = signal(false);

  readonly verifyOutcome = signal<VerifiedOutcome | null>(null);
  readonly verifyLoading = signal(false);
  readonly verifyError = signal<string | null>(null);
  readonly verifySuccess = signal<string | null>(null);

  readonly verifyOptions: { value: VerifiedOutcome; label: string }[] = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'no_diabetes', label: 'No Diabetes' },
    { value: 'unable_to_verify', label: 'Unable to Verify' },
  ];

  readonly riskFilters: { value: RiskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'higher', label: 'Higher Risk' },
    { value: 'moderate', label: 'Moderate Risk' },
    { value: 'lower', label: 'Lower Risk' },
  ];
  readonly feedbackFilters: { value: FeedbackFilter; label: string }[] = [
    { value: 'all', label: 'All Feedback' },
    { value: 'pending', label: 'Feedback Pending' },
    { value: 'submitted', label: 'Feedback Submitted' },
  ];
  readonly helpfulnessOptions = [
    { label: 'Very helpful', value: 'very_helpful' as HelpfulnessLevel },
    { label: 'Helpful', value: 'helpful' as HelpfulnessLevel },
    { label: 'Neutral', value: 'neutral' as HelpfulnessLevel },
    { label: 'Not helpful', value: 'not_helpful' as HelpfulnessLevel },
  ];

  // Human-readable labels for stored features, reusing the form config.
  private readonly fieldMeta = new Map(
    FORM_SECTIONS.flatMap(s => s.fields).map(f => [
      f.key,
      { label: f.label, values: new Map(f.options.map(o => [o.value, o.label])) },
    ])
  );

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getPredictionHistory().subscribe({
      next: (data) => {
        this.history.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
    this.api.getAdaptiveStatus().subscribe({
      next: (s) => this.status.set(s),
      error: () => this.status.set(null),
    });
  }

  readonly filteredItems = computed<HistoryItem[]>(() => {
    const h = this.history();
    if (!h) return [];
    const term = this.searchTerm().toLowerCase();
    const risk = this.riskFilter();
    const fb = this.feedbackFilter();
    const items = h.items.filter(item => {
      if (term && !item.prediction_id.toLowerCase().includes(term)) return false;
      if (risk !== 'all' && (item.risk_category ?? '').toLowerCase().indexOf(risk) !== 0) return false;
      if (fb === 'pending' && item.feedback_count > 0) return false;
      if (fb === 'submitted' && item.feedback_count === 0) return false;
      return true;
    });
    return this.newestFirst() ? items : [...items].reverse();
  });

  readonly feedbackSubmitted = computed(
    () => this.history()?.items.filter(i => i.feedback_count > 0).length ?? 0
  );
  readonly feedbackPending = computed(
    () => this.history()?.items.filter(i => i.feedback_count === 0).length ?? 0
  );

  latestThreshold(): string {
    const items = this.history()?.items ?? [];
    const withThreshold = items.find(i => i.threshold != null);
    return withThreshold?.threshold != null ? withThreshold.threshold.toFixed(2) : '—';
  }

  riskBadge(item: HistoryItem): string {
    const r = (item.risk_category ?? '').toLowerCase();
    if (r.startsWith('higher')) return 'bg-red-100 text-red-700';
    if (r.startsWith('moderate')) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  }

  feedbackBadge(item: HistoryItem): string {
    if (item.latest_feedback === 'agree') return 'bg-green-100 text-green-700';
    if (item.latest_feedback === 'disagree') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  }

  feedbackLabel(item: HistoryItem): string {
    if (item.latest_feedback === 'agree') return 'Agree';
    if (item.latest_feedback === 'disagree') return 'Disagree';
    return 'Pending';
  }

  featureRows(detail: PredictionDetail): { key: string; label: string; value: string }[] {
    return Object.entries(detail.features ?? {})
      .filter(([, v]) => v != null && v !== '')
      .map(([key, value]) => {
        const meta = this.fieldMeta.get(key as never);
        return {
          key,
          label: meta?.label ?? key,
          value: meta?.values.get(String(value)) ?? String(value),
        };
      });
  }

  select(item: HistoryItem): void {
    this.feedbackType.set(null);
    this.helpfulness.set(null);
    this.comment = '';
    this.feedbackError.set(null);
    this.feedbackSuccess.set(false);
    this.verifyOutcome.set(null);
    this.verifyError.set(null);
    this.verifySuccess.set(null);
    this.api.getPredictionDetail(item.prediction_id).subscribe({
      next: (detail) => this.selected.set(detail),
      error: (err) => this.error.set(err.message),
    });
  }

  closeDetail(): void {
    this.selected.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDetail();
  }

  toggleSort(): void {
    this.newestFirst.set(!this.newestFirst());
  }

  submitFeedback(detail: PredictionDetail): void {
    if (!this.feedbackType() || !this.helpfulness()) return;
    this.feedbackLoading.set(true);
    this.feedbackError.set(null);
    this.api.submitFeedback({
      prediction_id: detail.prediction_id,
      feedback: this.feedbackType()!,
      helpfulness: this.helpfulness()!,
      comment: this.comment ?? '',
    }).subscribe({
      next: () => {
        this.feedbackLoading.set(false);
        this.feedbackSuccess.set(true);
        // Refresh detail + list without a page reload.
        this.api.getPredictionDetail(detail.prediction_id).subscribe({
          next: (d) => this.selected.set(d),
        });
        this.api.getPredictionHistory().subscribe({
          next: (h) => this.history.set(h),
        });
      },
      error: (err) => {
        this.feedbackError.set(err.message);
        this.feedbackLoading.set(false);
      },
    });
  }

  latestFeedback(detail: PredictionDetail): HistoryFeedbackEntry | null {
    const entries = detail.feedback ?? [];
    return entries.length > 0 ? entries[entries.length - 1] : null;
  }

  submitVerifiedOutcome(detail: PredictionDetail, fb: HistoryFeedbackEntry): void {
    const outcome = this.verifyOutcome();
    if (!outcome) return;
    this.verifyLoading.set(true);
    this.verifyError.set(null);
    this.verifySuccess.set(null);
    this.api.submitVerifiedOutcome(fb.feedback_id, outcome).subscribe({
      next: (res) => {
        this.verifyLoading.set(false);
        this.verifySuccess.set(
          res.verified_label === null
            ? 'Recorded: no training label created (Unable to Verify).'
            : 'Verified outcome recorded. Eligible for the controlled adaptive-learning pipeline — no retraining was triggered.'
        );
        // Refresh detail + list without a page reload.
        this.api.getPredictionDetail(detail.prediction_id).subscribe({
          next: (d) => this.selected.set(d),
        });
        this.api.getPredictionHistory().subscribe({
          next: (h) => this.history.set(h),
        });
      },
      error: (err) => {
        this.verifyError.set(err.message);
        this.verifyLoading.set(false);
      },
    });
  }
}
