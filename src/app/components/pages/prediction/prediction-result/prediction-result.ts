import { Component, inject, computed } from '@angular/core';
import { AppState } from '../../../../services/app-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prediction-result',
  imports: [],
  template: `
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Diabetes Risk Assessment</h2>
          <p class="text-sm text-slate-500 mt-0.5">Prediction Result</p>
        </div>
        <span class="badge bg-indigo-50 text-indigo-700">
          Model {{ prediction()?.model_version ?? '—' }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <!-- Risk Gauge -->
        <div class="flex flex-col items-center justify-center">
          <div class="relative w-48 h-48">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#e2e8f0" stroke-width="14" />
              <circle
                cx="100" cy="100" r="85" fill="none"
                [attr.stroke]="gaugeColor()"
                stroke-width="14"
                stroke-linecap="round"
                [attr.stroke-dasharray]="gaugeCircumference"
                [attr.stroke-dashoffset]="gaugeOffset()"
                class="transition-all duration-1000"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-bold text-slate-800">{{ riskPercent() }}%</span>
              <span class="text-xs text-slate-500 mt-1">Risk Score</span>
            </div>
          </div>
          <span class="badge mt-4" [class]="riskBadgeClass()">
            {{ prediction()?.risk_category ?? 'Unknown' }}
          </span>
        </div>

        <!-- Prediction Details -->
        <div class="lg:col-span-2 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Prediction</p>
              <p class="text-lg font-semibold" [class]="predictionTextColor()">
                {{ predictionLabel() }}
              </p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Model</p>
              <p class="text-lg font-semibold text-slate-700">Logistic Regression</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Model Version</p>
              <p class="text-lg font-semibold text-slate-700">{{ prediction()?.model_version ?? '—' }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Threshold</p>
              <p class="text-lg font-semibold text-slate-700">
                {{ thresholdLabel() }}
              </p>
            </div>
          </div>

          <div class="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-sm text-amber-800 leading-relaxed">
                This research prototype provides a statistical risk estimate and does not
                constitute a medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PredictionResult {
  private readonly state = inject(AppState);
  readonly prediction = this.state.prediction;

  readonly gaugeCircumference = 2 * Math.PI * 85;

  readonly riskPercent = computed(() => {
    const p = this.prediction();
    return p ? Math.round(p.probability * 100) : 0;
  });

  readonly gaugeOffset = computed(() => {
    const percent = this.riskPercent();
    return this.gaugeCircumference - (percent / 100) * this.gaugeCircumference;
  });

  gaugeColor(): string {
    const percent = this.riskPercent();
    if (percent >= 70) return '#dc2626';
    if (percent >= 40) return '#f59e0b';
    return '#16a34a';
  }

  riskBadgeClass(): string {
    const percent = this.riskPercent();
    if (percent >= 70) return 'bg-red-100 text-red-700';
    if (percent >= 40) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  }

  predictionLabel(): string {
    const p = this.prediction();
    if (!p) return '—';
    return p.prediction === 1 ? 'Positive' : 'Negative';
  }

  predictionTextColor(): string {
    const p = this.prediction();
    if (!p) return 'text-slate-700';
    return p.prediction === 1 ? 'text-red-600' : 'text-green-600';
  }

  thresholdLabel(): string {
    const p = this.prediction();
    if (!p) return '—';
    return `Optimized (${p.threshold.toFixed(2)})`;
  }
}
