import { AssessmentFeatures, ExplanationFactor } from './prediction.model';

export interface HistoryItem {
  prediction_id: string;
  created_at: string;
  model_version: string | null;
  prediction: number | null;
  probability: number | null;
  risk_category: string | null;
  threshold: number | null;
  feedback_count: number;
  latest_feedback: 'agree' | 'disagree' | null;
  latest_helpfulness: string | null;
  latest_feedback_at: string | null;
  has_verified_label: boolean;
  adaptive_processed: boolean;
}

export interface HistoryListResponse {
  count_total: number;
  feedback_total: number;
  items: HistoryItem[];
}

export interface HistoryFeedbackEntry {
  feedback_id: string;
  feedback: 'agree' | 'disagree' | null;
  helpfulness: string | null;
  comment: string | null;
  reward: number | null;
  has_verified_label: boolean;
  adaptive_processed: boolean;
  created_at: string;
}

export interface PredictionDetail {
  prediction_id: string;
  created_at: string;
  model_version: string | null;
  features: Partial<AssessmentFeatures> & Record<string, string>;
  result: {
    prediction?: number;
    probability?: number;
    risk_category?: string;
    model_version?: string;
    threshold?: number;
    explanations?: ExplanationFactor[];
    prediction_id?: string;
  };
  feedback: HistoryFeedbackEntry[];
}
