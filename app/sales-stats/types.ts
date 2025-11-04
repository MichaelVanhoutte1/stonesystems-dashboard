export interface DateRange {
  startDate: string;
  endDate: string;
}

// Supabase table types
export interface Opportunity {
  id: number;
  created_at: string;
  company: string;
  name: string;
  contact_id: string;
  status: string;
  gmb_verified: boolean;
  setter: string;
  closer: string;
  monthly_revenue: string;
  source: string;
  campaign: string;
  ad_set: string;
  ad: string;
  updated_at: string;
  upgrade: boolean;
  followup: boolean;
}

export interface Appointment {
  id: number;
  created_at: string;
  company: string;
  name: string;
  contact_id: string;
  status: string;
  appointment_date: string;
  setter: string;
  closer: string;
  source: string;
  campaign: string;
  adset: string;
  ad: string;
}

// Setter Metrics
export interface SetterMetrics {
  setter: string;
  timeToContact: string; // TODO
  apptsBooked: number;
  apptsShowed: number;
  showRate: number;
  apptsClosed: number;
  closeRate: number;
}

// Closer Metrics
export interface CloserMetrics {
  closer: string;
  apptsTaken: number;
  showRate: number;
  closedPaid: number;
  closedTrial: number;
  closeRate: number;
  upgrades: number;
  upgradeRate: number;
}

// API Response Types
export interface SalesStatsResponse {
  setterMetrics: SetterMetrics[];
  closerMetrics: CloserMetrics[];
  setterTotals: SetterMetrics;
  closerTotals: CloserMetrics;
}

// // Table Column Configuration
// export interface TableColumn<T> {
//   key: keyof T;
//   label: string;
//   type: "number" | "integer" | "percentage" | "duration" | "text" | "todo";
//   isCalculated?: boolean;
//   className?: string;
//   description?: string;
// }

// // Table Configuration
// export interface TableConfig<T> {
//   title: string;
//   columns: TableColumn<T>[];
//   data: T[];
//   showTotals?: boolean;
// }

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
