import { TableConfig } from "../types";
import { Client, ClientStatus } from "../types";
import { Badge } from "@/components/ui/badge";

export const clientsTableConfig: TableConfig<Client> = {
  title: "Clients",
  columns: [
    // Reordered: prioritize identity, status, operations, usage, timelines, IDs/contact
    {
      key: "company_name",
      label: "Company Name",
      type: "text",
      description: "",
    },
    {
      key: "name",
      label: "Name",
      type: "text",
      description: "",
    },
    {
      key: "status",
      label: "Status",
      type: "text",
      description: "",
      render: (value) => {
        const status = (value as ClientStatus) || null;
        const getVariant = () => {
          switch (status) {
            case "Active":
              return "default" as const;
            case "Cancelled":
            case "Churned":
              return "destructive" as const;
            case "CC Declined":
              return "secondary" as const;
            default:
              return "outline" as const;
          }
        };
        return <Badge variant={getVariant()}>{status ?? "N/A"}</Badge>;
      },
    },
    {
      key: "csm_name",
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
    // {
    //   key: "Time Enrolled",
    //   label: "Time Enrolled",
    //   type: "timestamp",
    //   description: "Enrollment timestamp",
    // },
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
      key: "location_id",
      label: "Location ID",
      type: "text",
      description: "CRM location identifier",
    },
    {
      key: "website",
      label: "Website Link",
      type: "text",
      description: "Client website URL",
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "text",
      description: "Primary phone",
    },
    {
      key: "email",
      label: "E-mail",
      type: "text",
      description: "Primary email",
    },
    {
      key: "stripe_customer_id",
      label: "Stripe Customer ID",
      type: "text",
      description: "Stripe customer reference",
    },
    // {
    //   key: "Site Done",
    //   label: "Site Done",
    //   type: "text",
    //   description: "Website delivery status",
    // },
    // {
    //   key: "Delivery Person",
    //   label: "Delivery Person",
    //   type: "text",
    //   description: "Assigned delivery owner",
    // },
    {
      key: "a2p_provider",
      label: "A2P",
      type: "text",
      description: "A2P registration status",
    },
    {
      key: "ai_content_created",
      label: "AI Content Created",
      type: "text",
      description: "AI content status",
    },
    {
      key: "referrer",
      label: "Referrer",
      type: "text",
      description: "Lead source referrer",
    },
    {
      key: "cancellation_reason",
      label: "Cancellation Reason",
      type: "text",
      description: "Stated reason for cancel",
    },
    {
      key: "cancellation_notes",
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
      company_name: 3,
      name: 2,
      status: 1.5,
      csm_name: 1.25,
      referrer: 1,
      email: 1,
      phone: 0.75,
      website: 0.5,
    },
  },
};
