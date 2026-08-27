export type FeedbackType = 'agree' | 'disagree';
export type HelpfulnessLevel = 'very_helpful' | 'helpful' | 'neutral' | 'not_helpful' | 'incorrect';

export interface FeedbackRequest {
  prediction_id: string;
  feedback: FeedbackType;
  helpfulness: HelpfulnessLevel;
  comment: string;
}

export interface FeedbackResponse {
  feedback_id: string;
  reward: number;
  status: string;
}

export interface FeedbackConfirmation {
  prediction: string;
  userFeedback: FeedbackType;
  reward: number;
  feedbackId: string;
  timestamp: string;
}
