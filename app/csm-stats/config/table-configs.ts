import {
  TableConfig,
  ClientOnboardingMetrics,
  CustomerRetentionMetrics,
  AccountExpansionMetrics,
  GMBExpertMetrics,
} from "../types";

// Client Onboarding Table Configuration
export const clientOnboardingConfig: TableConfig<ClientOnboardingMetrics> = {
  title: "Client Onboarding",
  columns: [
    { key: "csm", label: "CSM", type: "text" },
    { key: "newClients", label: "New Clients", type: "number" },
    { key: "formsMissing", label: "Forms Missing", type: "todo" },
    { key: "formCompletePercentage", label: "Form Complete %", type: "todo" },
    {
      key: "formCompleteTimeAvg",
      label: "Form Complete Time (avg)",
      type: "todo",
    },
    { key: "onboardCallShow", label: "Onboard Call Show", type: "todo" },
    {
      key: "onboardCallShowPercentage",
      label: "Onboard Call Show %",
      type: "todo",
    },
    {
      key: "timeToOnboardCallAvg",
      label: "Time To Onboard Call (avg)",
      type: "todo",
    },
    { key: "launchCallShow", label: "Launch Call Show", type: "todo" },
    {
      key: "launchCallShowPercentage",
      label: "Launch Call Show %",
      type: "todo",
    },
    {
      key: "timeToLaunchCallAvg",
      label: "Time To Launch Call (avg)",
      type: "todo",
    },
    { key: "ttfv", label: "TTFV", type: "duration" },
    { key: "tta", label: "TTA", type: "duration" },
    { key: "activatedUnder30Days", label: "Activated <30d", type: "number" },
    {
      key: "activatedUnder30DaysPercentage",
      label: "% Activated <30d",
      type: "percentage",
    },
  ],
  data: [],
  showTotals: true,
};

// Customer Retention Table Configuration
export const customerRetentionConfig: TableConfig<CustomerRetentionMetrics> = {
  title: "Customer Retention",
  columns: [
    { key: "csm", label: "CSM", type: "text" },
    { key: "clientsManaging", label: "Clients Managing", type: "number" },
    { key: "chi", label: "CHI", type: "todo" },
    {
      key: "inactiveClientsPercentage",
      label: "% Inactive Clients",
      type: "todo",
    },
    {
      key: "avgMonthlyUsagePerClient",
      label: "Avg Monthly Usage Per Client",
      type: "number",
    },
    { key: "avgMonthlyReviews", label: "Avg Monthly Reviews", type: "number" },
    {
      key: "avgMonthlyNewLeads",
      label: "Avg Monthly New Leads",
      type: "number",
    },
    { key: "csatCount", label: "CSAT Count", type: "number" },
    { key: "csatGoodPercentage", label: "CSAT Good %", type: "percentage" },
    { key: "ccDeclined", label: "CC Declined", type: "number" },
    { key: "ccDeclinedRate", label: "CC Declined Rate", type: "percentage" },
    { key: "refundDisputeRate", label: "Refund/Dispute Rate", type: "todo" },
    { key: "churned", label: "# Churned", type: "number" },
    { key: "churnRate", label: "Churn Rate", type: "percentage" },
  ],
  data: [],
  showTotals: true,
};

// Account Expansion Table Configuration
export const accountExpansionConfig: TableConfig<AccountExpansionMetrics> = {
  title: "Account Expansion",
  columns: [
    { key: "csm", label: "CSM", type: "text" },
    { key: "referralSignups", label: "Referral Signups", type: "number" },
    { key: "upsellApptsTaken", label: "Upsell Appts Taken", type: "todo" },
    { key: "closed", label: "Closed", type: "todo" },
    { key: "closeRate", label: "Close Rate", type: "todo" },
    { key: "upgrades", label: "Upgrades", type: "todo" },
    { key: "upgradeRate", label: "Upgrade Rate", type: "todo" },
    { key: "closedFollowup", label: "Closed (Followup)", type: "todo" },
    {
      key: "closedFollowupPercentage",
      label: "% Closed (Followup)",
      type: "todo",
    },
  ],
  data: [],
  showTotals: true,
};

// GMB Expert Table Configuration
export const gmbExpertConfig: TableConfig<GMBExpertMetrics> = {
  title: "GMB EXPERT",
  columns: [
    { key: "expert", label: "Expert", type: "text" },
    { key: "unsuspended", label: "Unsuspended", type: "todo" },
    { key: "verified", label: "Verified", type: "todo" },
    { key: "gmbAccess", label: "GMB Access", type: "todo" },
  ],
  data: [],
  showTotals: false,
};
