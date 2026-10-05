import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { AppState } from '../../../services/app-state';

/**
 * Expandable "API Details" panel showing the most recent backend call.
 * Demonstrates live frontend <-> Flask API communication for the thesis
 * supervisor. Only sanitised payloads as returned by the API are shown.
 */
@Component({
  selector: 'app-api-debug',
  imports: [JsonPipe],
  template: `
    <div class="card mb-6">
      <button type="button" class="w-full flex items-center justify-between" (click)="toggle()">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">API Details (Flask Backend)</h2>
        <span class="text-xs text-indigo-600 font-medium">{{ expanded() ? 'Hide' : 'Show' }}</span>
      </button>

      @if (expanded()) {
        @if (call(); as c) {
          <div class="mt-4 space-y-3">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Request</p>
                <p class="text-xs font-mono font-semibold text-slate-800">{{ c.method }} {{ c.url }}</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Status</p>
                <p class="text-xs font-semibold"
                   [class]="c.status && c.status < 400 ? 'text-green-600' : 'text-red-600'">
                  {{ c.status ? c.status + (c.status === 200 ? ' OK' : '') : 'No response' }}
                </p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Duration</p>
                <p class="text-xs font-semibold text-slate-800">{{ c.ms }} ms</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-[11px] text-slate-500">Time</p>
                <p class="text-xs font-semibold text-slate-800">{{ c.at | json }}</p>
              </div>
            </div>
            <div>
              <p class="text-[11px] text-slate-500 mb-1">Response JSON</p>
              <pre class="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto max-h-80">{{ c.response | json }}</pre>
            </div>
          </div>
        } @else {
          <p class="mt-4 text-sm text-slate-400">No API call has been made yet in this session.</p>
        }
      }
    </div>
  `
})
export class ApiDebug {
  private readonly state = inject(AppState);
  readonly call = this.state.lastApiCall;
  readonly expanded = signal(false);

  toggle(): void {
    this.expanded.set(!this.expanded());
  }
}
