import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../../../services/app-state';
import { ApiService } from '../../../../services/api.service';
import { FeedbackType, HelpfulnessLevel } from '../../../../models/feedback.model';

@Component({
  selector: 'app-human-feedback',
  imports: [FormsModule],
  template: `
    <div class="card mb-6">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-800">Help Improve the AI</h2>
        <p class="text-sm text-slate-500 mt-0.5">
          Your feedback helps evaluate and improve future model versions.
        </p>
      </div>

      @if (!submitted()) {
        <!-- Agree / Disagree -->
        <div class="mb-6">
          <p class="form-label">Do you agree with this prediction?</p>
          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium"
              [class]="feedbackType() === 'agree' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
              (click)="setFeedbackType('agree')"
            >
              <span class="text-lg">👍</span> Agree
            </button>
            <button
              type="button"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium"
              [class]="feedbackType() === 'disagree' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
              (click)="setFeedbackType('disagree')"
            >
              <span class="text-lg">👎</span> Disagree
            </button>
          </div>
        </div>

        <!-- Helpfulness -->
        <div class="mb-6">
          <p class="form-label">How helpful was this prediction?</p>
          <div class="flex flex-wrap gap-2">
            @for (opt of helpfulnessOptions; track opt.value) {
              <button
                type="button"
                class="px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all"
                [class]="helpfulness() === opt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
                (click)="setHelpfulness(opt.value)"
              >
                {{ opt.label }}
              </button>
            }
          </div>
        </div>

        <!-- Comment -->
        <div class="mb-6">
          <p class="form-label">What would you like to tell the system?</p>
          <textarea
            class="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y min-h-[120px]"
            placeholder="Tell us why you agreed or disagreed with the prediction..."
            [(ngModel)]="comment"
            name="comment"
          ></textarea>
        </div>

        @if (error()) {
          <div class="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p class="text-sm text-red-600">{{ error() }}</p>
          </div>
        }

        <button
          type="button"
          class="btn-primary w-full"
          [disabled]="!canSubmit() || loading()"
          (click)="submitFeedback()"
        >
          @if (loading()) {
            <span class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Submitting...
            </span>
          } @else {
            Submit Feedback
          }
        </button>
      } @else {
        <div class="text-center py-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
            <svg class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-lg font-semibold text-slate-800">Thank you. Your feedback has been recorded.</p>
          <p class="text-sm text-slate-500 mt-2">
            Your feedback is stored as a learning signal for future model updates.
          </p>
          <button class="btn-primary mt-6" (click)="goToConfirmation()">
            View Feedback Summary
          </button>
        </div>
      }
    </div>
  `
})
export class HumanFeedback {
  private readonly state = inject(AppState);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly helpfulnessOptions = [
    { label: 'Very Helpful', value: 'very_helpful' as HelpfulnessLevel },
    { label: 'Helpful', value: 'helpful' as HelpfulnessLevel },
    { label: 'Neutral', value: 'neutral' as HelpfulnessLevel },
    { label: 'Not Helpful', value: 'not_helpful' as HelpfulnessLevel },
    { label: 'Incorrect', value: 'incorrect' as HelpfulnessLevel },
  ];

  feedbackType = signal<FeedbackType | null>(null);
  helpfulness = signal<HelpfulnessLevel | null>(null);
  comment = '';
  loading = signal(false);
  error = signal<string | null>(null);
  submitted = signal(false);

  setFeedbackType(type: FeedbackType): void {
    this.feedbackType.set(type);
  }

  setHelpfulness(level: HelpfulnessLevel): void {
    this.helpfulness.set(level);
  }

  canSubmit(): boolean {
    return this.feedbackType() !== null && this.helpfulness() !== null;
  }

  submitFeedback(): void {
    const prediction = this.state.prediction();
    if (!prediction || !this.feedbackType() || !this.helpfulness()) return;

    this.loading.set(true);
    this.error.set(null);

    this.state.setFeedbackMeta(this.feedbackType()!, this.helpfulness()!, this.comment);

    this.api.submitFeedback({
      prediction_id: prediction.prediction_id ?? 'unknown',
      feedback: this.feedbackType()!,
      helpfulness: this.helpfulness()!,
      comment: this.comment
    }).subscribe({
      next: (response) => {
        this.state.setFeedbackResponse(response);
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  goToConfirmation(): void {
    this.router.navigate(['/feedback-confirmation']);
  }
}
