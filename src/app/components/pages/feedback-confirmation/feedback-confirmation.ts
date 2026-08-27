import { Component, inject, computed } from '@angular/core';
import { AppState } from '../../../services/app-state';
import { Router } from '@angular/router';
import { FeedbackLoop } from '../../shared/feedback-loop/feedback-loop';

@Component({
  selector: 'app-feedback-confirmation',
  imports: [FeedbackLoop],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <app-feedback-loop activeStep="Generate Reward"></app-feedback-loop>

      <div class="card">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
            <svg class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">Feedback Received</h2>
          <p class="text-sm text-slate-500 mt-1">Your feedback has been successfully recorded.</p>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-sm text-slate-500">Prediction</span>
            <span class="text-sm font-semibold text-slate-800">{{ predictionLabel() }}</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-sm text-slate-500">Your Feedback</span>
            <span class="text-sm font-semibold" [class]="feedbackClass()">
              {{ feedbackLabel() }}
            </span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-sm text-slate-500">Feedback Reward</span>
            <span class="text-sm font-semibold" [class]="rewardClass()">
              {{ rewardLabel() }}
            </span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-sm text-slate-500">Feedback ID</span>
            <span class="text-sm font-mono font-semibold text-slate-800">{{ feedbackId() }}</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-100">
            <span class="text-sm text-slate-500">Timestamp</span>
            <span class="text-sm font-semibold text-slate-800">{{ timestamp() }}</span>
          </div>
        </div>

        <div class="rounded-lg bg-indigo-50 border border-indigo-100 p-4 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-indigo-800 leading-relaxed">
              Your feedback is stored as a learning signal. Verified outcomes may be used
              during future model updates.
            </p>
          </div>
        </div>

        <div class="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-6">
          <p class="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> User feedback is distinct from verified clinical
            outcomes. Disagreement with a prediction does not immediately change the medical
            prediction. Feedback serves as a learning signal for future model evaluation.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button class="btn-secondary flex-1" (click)="goHome()">Back to Home</button>
          <button class="btn-primary flex-1" (click)="newAssessment()">New Assessment</button>
        </div>
      </div>
    </div>
  `
})
export class FeedbackConfirmation {
  private readonly state = inject(AppState);
  private readonly router = inject(Router);

  private readonly prediction = this.state.prediction;
  private readonly feedbackResponse = this.state.feedbackResponse;
  private readonly feedbackType = this.state.feedbackType;

  predictionLabel(): string {
    const p = this.prediction();
    if (!p) return '—';
    return p.risk_category;
  }

  feedbackLabel(): string {
    const fb = this.feedbackType();
    if (!fb) return '—';
    return fb === 'agree' ? 'Agree' : 'Disagree';
  }

  feedbackClass(): string {
    const fb = this.feedbackType();
    if (fb === 'agree') return 'text-green-600';
    if (fb === 'disagree') return 'text-red-600';
    return 'text-slate-700';
  }

  rewardLabel(): string {
    const r = this.feedbackResponse();
    return r ? (r.reward > 0 ? `+${r.reward}` : `${r.reward}`) : '—';
  }

  rewardClass(): string {
    const r = this.feedbackResponse();
    if (!r) return 'text-slate-700';
    return r.reward > 0 ? 'text-green-600' : 'text-red-600';
  }

  feedbackId(): string {
    const r = this.feedbackResponse();
    return r?.feedback_id ?? '—';
  }

  timestamp(): string {
    return new Date().toLocaleString();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  newAssessment(): void {
    this.state.clearPrediction();
    this.router.navigate(['/assessment']);
  }
}
