export interface Client {
  id: number;
  created_at: string | null;
  client_id: string | null;
  form_complete_time: string | null;
  onboarding_call_time: string | null;
  launch_call_time: string | null;
  last_meaningful_activity_time: string | null;
  csm_name: string | null;
  status: string | null;
  started_on: string | null;
  churned_on: string | null;
  total_usage: number | null;
  inbound_calls: number | null;
  new_reviews: number | null;
  new_website_leads: number | null;
  minutes_to_100_usage: number | null;
  minutes_to_first_value: number | null;
  // Additional nullable fields requested for table; backend will populate later
  company_name?: string | null;
  name?: string | null;
  closer?: string | null;
  // "Contact ID"?: string | number | null;
  location_id?: string | number | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  stripe_customer_id?: string | null;
  // "Time Enrolled"?: string | null;
  cancellation_reason?: string | null;
  // "Site Done"?: boolean | string | null;
  // "Delivery Person"?: string | null;
  cancellation_notes?: string | null;
  ai_content_created?: boolean | string | null;
  a2p_provider?: boolean | string | null;
  referrer?: string | null;
}

export interface ClientFilters {
  status?: string;
  csmName?: string;
  searchTerm?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type:
    | "number"
    | "integer"
    | "percentage"
    | "duration"
    | "text"
    | "date"
    | "timestamp";
  className?: string;
  description?: string;
}

export interface TableConfig<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  showTotals?: boolean;
  search?: {
    // weight per column key; higher means more important in search scoring
    weights?: Partial<Record<keyof T, number>>;
    // optional custom scorer: return a non-negative score; 0 means not a match
    // term will be provided normalized according to case sensitivity choice in consumer
    scorer?: (row: T, term: string) => number;
  };
}
