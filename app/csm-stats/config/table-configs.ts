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
    {
      key: "csm",
      label: "CSM",
      type: "text",
      description: "Customer success manager",
    },
    {
      key: "newClients",
      label: "New Clients",
      type: "integer",
      description: "New clients in period",
    },
    {
      key: "formsMissing",
      label: "Forms Missing",
      type: "todo",
      description: "Clients missing onboarding form",
    },
    {
      key: "formCompletePercentage",
      label: "Form Complete %",
      type: "todo",
      description: "% forms completed",
    },
    {
      key: "formCompleteTimeAvg",
      label: "Form Complete Time (avg)",
      type: "todo",
      description: "Average time to complete form",
    },
    {
      key: "onboardCallShow",
      label: "Onboard Call Show",
      type: "todo",
      description: "Onboarding call shows",
    },
    {
      key: "onboardCallShowPercentage",
      label: "Onboard Call Show %",
      type: "todo",
      description: "% onboarding call shows",
    },
    {
      key: "timeToOnboardCallAvg",
      label: "Time To Onboard Call (avg)",
      type: "todo",
      description: "Avg time to onboarding call",
    },
    {
      key: "launchCallShow",
      label: "Launch Call Show",
      type: "todo",
      description: "Launch call shows",
    },
    {
      key: "launchCallShowPercentage",
      label: "Launch Call Show %",
      type: "todo",
      description: "% launch call shows",
    },
    {
      key: "timeToLaunchCallAvg",
      label: "Time To Launch Call (avg)",
      type: "todo",
      description: "Avg time to launch call",
    },
    {
      key: "ttfv",
      label: "TTFV",
      type: "duration",
      description: "Time to first value",
    },
    {
      key: "tta",
      label: "TTA",
      type: "duration",
      description: "Time to activation",
    },
    {
      key: "activatedUnder30Days",
      label: "Activated <30d",
      type: "number",
      description: "Clients activated <30 days",
    },
    {
      key: "activatedUnder30DaysPercentage",
      label: "% Activated <30d",
      type: "percentage",
      description: "% activated within 30 days",
    },
  ],
  data: [],
  showTotals: true,
};

// Customer Retention Table Configuration
export const customerRetentionConfig: TableConfig<CustomerRetentionMetrics> = {
  title: "Customer Retention",
  columns: [
    {
      key: "csm",
      label: "CSM",
      type: "text",
      description: "Customer success manager",
    },
    {
      key: "clientsManaging",
      label: "Clients Managing",
      type: "integer",
      description: "Active clients per CSM",
    },
    {
      key: "chi",
      label: "CHI",
      type: "todo",
      description: "Customer Health Index",
    },
    {
      key: "inactiveClientsPercentage",
      label: "% Inactive Clients",
      type: "todo",
      description: "% clients inactive",
    },
    {
      key: "avgMonthlyUsagePerClient",
      label: "Avg Monthly Usage Per Client",
      type: "number",
      description: "Average monthly usage per client",
    },
    {
      key: "avgMonthlyReviews",
      label: "Avg Monthly Reviews",
      type: "number",
      description: "Average reviews per month",
    },
    {
      key: "avgMonthlyNewLeads",
      label: "Avg Monthly New Leads",
      type: "number",
      description: "Average new leads per month",
    },
    {
      key: "csatCount",
      label: "CSAT Count",
      type: "number",
      description: "Number of CSAT responses",
    },
    {
      key: "csatGoodPercentage",
      label: "CSAT Good %",
      type: "percentage",
      description: "% positive CSAT",
    },
    {
      key: "ccDeclined",
      label: "CC Declined",
      type: "number",
      description: "Declined credit cards",
    },
    {
      key: "ccDeclinedRate",
      label: "CC Declined Rate",
      type: "percentage",
      description: "% CC declined",
    },
    {
      key: "refundDisputeRate",
      label: "Refund/Dispute Rate",
      type: "todo",
      description: "% refunds or disputes",
    },
    {
      key: "churned",
      label: "# Churned",
      type: "number",
      description: "Clients churned in period",
    },
    {
      key: "churnRate",
      label: "Churn Rate",
      type: "percentage",
      description: "% clients churned",
    },
  ],
  data: [],
  showTotals: true,
};

// Account Expansion Table Configuration
export const accountExpansionConfig: TableConfig<AccountExpansionMetrics> = {
  title: "Account Expansion",
  columns: [
    {
      key: "csm",
      label: "CSM",
      type: "text",
      description: "Customer success manager",
    },
    {
      key: "referralSignups",
      label: "Referral Signups",
      type: "number",
      description: "Signups via referrals",
    },
    {
      key: "upsellApptsTaken",
      label: "Upsell Appts Taken",
      type: "todo",
      description: "Upsell appointments kept",
    },
    {
      key: "closed",
      label: "Closed",
      type: "todo",
      description: "Closed upsell deals",
    },
    {
      key: "closeRate",
      label: "Close Rate",
      type: "todo",
      description: "% deals closed",
    },
    {
      key: "upgrades",
      label: "Upgrades",
      type: "todo",
      description: "Account upgrades",
    },
    {
      key: "upgradeRate",
      label: "Upgrade Rate",
      type: "todo",
      description: "% upgrades",
    },
    {
      key: "closedFollowup",
      label: "Closed (Followup)",
      type: "todo",
      description: "Deals closed via follow-up",
    },
    {
      key: "closedFollowupPercentage",
      label: "% Closed (Followup)",
      type: "todo",
      description: "% of closed via follow-up",
    },
  ],
  data: [],
  showTotals: true,
};

// GMB Expert Table Configuration
export const gmbExpertConfig: TableConfig<GMBExpertMetrics> = {
  title: "GMB EXPERT",
  columns: [
    {
      key: "expert",
      label: "Expert",
      type: "text",
      description: "GMB specialist",
    },
    {
      key: "unsuspended",
      label: "Unsuspended",
      type: "todo",
      description: "Listings unsuspended",
    },
    {
      key: "verified",
      label: "Verified",
      type: "todo",
      description: "Listings verified",
    },
    {
      key: "gmbAccess",
      label: "GMB Access",
      type: "todo",
      description: "Access obtained to GMB",
    },
  ],
  data: [],
  showTotals: false,
};
