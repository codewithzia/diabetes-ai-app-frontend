import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { PredictionRequest, PredictionResponse } from '../models/prediction.model';
import { FeedbackRequest, FeedbackResponse } from '../models/feedback.model';
import { ModelStatus, ModelVersion, ModelComparisonRow } from '../models/model-status.model';
import { AdaptiveMetrics, AdaptiveStatus, AdaptiveUpdateResponse } from '../models/adaptive.model';
import { HistoryListResponse, PredictionDetail } from '../models/history.model';

const REQUEST_TIMEOUT_MS = 30000;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  predict(request: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.baseUrl}/predict`, request).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      catchError((err) => this.handleError(err))
    );
  }

  submitFeedback(request: FeedbackRequest): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.baseUrl}/feedback`, request).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      catchError((err) => this.handleError(err))
    );
  }

  getModelStatus(): Observable<ModelStatus> {
    return this.http.get<ModelStatus>(`${this.baseUrl}/model/status`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  getModelVersions(): Observable<ModelVersion[]> {
    return this.http.get<ModelVersion[]>(`${this.baseUrl}/model/versions`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  getModelComparison(): Observable<ModelComparisonRow[]> {
    return this.http.get<ModelComparisonRow[]>(`${this.baseUrl}/model/comparison`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  getAdaptiveMetrics(): Observable<AdaptiveMetrics> {
    return this.http.get<AdaptiveMetrics>(`${this.baseUrl}/adaptive/metrics`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /** Sanitised adaptive-learning registry status (no filesystem paths). */
  getAdaptiveStatus(): Observable<AdaptiveStatus> {
    return this.http.get<AdaptiveStatus>(`${this.baseUrl}/adaptive/status`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /** Read-only prediction history (submitted cases, newest first). */
  getPredictionHistory(): Observable<HistoryListResponse> {
    return this.http.get<HistoryListResponse>(`${this.baseUrl}/predictions`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /** Read-only detail for one submitted prediction. */
  getPredictionDetail(predictionId: string): Observable<PredictionDetail> {
    return this.http.get<PredictionDetail>(`${this.baseUrl}/predictions/${predictionId}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Administrative/research operation. Must only be called from the
   * admin area after explicit user confirmation. Never called
   * automatically by the normal prediction/feedback flow.
   */
  triggerAdaptiveUpdate(): Observable<AdaptiveUpdateResponse> {
    return this.http.post<AdaptiveUpdateResponse>(`${this.baseUrl}/adaptive/update`, {}).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage: string;
    if (error.name === 'TimeoutError') {
      errorMessage = 'The prediction service did not respond in time. Please try again.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the prediction service. '
        + 'Please make sure the Flask backend is running on port 5000.';
    } else if (error.error && typeof error.error.error === 'string') {
      // Flask error responses use {"error": "..."}
      errorMessage = error.error.error;
    } else if (error.status === 400) {
      errorMessage = 'The request was rejected by the prediction service (HTTP 400).';
    } else if (error.status === 403) {
      errorMessage = error.error?.message
        ?? 'This operation is not allowed in the current backend mode (HTTP 403).';
    } else if (error.status === 500) {
      errorMessage = 'The prediction service reported an internal error (HTTP 500).';
    } else {
      errorMessage = `Server error ${error.status}: ${error.message || 'Unknown error'}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
