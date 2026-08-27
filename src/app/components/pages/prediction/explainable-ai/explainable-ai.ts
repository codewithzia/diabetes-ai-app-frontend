import { Component, inject, computed } from '@angular/core';
import { AppState } from '../../../../services/app-state';
import { ExplanationFactor } from '../../../../models/prediction.model';

@Component({
  selector: 'app-explainable-ai',
  imports: [],
  template: `
    <div class="card mb-6">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-800">Why did the model make this prediction?</h2>
        <p class="text-sm text-slate-500 mt-0.5">
          Top contributing factors based on model coefficients and feature values
        </p>
      </div>

      @if (increasingFactors().length > 0) {
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Factors Increasing Estimated Risk
          </h3>
          <div class="space-y-3">
            @for (factor of increasingFactors(); track factor.feature; let i = $index) {
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-6 text-sm font-medium text-slate-400">{{ i + 1 }}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-slate-700">{{ factor.display_name }}</span>
                    <span class="text-sm font-semibold text-red-600">+{{ factor.contribution.toFixed(2) }}%</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      class="bg-red-500 h-2.5 rounded-full transition-all duration-700"
                      [style.width.%]="getBarWidth(factor.contribution)"
                    ></div>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">{{ factor.explanation }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (decreasingFactors().length > 0) {
        <div>
          <h3 class="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            Top Factors Decreasing Estimated Risk
          </h3>
          <div class="space-y-3">
            @for (factor of decreasingFactors(); track factor.feature; let i = $index) {
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-6 text-sm font-medium text-slate-400">{{ i + 1 }}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-slate-700">{{ factor.display_name }}</span>
                    <span class="text-sm font-semibold text-green-600">{{ factor.contribution.toFixed(2) }}%</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      class="bg-green-500 h-2.5 rounded-full transition-all duration-700"
                      [style.width.%]="getBarWidth(factor.contribution)"
                    ></div>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">{{ factor.explanation }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (increasingFactors().length === 0 && decreasingFactors().length === 0) {
        <div class="text-center py-8">
          <p class="text-sm text-slate-400">No explanation data available for this prediction.</p>
        </div>
      }
    </div>
  `
})
export class ExplainableAi {
  private readonly state = inject(AppState);
  private readonly prediction = this.state.prediction;

  readonly increasingFactors = computed<ExplanationFactor[]>(() => {
    const p = this.prediction();
    if (!p) return [];
    return p.explanations
      .filter(e => e.direction === 'increase')
      .sort((a, b) => b.contribution - a.contribution);
  });

  readonly decreasingFactors = computed<ExplanationFactor[]>(() => {
    const p = this.prediction();
    if (!p) return [];
    return p.explanations
      .filter(e => e.direction === 'decrease')
      .sort((a, b) => b.contribution - a.contribution);
  });

  getBarWidth(contribution: number): number {
    return Math.min(Math.abs(contribution), 100);
  }
}
