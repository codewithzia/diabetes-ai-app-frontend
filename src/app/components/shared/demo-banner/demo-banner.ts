import { Component, inject } from '@angular/core';
import { AppState } from '../../../services/app-state';

@Component({
  selector: 'app-demo-banner',
  imports: [],
  template: `
    @if (state.demoMode()) {
      <div class="bg-amber-50 border-b border-amber-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div class="flex items-center gap-2 min-w-0">
            <span class="inline-flex items-center gap-1.5 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 whitespace-nowrap">
              RESEARCH DEMONSTRATION MODE
            </span>
            <span class="text-xs text-amber-700 truncate">
              Synthetic data only · Adaptive Update: Disabled · Not a medical diagnosis
            </span>
          </div>
          <button class="text-xs font-medium text-amber-800 underline whitespace-nowrap hover:text-amber-900"
                  (click)="state.setDemoMode(false)">
            Exit demo mode
          </button>
        </div>
      </div>
    } @else {
      <div class="bg-slate-50 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-end">
          <button class="text-xs font-medium text-slate-500 underline hover:text-slate-700"
                  (click)="state.setDemoMode(true)">
            Re-enable research demo mode
          </button>
        </div>
      </div>
    }
  `
})
export class DemoBanner {
  readonly state = inject(AppState);
}
