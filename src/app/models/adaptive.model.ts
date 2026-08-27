export interface MetricPoint {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
}

export interface FeedbackMetricPoint {
  version: string;
  positive_feedback: number;
  negative_feedback: number;
  mean_reward: number;
}

export interface AdaptiveMetrics {
  performance_metrics: MetricPoint[];
  feedback_metrics: FeedbackMetricPoint[];
  total_feedback: number;
  total_predictions: number;
  current_version: string;
  last_update: string;
}

export interface AdaptiveUpdateResponse {
  status: string;
  new_version: string;
  message: string;
}
