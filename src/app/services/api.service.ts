import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PredictionRequest, PredictionResponse } from '../models/prediction.model';
import { FeedbackRequest, FeedbackResponse } from '../models/feedback.model';
import { ModelStatus, ModelVersion, ModelComparisonRow } from '../models/model-status.model';
import { AdaptiveMetrics, AdaptiveUpdateResponse } from '../models/adaptive.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api';

  predict(request: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.baseUrl}/predict`, request).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  submitFeedback(request: FeedbackRequest): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.baseUrl}/feedback`, request).pipe(
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

  triggerAdaptiveUpdate(): Observable<AdaptiveUpdateResponse> {
    return this.http.post<AdaptiveUpdateResponse>(`${this.baseUrl}/adaptive/update`, {}).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the API server. Please ensure the backend is running.';
    } else {
      errorMessage = `Server error ${error.status}: ${error.message || 'Unknown error'}`;
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
