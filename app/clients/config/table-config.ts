import { TableConfig, TableColumn } from "../types";
import { Client } from "../types";

export const clientsTableConfig: TableConfig<Client> = {
  title: "Clients",
  columns: [
    { key: "client_id", label: "Client ID", type: "text" },
    { key: "status", label: "Status", type: "text" },
    { key: "id", label: "ID", type: "integer" },
    { key: "CSM Name", label: "CSM Name", type: "text" },
    { key: "total_usage", label: "Total Usage", type: "number" },
    { key: "inbound_calls", label: "Inbound Calls", type: "number" },
    { key: "new_reviews", label: "New Reviews", type: "number" },
    { key: "new_website_leads", label: "New Website Leads", type: "number" },
    { key: "created_at", label: "Created At", type: "timestamp" },
    { key: "started_on", label: "Started On", type: "timestamp" },
    { key: "churned_on", label: "Churned On", type: "timestamp" },
    {
      key: "form_complete_time",
      label: "Form Complete Time",
      type: "timestamp",
    },
    {
      key: "onboarding_call_time",
      label: "Onboarding Call Time",
      type: "timestamp",
    },
    { key: "launch_call_time", label: "Launch Call Time", type: "timestamp" },
    {
      key: "last_meaningful_activity_time",
      label: "Last Activity Time",
      type: "timestamp",
    },
    {
      key: "minutes_to_100_usage",
      label: "Minutes to 100 Usage",
      type: "number",
    },
    {
      key: "minutes_to_first_value",
      label: "Minutes to First Value",
      type: "number",
    },
  ],
  data: [],
  showTotals: false,
};
