import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FORM_SECTIONS } from '../../../config/form-config';
import { DEMO_PROFILES } from '../../../config/demo-profiles';
import { ApiService } from '../../../services/api.service';
import { AppState } from '../../../services/app-state';
import { AssessmentFeatures } from '../../../models/prediction.model';
import { FeedbackLoop } from '../../shared/feedback-loop/feedback-loop';

@Component({
  selector: 'app-assessment',
  imports: [ReactiveFormsModule, FeedbackLoop],
  templateUrl: './assessment.html'
})
export class Assessment {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  readonly state = inject(AppState);
  private readonly router = inject(Router);

  readonly sections = FORM_SECTIONS;
  readonly demoProfiles = DEMO_PROFILES;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly validationError = signal<string | null>(null);

  readonly form = this.fb.group({});

  constructor() {
    this.sections.forEach(section => {
      section.fields.forEach(field => {
        this.form.addControl(field.key, this.fb.control('', Validators.required));
      });
    });
  }

  applyDemoProfile(profileId: string): void {
    const profile = this.demoProfiles.find(p => p.id === profileId);
    if (!profile) return;
    this.form.patchValue(profile.features);
    this.form.markAllAsTouched();
    this.validationError.set(null);
    this.error.set(null);
  }

  missingFieldCount(): number {
    return Object.values(this.form.controls)
      .filter(c => (c as { invalid: boolean }).invalid).length;
  }

  isFieldInvalid(key: string): boolean {
    const ctrl = this.form.get(key);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationError.set(
        `Please complete all fields before submitting `
        + `(${this.missingFieldCount()} missing).`
      );
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.validationError.set(null);

    const features = this.form.value as AssessmentFeatures;
    this.state.setFeatures(features);

    const started = performance.now();
    this.api.predict({ features }).subscribe({
      next: (response) => {
        this.state.setPrediction(response);
        this.state.setLastApiCall({
          method: 'POST',
          url: '/api/predict',
          status: 200,
          ms: Math.round(performance.now() - started),
          response,
          at: new Date(),
        });
        this.loading.set(false);
        this.router.navigate(['/prediction']);
      },
      error: (err) => {
        this.state.setLastApiCall({
          method: 'POST',
          url: '/api/predict',
          status: null,
          ms: Math.round(performance.now() - started),
          response: { error: err.message },
          at: new Date(),
        });
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
