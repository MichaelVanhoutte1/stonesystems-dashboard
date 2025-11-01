import { TableConfig } from "../types";
import { Client } from "../types";

export const clientsTableConfig: TableConfig<Client> = {
  title: "Clients",
  columns: [
    // Reordered: prioritize identity, status, operations, usage, timelines, IDs/contact
    {
      key: "Company Name",
      label: "Company Name",
      type: "text",
      description: "",
    },
    {
      key: "Name",
      label: "Name",
      type: "text",
      description: "",
    },
    {
      key: "status",
      label: "Status",
      type: "text",
      description: "",
    },
    {
      key: "CSM Name",
      label: "CSM Name",
      type: "text",
      description: "",
    },
    {
      key: "last_meaningful_activity_time",
      label: "Last Activity Time",
      type: "timestamp",
      description: "Most recent meaningful client action",
    },
    {
      key: "total_usage",
      label: "Total Usage",
      type: "integer",
      description: "Cumulative usage count",
    },
    {
      key: "new_reviews",
      label: "New Reviews",
      type: "integer",
      description: "Reviews received recently",
    },
    {
      key: "new_website_leads",
      label: "New Website Leads",
      type: "integer",
      description: "Leads captured on site",
    },
    {
      key: "inbound_calls",
      label: "Inbound Calls",
      type: "integer",
      description: "Total inbound calls",
    },
    {
      key: "minutes_to_first_value",
      label: "Minutes to First Value",
      type: "number",
      description: "Time to first meaningful value",
    },
    {
      key: "minutes_to_100_usage",
      label: "Minutes to 100 Usage",
      type: "number",
      description: "Time to reach first 100 usage units",
    },
    {
      key: "Time Enrolled",
      label: "Time Enrolled",
      type: "timestamp",
      description: "Enrollment timestamp",
    },
    {
      key: "started_on",
      label: "Started On",
      type: "timestamp",
      description: "Service start date",
    },
    {
      key: "created_at",
      label: "Created At",
      type: "timestamp",
      description: "Record creation date",
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
      key: "churned_on",
      label: "Churned On",
      type: "timestamp",
      description: "Churn date if applicable",
    },
    {
      key: "client_id",
      label: "Contact ID",
      type: "text",
      description: "CRM contact identifier",
    },
    {
      key: "Location ID",
      label: "Location ID",
      type: "text",
      description: "CRM location identifier",
    },
    {
      key: "Website Link",
      label: "Website Link",
      type: "text",
      description: "Client website URL",
    },
    {
      key: "Phone Number",
      label: "Phone Number",
      type: "text",
      description: "Primary phone",
    },
    {
      key: "E-mail",
      label: "E-mail",
      type: "text",
      description: "Primary email",
    },
    {
      key: "Stripe Customer ID",
      label: "Stripe Customer ID",
      type: "text",
      description: "Stripe customer reference",
    },
    {
      key: "Site Done",
      label: "Site Done",
      type: "text",
      description: "Website delivery status",
    },
    {
      key: "Delivery Person",
      label: "Delivery Person",
      type: "text",
      description: "Assigned delivery owner",
    },
    {
      key: "A2P",
      label: "A2P",
      type: "text",
      description: "A2P registration status",
    },
    {
      key: "AI Content Created",
      label: "AI Content Created",
      type: "text",
      description: "AI content status",
    },
    {
      key: "Referrer",
      label: "Referrer",
      type: "text",
      description: "Lead source referrer",
    },
    {
      key: "Cancellation Reason",
      label: "Cancellation Reason",
      type: "text",
      description: "Stated reason for cancel",
    },
    {
      key: "Cancellation Notes",
      label: "Cancellation Notes",
      type: "text",
      description: "Additional cancellation notes",
    },
  ],
  data: [],
  showTotals: false,
  search: {
    // Default weights for common string columns; tweak as desired
    weights: {
      "Company Name": 3,
      Name: 2,
      status: 1.5,
      "CSM Name": 1.25,
      Referrer: 1,
      "E-mail": 1,
      "Phone Number": 0.75,
      "Website Link": 0.5,
    },
  },
};
