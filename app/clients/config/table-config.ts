import { TableConfig, TableColumn } from "../types";
import { Client } from "../types";

export const clientsTableConfig: TableConfig<Client> = {
  title: "Clients",
  columns: [
    {
      key: "client_id",
      label: "Client ID",
      type: "text",
      description: "Unique client identifier",
    },
    {
      key: "status",
      label: "Status",
      type: "text",
      description: "Current lifecycle status",
    },
    {
      key: "id",
      label: "ID",
      type: "integer",
      description: "Internal numeric ID",
    },
    {
      key: "CSM Name",
      label: "CSM Name",
      type: "text",
      description: "Assigned customer success manager",
    },
    {
      key: "total_usage",
      label: "Total Usage",
      type: "number",
      description: "Cumulative usage count",
    },
    {
      key: "inbound_calls",
      label: "Inbound Calls",
      type: "number",
      description: "Total inbound calls",
    },
    {
      key: "new_reviews",
      label: "New Reviews",
      type: "number",
      description: "Reviews received recently",
    },
    {
      key: "new_website_leads",
      label: "New Website Leads",
      type: "number",
      description: "Leads captured on site",
    },
    {
      key: "created_at",
      label: "Created At",
      type: "timestamp",
      description: "Record creation date",
    },
    {
      key: "started_on",
      label: "Started On",
      type: "timestamp",
      description: "Service start date",
    },
    {
      key: "churned_on",
      label: "Churned On",
      type: "timestamp",
      description: "Churn date if applicable",
    },
    {
      key: "form_complete_time",
      label: "Form Complete Time",
      type: "timestamp",
      description: "Time when onboarding form was completed",
    },
    {
      key: "onboarding_call_time",
      label: "Onboarding Call Time",
      type: "timestamp",
      description: "Scheduled onboarding call time",
    },
    {
      key: "launch_call_time",
      label: "Launch Call Time",
      type: "timestamp",
      description: "Scheduled launch call time",
    },
    {
      key: "last_meaningful_activity_time",
      label: "Last Activity Time",
      type: "timestamp",
      description: "Most recent meaningful client action",
    },
    {
      key: "minutes_to_100_usage",
      label: "Minutes to 100 Usage",
      type: "number",
      description: "Time to reach first 100 usage units",
    },
    {
      key: "minutes_to_first_value",
      label: "Minutes to First Value",
      type: "number",
      description: "Time to first meaningful value",
    },
  ],
  data: [],
  showTotals: false,
};
