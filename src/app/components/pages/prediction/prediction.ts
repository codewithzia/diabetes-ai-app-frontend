import { Component, inject, computed } from '@angular/core';
import { AppState } from '../../../services/app-state';
import { Router } from '@angular/router';
import { PredictionResult } from './prediction-result/prediction-result';
import { ExplainableAi } from './explainable-ai/explainable-ai';
import { HumanFeedback } from './human-feedback/human-feedback';
import { FeedbackLoop } from '../../shared/feedback-loop/feedback-loop';
import { SystemStatus } from '../../shared/system-status/system-status';
import { ApiDebug } from '../../shared/api-debug/api-debug';

@Component({
  selector: 'app-prediction',
  imports: [PredictionResult, ExplainableAi, HumanFeedback, FeedbackLoop, SystemStatus, ApiDebug],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      @if (hasPrediction()) {
        <app-feedback-loop activeStep="Explain"></app-feedback-loop>

        <app-prediction-result></app-prediction-result>
        <app-explainable-ai></app-explainable-ai>
        <app-human-feedback></app-human-feedback>
        <app-system-status></app-system-status>
        <app-api-debug></app-api-debug>
      } @else {
        <div class="card text-center py-12">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
            <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-slate-700">No Prediction Available</h2>
          <p class="text-sm text-slate-500 mt-2 mb-6">
            Please complete the assessment form first to generate a prediction.
          </p>
          <button class="btn-primary" (click)="goToAssessment()">Start Assessment</button>
        </div>
      }
    </div>
  `
})
export class Prediction {
  private readonly state = inject(AppState);
  private readonly router = inject(Router);

  readonly hasPrediction = this.state.hasPrediction;

  goToAssessment(): void {
    this.router.navigate(['/assessment']);
  }
}
