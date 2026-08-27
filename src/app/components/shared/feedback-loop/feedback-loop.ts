import { Component, input } from '@angular/core';

@Component({
  selector: 'app-feedback-loop',
  imports: [],
  template: `
    <div class="flex flex-wrap items-center justify-center gap-2 py-4">
      @for (step of steps; track step; let i = $index) {
        <div class="flex items-center gap-2">
          <div
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            [class]="getStepClass(step)"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  [class]="getBadgeClass(step)">
              {{ i + 1 }}
            </span>
            {{ step }}
          </div>
          @if (i < steps.length - 1) {
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FeedbackLoop {
  activeStep = input<string>('Predict');

  steps = ['Predict', 'Explain', 'Collect Feedback', 'Generate Reward', 'Update Model', 'Evaluate', 'Deploy', 'Predict Again'];

  getStepClass(step: string): string {
    return this.isActive(step)
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'bg-slate-100 text-slate-600';
  }

  getBadgeClass(step: string): string {
    return this.isActive(step)
      ? 'bg-white/20 text-white'
      : 'bg-white text-slate-500';
  }

  isActive(step: string): boolean {
    return step === this.activeStep();
  }
}
