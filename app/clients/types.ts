export interface Client {
  id: number;
  created_at: string | null;
  client_id: string | null;
  form_complete_time: string | null;
  onboarding_call_time: string | null;
  launch_call_time: string | null;
  last_meaningful_activity_time: string | null;
  "CSM Name": string | null;
  status: string | null;
  started_on: string | null;
  churned_on: string | null;
  total_usage: number | null;
  inbound_calls: number | null;
  new_reviews: number | null;
  new_website_leads: number | null;
  minutes_to_100_usage: number | null;
  minutes_to_first_value: number | null;
}

export interface ClientFilters {
  status?: string;
  csmName?: string;
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
}

export interface TableConfig<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  showTotals?: boolean;
}
