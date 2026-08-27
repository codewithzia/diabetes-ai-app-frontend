import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="max-w-2xl w-full">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-6 shadow-lg shadow-indigo-200">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 9h-6L8 4z" />
            </svg>
          </div>

          <span class="badge bg-indigo-50 text-indigo-700 mb-4">
            Research Prototype — BRFSS 2021
          </span>

          <h1 class="text-4xl font-bold text-slate-800 mb-3 tracking-tight">
            Adaptive Diabetes Risk Assessment
          </h1>
          <p class="text-lg text-slate-500 mb-8">
            Human-Feedback-Guided AI Prediction System
          </p>

          <div class="card mb-8 text-left">
            <h2 class="text-sm font-semibold text-slate-700 mb-3">Research Overview</h2>
            <p class="text-sm text-slate-600 leading-relaxed mb-4">
              This system demonstrates a Human-in-the-Loop, RLHF-inspired adaptive diabetes prediction
              pipeline. Your feedback contributes to continuous model improvement through a structured
              reward signal mechanism.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="badge bg-slate-100 text-slate-600">Logistic Regression</span>
              <span class="badge bg-slate-100 text-slate-600">49 Features</span>
              <span class="badge bg-slate-100 text-slate-600">Explainable AI</span>
              <span class="badge bg-slate-100 text-slate-600">Adaptive Learning</span>
            </div>
          </div>

          <button class="btn-primary text-lg px-8 py-4" (click)="startAssessment()">
            Start Assessment
          </button>

          <p class="text-xs text-slate-400 mt-8 max-w-md mx-auto leading-relaxed">
            For research purposes only. This system is not a substitute for professional medical
            advice or clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  `
})
export class Welcome {
  constructor(private router: Router) {}

  startAssessment(): void {
    this.router.navigate(['/assessment']);
  }
}
