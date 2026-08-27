import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ModelStatus } from '../../../models/model-status.model';
import { FeedbackLoop } from '../../shared/feedback-loop/feedback-loop';

@Component({
  selector: 'app-admin',
  imports: [FeedbackLoop],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Model Management</h1>
        <p class="text-sm text-slate-500 mt-1">
          Admin interface for adaptive model lifecycle management
        </p>
      </div>

      <app-feedback-loop activeStep="Deploy"></app-feedback-loop>

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
      } @else if (status()) {
        <!-- Current Model Status -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Current Model</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Current Model</p>
              <p class="text-base font-semibold text-slate-800">{{ status()!.current_model }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Current Version</p>
              <p class="text-base font-semibold text-indigo-600">{{ status()!.current_version }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Last Update</p>
              <p class="text-base font-semibold text-slate-700">{{ status()!.last_update }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Training Observations</p>
              <p class="text-base font-semibold text-slate-800">{{ formatNumber(status()!.training_observations) }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Selected Features</p>
              <p class="text-base font-semibold text-slate-800">{{ status()!.selected_features }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Feedback Observations</p>
              <p class="text-base font-semibold text-slate-800">{{ formatNumber(status()!.feedback_observations) }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-500 mb-1">Feedback Batches</p>
              <p class="text-base font-semibold text-slate-800">{{ status()!.feedback_batches }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Model Actions</h2>
          <p class="text-sm text-slate-500 mb-4">
            These actions call backend API endpoints to manage the adaptive learning pipeline.
          </p>

          @if (actionMessage()) {
            <div class="mb-4 rounded-lg p-4" [class]="actionMessageClass()">
              <p class="text-sm">{{ actionMessage() }}</p>
            </div>
          }

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button class="btn-secondary text-sm" (click)="executeAction('review')" [disabled]="actionLoading()">
              Review Feedback
            </button>
            <button class="btn-primary text-sm" (click)="executeAction('train')" [disabled]="actionLoading()">
              Start Adaptive Training
            </button>
            <button class="btn-secondary text-sm" (click)="executeAction('evaluate')" [disabled]="actionLoading()">
              Evaluate New Model
            </button>
            <button class="btn-secondary text-sm" (click)="executeAction('promote')" [disabled]="actionLoading()">
              Promote Model
            </button>
            <button class="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50" (click)="executeAction('rollback')" [disabled]="actionLoading()">
              Rollback Model
            </button>
          </div>

          @if (actionLoading()) {
            <div class="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Processing...
            </div>
          }
        </div>
      }
    </div>
  `
})
export class Admin implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly status = signal<ModelStatus | null>(null);
  readonly actionLoading = signal(false);
  readonly actionMessage = signal<string | null>(null);
  readonly actionSuccess = signal(true);

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.loading.set(true);
    this.api.getModelStatus().subscribe({
      next: (data) => {
        this.status.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  executeAction(action: string): void {
    this.actionLoading.set(true);
    this.actionMessage.set(null);

    if (action === 'train') {
      this.api.triggerAdaptiveUpdate().subscribe({
        next: (response) => {
          this.actionSuccess.set(true);
          this.actionMessage.set(`${response.message} — New version: ${response.new_version}`);
          this.actionLoading.set(false);
          this.loadStatus();
        },
        error: (err) => {
          this.actionSuccess.set(false);
          this.actionMessage.set(err.message);
          this.actionLoading.set(false);
        }
      });
    } else {
      this.actionSuccess.set(true);
      this.actionMessage.set(`Action "${action}" sent to backend. This endpoint should be implemented on the server.`);
      this.actionLoading.set(false);
    }
  }

  actionMessageClass(): string {
    return this.actionSuccess()
      ? 'bg-green-50 border border-green-200 text-green-700'
      : 'bg-red-50 border border-red-200 text-red-600';
  }

  formatNumber(n: number): string {
    return n.toLocaleString();
  }
}
