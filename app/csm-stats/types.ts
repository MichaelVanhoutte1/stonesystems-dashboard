export interface CSM {
  id: string;
  name: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// Client Onboarding Metrics
export interface ClientOnboardingMetrics {
  csm: string;
  newClients: number;
  formsMissing: number;
  formCompletePercentage: number;
  formCompleteTimeAvg: string; // Duration format like "2d 3h 15m"
  onboardCallShow: number;
  onboardCallShowPercentage: number;
  timeToOnboardCallAvg: string; // Duration format
  launchCallShow: number;
  launchCallShowPercentage: number;
  timeToLaunchCallAvg: string; // Duration format
  ttfv: string; // Time to First Value - Duration format
  tta: string; // Time to Activation - Duration format
  activatedUnder30Days: number;
  activatedUnder30DaysPercentage: number;
}

// Customer Retention Metrics
export interface CustomerRetentionMetrics {
  csm: string;
  clientsManaging: number;
  chi: number; // Customer Health Index
  inactiveClientsPercentage: number;
  avgMonthlyUsagePerClient: number;
  avgMonthlyReviews: number;
  avgMonthlyNewLeads: number;
  csatCount: number;
  csatGoodPercentage: number;
  ccDeclined: number;
  ccDeclinedRate: number;
  refundDisputeRate: number;
  churned: number;
  churnRate: number;
}

// Account Expansion Metrics
export interface AccountExpansionMetrics {
  csm: string;
  referralSignups: number;
  upsellApptsTaken: number;
  closed: number;
  closeRate: number;
  upgrades: number;
  upgradeRate: number;
  closedFollowup: number;
  closedFollowupPercentage: number;
}

// GMB Expert Metrics
export interface GMBExpertMetrics {
  expert: string;
  unsuspended: number;
  verified: number;
  gmbAccess: number;
}

// API Response Types
export interface CSMStatsResponse {
  clientOnboarding: ClientOnboardingMetrics[];
  totals: ClientOnboardingMetrics;
}

// Table Column Configuration
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type: "number" | "percentage" | "duration" | "text" | "todo";
  isCalculated?: boolean;
  className?: string;
}

// Table Configuration
export interface TableConfig<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  showTotals?: boolean;
}

// API Error Types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
