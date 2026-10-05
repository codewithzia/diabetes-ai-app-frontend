import { Injectable, signal, computed } from '@angular/core';
import { AssessmentFeatures, PredictionResponse } from '../models/prediction.model';
import { FeedbackResponse, FeedbackType, HelpfulnessLevel } from '../models/feedback.model';

/** Sanitised record of the most recent API call (for the demo debug panel). */
export interface ApiCallRecord {
  method: string;
  url: string;
  status: number | null; // null when unreachable
  ms: number;
  response: unknown; // sanitised JSON payload (no paths/secrets)
  at: Date;
}

@Injectable({ providedIn: 'root' })
export class AppState {
  private readonly _features = signal<AssessmentFeatures | null>(null);
  private readonly _prediction = signal<PredictionResponse | null>(null);
  private readonly _feedbackResponse = signal<FeedbackResponse | null>(null);

  /** Research Demonstration Mode: synthetic data only, adaptive updates hidden. */
  private readonly _demoMode = signal(true);
  private readonly _lastApiCall = signal<ApiCallRecord | null>(null);
  private readonly _feedbackType = signal<FeedbackType | null>(null);
  private readonly _helpfulness = signal<HelpfulnessLevel | null>(null);
  private readonly _comment = signal<string>('');

  readonly features = this._features.asReadonly();
  readonly prediction = this._prediction.asReadonly();
  readonly feedbackResponse = this._feedbackResponse.asReadonly();
  readonly demoMode = this._demoMode.asReadonly();
  readonly lastApiCall = this._lastApiCall.asReadonly();
  readonly feedbackType = this._feedbackType.asReadonly();
  readonly helpfulness = this._helpfulness.asReadonly();
  readonly comment = this._comment.asReadonly();

  readonly hasPrediction = computed(() => this._prediction() !== null);

  setFeatures(features: AssessmentFeatures): void {
    this._features.set(features);
  }

  setPrediction(prediction: PredictionResponse): void {
    this._prediction.set(prediction);
  }

  setFeedbackResponse(response: FeedbackResponse): void {
    this._feedbackResponse.set(response);
  }

  setDemoMode(enabled: boolean): void {
    this._demoMode.set(enabled);
  }

  setLastApiCall(record: ApiCallRecord): void {
    this._lastApiCall.set(record);
  }

  setFeedbackMeta(type: FeedbackType, helpfulness: HelpfulnessLevel, comment: string): void {
    this._feedbackType.set(type);
    this._helpfulness.set(helpfulness);
    this._comment.set(comment);
  }

  clearPrediction(): void {
    this._prediction.set(null);
    this._feedbackResponse.set(null);
    this._feedbackType.set(null);
    this._helpfulness.set(null);
    this._comment.set('');
  }
}
