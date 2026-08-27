import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ModelComparisonRow } from '../../../models/model-status.model';

@Component({
  selector: 'app-model-comparison',
  imports: [],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Model Comparison</h1>
        <p class="text-sm text-slate-500 mt-1">
          Performance comparison across candidate models — Logistic Regression selected for deployment
        </p>
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
            <p class="text-sm text-red-600">{{ error() }}</p>
          </div>
        </div>
      } @else {
        <div class="card !p-0 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50">
                  <th class="text-left px-6 py-4 text-sm font-semibold text-slate-700">Model</th>
                  <th class="text-right px-4 py-4 text-sm font-semibold text-slate-700">Accuracy</th>
                  <th class="text-right px-4 py-4 text-sm font-semibold text-slate-700">Precision</th>
                  <th class="text-right px-4 py-4 text-sm font-semibold text-slate-700">Recall</th>
                  <th class="text-right px-4 py-4 text-sm font-semibold text-slate-700">F1</th>
                  <th class="text-right px-4 py-4 text-sm font-semibold text-slate-700">ROC-AUC</th>
                  <th class="text-right px-4 py-4 text-sm font-semibold text-slate-700">PR-AUC</th>
                </tr>
              </thead>
              <tbody>
                @for (row of models(); track row.model) {
                  <tr
                    class="border-b border-slate-100 transition-colors"
                    [class]="row.selected ? 'bg-indigo-50' : 'hover:bg-slate-50'"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-slate-800">{{ row.model }}</span>
                        @if (row.selected) {
                          <span class="badge bg-indigo-100 text-indigo-700">Selected</span>
                        }
                      </div>
                    </td>
                    <td class="text-right px-4 py-4 text-sm font-mono text-slate-700">{{ formatMetric(row.accuracy) }}</td>
                    <td class="text-right px-4 py-4 text-sm font-mono text-slate-700">{{ formatMetric(row.precision) }}</td>
                    <td class="text-right px-4 py-4 text-sm font-mono text-slate-700">{{ formatMetric(row.recall) }}</td>
                    <td class="text-right px-4 py-4 text-sm font-mono text-slate-700">{{ formatMetric(row.f1) }}</td>
                    <td class="text-right px-4 py-4 text-sm font-mono text-slate-700">{{ formatMetric(row.roc_auc) }}</td>
                    <td class="text-right px-4 py-4 text-sm font-mono text-slate-700">{{ formatMetric(row.pr_auc) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-6 rounded-lg bg-indigo-50 border border-indigo-100 p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-indigo-800 leading-relaxed">
              Logistic Regression was selected based on balanced performance across all metrics,
              interpretability for explainable AI requirements, and suitability for the
              human-feedback-guided adaptive learning pipeline.
            </p>
          </div>
        </div>
      }
    </div>
  `
})
export class ModelComparison implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly models = signal<ModelComparisonRow[]>([]);

  ngOnInit(): void {
    this.api.getModelComparison().subscribe({
      next: (data) => {
        this.models.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  formatMetric(value: number): string {
    return (value * 100).toFixed(2) + '%';
  }
}
