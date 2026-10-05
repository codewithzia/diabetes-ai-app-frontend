import { Routes } from '@angular/router';
import { Welcome } from './components/pages/welcome/welcome';
import { Assessment } from './components/pages/assessment/assessment';
import { Prediction } from './components/pages/prediction/prediction';
import { FeedbackConfirmation } from './components/pages/feedback-confirmation/feedback-confirmation';
import { AdaptiveDashboard } from './components/pages/adaptive-dashboard/adaptive-dashboard';
import { ModelComparison } from './components/pages/model-comparison/model-comparison';
import { Admin } from './components/pages/admin/admin';
import { History } from './components/pages/history/history';

export const routes: Routes = [
  { path: '', component: Welcome, title: 'Adaptive Diabetes AI — Welcome' },
  { path: 'assessment', component: Assessment, title: 'Assessment — Diabetes AI' },
  { path: 'prediction', component: Prediction, title: 'Prediction — Diabetes AI' },
  { path: 'feedback-confirmation', component: FeedbackConfirmation, title: 'Feedback — Diabetes AI' },
  { path: 'history', component: History, title: 'Prediction History — Diabetes AI' },
  { path: 'adaptive', component: AdaptiveDashboard, title: 'Adaptive Monitor — Diabetes AI' },
  { path: 'comparison', component: ModelComparison, title: 'Model Comparison — Diabetes AI' },
  { path: 'admin', component: Admin, title: 'Admin — Diabetes AI' },
  { path: '**', redirectTo: '' }
];
