import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AppState } from '../../../services/app-state';
import { AdaptiveStatus } from '../../../models/adaptive.model';
import { ModelStatus } from '../../../models/model-status.model';

@Component({
  selector: 'app-system-status',
  imports: [],
  template: `
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">System Status</h2>
        <span class="inline-flex items-center gap-1.5 text-xs font-medium"
              [class]="connected() ? 'text-green-600' : 'text-red-600'">
          <span class="w-2 h-2 rounded-full"
                [class]="connected() ? 'bg-green-500' : 'bg-red-500'"></span>
          {{ connected() ? 'Backend: Connected' : 'Backend: Unavailable' }}
        </span>
      </div>

      @if (error()) {
        <p class="text-sm text-red-600">{{ error() }}</p>
      } @else {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-[11px] text-slate-500">Model</p>
            <p class="text-sm font-semibold text-slate-800">{{ modelStatus()?.current_model ?? 'Logistic Regression' }}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-[11px] text-slate-500">Active Version</p>
            <p class="text-sm font-semibold text-indigo-600">{{ adaptiveStatus()?.active_version ?? '—' }}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-[11px] text-slate-500">Decision Threshold</p>
            <p class="text-sm font-semibold text-slate-800">{{ thresholdLabel() }}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-[11px] text-slate-500">Mode</p>
            <p class="text-sm font-semibold text-slate-800 uppercase">{{ adaptiveStatus()?.mode ?? '—' }}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-[11px] text-slate-500">Adaptive Update</p>
            <p class="text-sm font-semibold"
               [class]="adaptiveStatus()?.adaptive_enabled ? 'text-green-600' : 'text-amber-600'">
              {{ adaptiveStatus()?.adaptive_enabled ? 'Enabled (manual)' : 'Disabled' }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-[11px] text-slate-500">Pending Verified Feedback</p>
            <p class="text-sm font-semibold text-slate-800">{{ adaptiveStatus()?.pending_verified_feedback ?? '—' }}</p>
          </div>
        </div>

        <p class="text-[11px] text-slate-400 mt-3">
          Human-feedback-guided adaptive learning — verified feedback only; candidate models
          require manual approval before activation.
        </p>
      }
    </div>
  `
})
export class SystemStatus implements OnInit {
  private readonly api = inject(ApiService);
  private readonly state = inject(AppState);

  readonly adaptiveStatus = signal<AdaptiveStatus | null>(null);
  readonly modelStatus = signal<ModelStatus | null>(null);
  readonly connected = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.api.getAdaptiveStatus().subscribe({
      next: (s) => {
        this.adaptiveStatus.set(s);
        this.connected.set(true);
      },
      error: (err) => {
        this.error.set(err.message);
        this.connected.set(false);
      },
    });
    this.api.getModelStatus().subscribe({
      next: (s) => this.modelStatus.set(s),
      error: () => { /* status card already shows connection error */ },
    });
  }

  thresholdLabel(): string {
    const t = this.state.prediction()?.threshold;
    return t != null ? t.toFixed(2) : '—';
  }
}
