import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FORM_SECTIONS } from '../../../config/form-config';
import { ApiService } from '../../../services/api.service';
import { AppState } from '../../../services/app-state';
import { AssessmentFeatures } from '../../../models/prediction.model';
import { PredictionResponse } from '../../../models/prediction.model';
import { FeedbackLoop } from '../../shared/feedback-loop/feedback-loop';

@Component({
  selector: 'app-assessment',
  imports: [ReactiveFormsModule, FeedbackLoop],
  templateUrl: './assessment.html'
})
export class Assessment {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly state = inject(AppState);
  private readonly router = inject(Router);

  readonly sections = FORM_SECTIONS;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({});

  constructor() {
    this.sections.forEach(section => {
      section.fields.forEach(field => {
        this.form.addControl(field.key, this.fb.control('', Validators.required));
      });
    });
  }

  isFieldInvalid(key: string): boolean {
    const ctrl = this.form.get(key);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const features = this.form.value as AssessmentFeatures;
    this.state.setFeatures(features);

    this.api.predict({ features }).subscribe({
      next: (response) => {
        this.state.setPrediction(response);
        this.loading.set(false);
        this.router.navigate(['/prediction']);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onReset(): void {
    this.form.reset();
    this.error.set(null);
  }
}
