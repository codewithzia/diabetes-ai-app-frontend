import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AdaptiveMetrics, MetricPoint, FeedbackMetricPoint } from '../../../models/adaptive.model';
import { ModelVersion } from '../../../models/model-status.model';
import { FeedbackLoop } from '../../shared/feedback-loop/feedback-loop';

@Component({
  selector: 'app-adaptive-dashboard',
  imports: [FeedbackLoop],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Adaptive Learning Monitor</h1>
        <p class="text-sm text-slate-500 mt-1">
          Model evolution across feedback batches with performance and reward tracking
        </p>
      </div>

      <app-feedback-loop activeStep="Evaluate"></app-feedback-loop>

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
      } @else if (metrics()) {
        <!-- Summary Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="card !p-4">
            <p class="text-xs text-slate-500 mb-1">Feedback Observations</p>
            <p class="text-2xl font-bold text-slate-800">{{ formatNumber(metrics()!.total_feedback) }}</p>
          </div>
          <div class="card !p-4">
            <p class="text-xs text-slate-500 mb-1">Total Predictions</p>
            <p class="text-2xl font-bold text-slate-800">{{ formatNumber(metrics()!.total_predictions) }}</p>
          </div>
          <div class="card !p-4">
            <p class="text-xs text-slate-500 mb-1">Current Model</p>
            <p class="text-2xl font-bold text-indigo-600">{{ metrics()!.current_version }}</p>
          </div>
          <div class="card !p-4">
            <p class="text-xs text-slate-500 mb-1">Last Update</p>
            <p class="text-sm font-semibold text-slate-700">{{ metrics()!.last_update }}</p>
          </div>
        </div>

        <!-- Model Versions Timeline -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Model Versions</h2>
          <div class="flex flex-wrap gap-3">
            @for (v of modelVersions; track v.version) {
              <div class="flex items-center gap-3 px-4 py-3 rounded-lg border"
                   [class]="v.version === metrics()!.current_version ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                     [class]="v.version === metrics()!.current_version ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'">
                  {{ v.version }}
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-700">{{ v.label }}</p>
                  <p class="text-xs text-slate-500">{{ v.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Performance Metrics Chart -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Performance Metrics Across Versions</h2>
          <div class="overflow-x-auto">
            <svg [attr.width]="chartWidth" [attr.height]="chartHeight" class="min-w-full">
              <!-- Grid lines -->
              @for (tick of yTicks; track tick) {
                <line [attr.x1]="padding" [attr.y1]="getY(tick)" [attr.x2]="chartWidth - padding" [attr.y2]="getY(tick)" stroke="#f1f5f9" stroke-width="1" />
                <text [attr.x]="padding - 10" [attr.y]="getY(tick) + 4" text-anchor="end" class="text-xs fill-slate-400">{{ tick.toFixed(1) }}</text>
              }

              <!-- X-axis labels -->
              @for (point of metrics()!.performance_metrics; track point.version; let i = $index) {
                <text [attr.x]="getX(i)" [attr.y]="chartHeight - padding + 20" text-anchor="middle" class="text-xs fill-slate-500">{{ point.version }}</text>
              }

              <!-- Metric lines -->
              @for (metric of metricLines; track metric.key) {
                <polyline
                  [attr.points]="getLinePoints(metric.key)"
                  fill="none"
                  [attr.stroke]="metric.color"
                  stroke-width="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
                @for (point of metrics()!.performance_metrics; track point.version + '-' + i; let i = $index) {
                  <circle [attr.cx]="getX(i)" [attr.cy]="getYPoint(point, metric.key)" [attr.r]="3" [attr.fill]="metric.color" />
                }
              }
            </svg>
          </div>
          <div class="flex flex-wrap gap-4 mt-4 justify-center">
            @for (metric of metricLines; track metric.key) {
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" [style.background]="metric.color"></div>
                <span class="text-xs text-slate-600">{{ metric.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Feedback Chart -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Feedback & Reward Signal</h2>
          <div class="overflow-x-auto">
            <svg [attr.width]="chartWidth" [attr.height]="chartHeight" class="min-w-full">
              @for (tick of yTicks; track tick) {
                <line [attr.x1]="padding" [attr.y1]="getY(tick)" [attr.x2]="chartWidth - padding" [attr.y2]="getY(tick)" stroke="#f1f5f9" stroke-width="1" />
                <text [attr.x]="padding - 10" [attr.y]="getY(tick) + 4" text-anchor="end" class="text-xs fill-slate-400">{{ tick.toFixed(1) }}</text>
              }

              @for (point of metrics()!.feedback_metrics; track point.version; let i = $index) {
                <text [attr.x]="getX(i)" [attr.y]="chartHeight - padding + 20" text-anchor="middle" class="text-xs fill-slate-500">{{ point.version }}</text>
              }

              @for (line of feedbackLines; track line.key) {
                <polyline
                  [attr.points]="getFeedbackLinePoints(line.key)"
                  fill="none"
                  [attr.stroke]="line.color"
                  stroke-width="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
                @for (point of metrics()!.feedback_metrics; track point.version + '-' + i; let i = $index) {
                  <circle [attr.cx]="getX(i)" [attr.cy]="getYFeedbackPoint(point, line.key)" [attr.r]="3" [attr.fill]="line.color" />
                }
              }
            </svg>
          </div>
          <div class="flex flex-wrap gap-4 mt-4 justify-center">
            @for (line of feedbackLines; track line.key) {
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" [style.background]="line.color"></div>
                <span class="text-xs text-slate-600">{{ line.label }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AdaptiveDashboard implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly metrics = signal<AdaptiveMetrics | null>(null);

  readonly modelVersions: ModelVersion[] = [
    { version: 'V0', label: 'Initial', description: 'Baseline model', date: '2024-01-01' },
    { version: 'V1', label: 'Feedback Batch 1', description: 'First adaptive update', date: '2024-03-15' },
    { version: 'V2', label: 'Feedback Batch 2', description: 'Second adaptive update', date: '2024-06-01' },
    { version: 'V3', label: 'Feedback Batch 3', description: 'Third adaptive update', date: '2024-09-10' },
    { version: 'V4', label: 'Final', description: 'Current production model', date: '2024-12-20' },
  ];

  readonly metricLines = [
    { key: 'accuracy' as keyof MetricPoint, label: 'Accuracy', color: '#4f46e5' },
    { key: 'precision' as keyof MetricPoint, label: 'Precision', color: '#0ea5e9' },
    { key: 'recall' as keyof MetricPoint, label: 'Recall', color: '#10b981' },
    { key: 'f1' as keyof MetricPoint, label: 'F1', color: '#f59e0b' },
    { key: 'roc_auc' as keyof MetricPoint, label: 'ROC-AUC', color: '#ec4899' },
    { key: 'pr_auc' as keyof MetricPoint, label: 'PR-AUC', color: '#8b5cf6' },
  ];

  readonly feedbackLines = [
    { key: 'positive_feedback' as keyof FeedbackMetricPoint, label: 'Positive Feedback', color: '#10b981' },
    { key: 'negative_feedback' as keyof FeedbackMetricPoint, label: 'Negative Feedback', color: '#ef4444' },
    { key: 'mean_reward' as keyof FeedbackMetricPoint, label: 'Mean Reward', color: '#4f46e5' },
  ];

  readonly chartWidth = 800;
  readonly chartHeight = 320;
  readonly padding = 50;
  readonly yTicks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];

  ngOnInit(): void {
    this.api.getAdaptiveMetrics().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  formatNumber(n: number): string {
    return n.toLocaleString();
  }

  getX(index: number): number {
    const points = this.metrics()?.performance_metrics ?? [];
    if (points.length <= 1) return this.padding;
    const usableWidth = this.chartWidth - 2 * this.padding;
    return this.padding + (index / (points.length - 1)) * usableWidth;
  }

  getY(value: number): number {
    const usableHeight = this.chartHeight - 2 * this.padding;
    return this.padding + (1 - Math.min(Math.max(value, 0), 1)) * usableHeight;
  }

  getLinePoints(key: keyof MetricPoint): string {
    const points = this.metrics()?.performance_metrics ?? [];
    return points.map((p, i) => `${this.getX(i)},${this.getY(p[key] as number)}`).join(' ');
  }

  getFeedbackLinePoints(key: keyof FeedbackMetricPoint): string {
    const points = this.metrics()?.feedback_metrics ?? [];
    return points.map((p, i) => `${this.getX(i)},${this.getY(p[key] as number)}`).join(' ');
  }

  getYPoint(point: MetricPoint, key: keyof MetricPoint): number {
    return this.getY(point[key] as number);
  }

  getYFeedbackPoint(point: FeedbackMetricPoint, key: keyof FeedbackMetricPoint): number {
    return this.getY(point[key] as number);
  }
}
