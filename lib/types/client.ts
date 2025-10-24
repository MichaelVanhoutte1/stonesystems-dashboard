export interface ClientData {
  id: number;
  created_at: string; // ISO timestamp string
  client_id: string;
  form_complete_time: string | null; // ISO timestamp string
  onboarding_call_time: string | null; // ISO timestamp string
  launch_call_time: string | null; // ISO timestamp string
  last_meaningful_activity_time: string | null; // ISO timestamp string
  "CSM Name": string | null;
  status: string | null;
  started_on: string | null; // ISO timestamp string
  churned_on: string | null; // ISO timestamp string
  total_usage: number | null;
  inbound_calls: number | null;
  new_reviews: number | null;
  new_website_leads: number | null;
  minutes_to_100_usage: number | null;
  minutes_to_first_value: number | null;
}
