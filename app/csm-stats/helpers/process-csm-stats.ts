import {
  CSMStatsResponse,
  ClientOnboardingMetrics,
  CustomerRetentionMetrics,
  DateRange,
} from "../types";
import { ClientData } from "@/lib/types/client";

/**
 * Process raw client data into CSM stats format
 * @param clients - All client data from the database
 * @param dateRange - Date range for filtering onboarding metrics only
 */
export const processClientDataToCSMStats = (
  clients: ClientData[],
  dateRange: DateRange
): CSMStatsResponse => {
  // Hardcoded CSM names as specified
  const csmNames = [
    "Ben Zazueta",
    "Ryan Grant",
    "Fabio Maldonado",
    "Nicolas Vasquez",
  ];

  // Filter clients by date range for onboarding metrics
  const onboardingClients = clients.filter((client) => {
    if (!client.started_on) return false;
    const startedDate = client.started_on;
    return (
      startedDate >= dateRange.startDate && startedDate <= dateRange.endDate
    );
  });

  // Calculate client onboarding metrics from date-filtered data
  const clientOnboarding = csmNames.map((csmName) =>
    calculateClientOnboardingFromData(onboardingClients, csmName)
  );

  // Calculate customer retention metrics from all client data (no date filter)
  const customerRetention = csmNames.map((csmName) =>
    calculateCustomerRetentionFromData(clients, csmName, dateRange)
  );

  //   Calculate totals
  const totals = calculateClientOnboardingTotals(clientOnboarding);
  const customerRetentionTotals =
    calculateCustomerRetentionTotals(customerRetention);

  return {
    clientOnboarding,
    customerRetention,
    totals,
    customerRetentionTotals,
  };
};

/**
 * Calculate totals across all CSMs for client onboarding metrics
 */
const calculateClientOnboardingTotals = (
  clientOnboarding: ClientOnboardingMetrics[]
): ClientOnboardingMetrics => {
  // Sum all numeric values
  const newClients = clientOnboarding.reduce(
    (sum, csm) => sum + csm.newClients,
    0
  );
  const formsMissing = clientOnboarding.reduce(
    (sum, csm) => sum + csm.formsMissing,
    0
  );
  const onboardCallShows = clientOnboarding.reduce(
    (sum, csm) => sum + csm.onboardCallShow,
    0
  );
  const launchCallShows = clientOnboarding.reduce(
    (sum, csm) => sum + csm.launchCallShow,
    0
  );
  const activatedUnder30Days = clientOnboarding.reduce(
    (sum, csm) => sum + csm.activatedUnder30Days,
    0
  );

  // Calculate weighted averages for percentages
  const formCompletePercentage =
    newClients > 0
      ? Math.round(
          (clientOnboarding.reduce(
            (sum, csm) => sum + csm.formCompletePercentage * csm.newClients,
            0
          ) /
            newClients) *
            100
        ) / 100
      : 0;

  const onboardCallShowPercentage =
    newClients > 0
      ? Math.round((onboardCallShows / newClients) * 100 * 100) / 100
      : 0;

  const launchCallShowPercentage =
    newClients > 0
      ? Math.round((launchCallShows / newClients) * 100 * 100) / 100
      : 0;

  const activatedUnder30DaysPercentage =
    newClients > 0
      ? Math.round((activatedUnder30Days / newClients) * 100 * 100) / 100
      : 0;

  // Calculate weighted averages for duration fields
  const formCompleteTimeAvg = calculateWeightedAverageDuration(
    clientOnboarding.map((csm) => ({
      duration: csm.formCompleteTimeAvg,
      weight: csm.newClients,
    }))
  );

  const timeToOnboardCallAvg = calculateWeightedAverageDuration(
    clientOnboarding.map((csm) => ({
      duration: csm.timeToOnboardCallAvg,
      weight: csm.onboardCallShow,
    }))
  );

  const timeToLaunchCallAvg = calculateWeightedAverageDuration(
    clientOnboarding.map((csm) => ({
      duration: csm.timeToLaunchCallAvg,
      weight: csm.launchCallShow,
    }))
  );

  const ttfv = calculateWeightedAverageDuration(
    clientOnboarding.map((csm) => ({
      duration: csm.ttfv,
      weight: csm.newClients,
    }))
  );

  const tta = calculateWeightedAverageDuration(
    clientOnboarding.map((csm) => ({
      duration: csm.tta,
      weight: csm.newClients,
    }))
  );

  return {
    csm: "Totals",
    newClients,
    formsMissing,
    formCompletePercentage,
    formCompleteTimeAvg,
    onboardCallShow: onboardCallShows,
    onboardCallShowPercentage,
    timeToOnboardCallAvg,
    launchCallShow: launchCallShows,
    launchCallShowPercentage,
    timeToLaunchCallAvg,
    ttfv,
    tta,
    activatedUnder30Days,
    activatedUnder30DaysPercentage,
  };
};

/**
 * Calculate totals across all CSMs for customer retention metrics
 */
const calculateCustomerRetentionTotals = (
  customerRetention: CustomerRetentionMetrics[]
): CustomerRetentionMetrics => {
  // Sum all numeric values
  const clientsManaging = customerRetention.reduce(
    (sum, csm) => sum + csm.clientsManaging,
    0
  );
  const churned = customerRetention.reduce((sum, csm) => sum + csm.churned, 0);
  const csatCount = customerRetention.reduce(
    (sum, csm) => sum + csm.csatCount,
    0
  );
  const ccDeclined = customerRetention.reduce(
    (sum, csm) => sum + csm.ccDeclined,
    0
  );

  // Calculate weighted averages for percentages
  const inactiveClientsPercentage =
    clientsManaging > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) =>
              sum + csm.inactiveClientsPercentage * csm.clientsManaging,
            0
          ) /
            clientsManaging) *
            100
        ) / 100
      : 0;

  const csatGoodPercentage =
    csatCount > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) => sum + csm.csatGoodPercentage * csm.csatCount,
            0
          ) /
            csatCount) *
            100
        ) / 100
      : 0;

  const ccDeclinedRate =
    clientsManaging > 0
      ? Math.round((ccDeclined / clientsManaging) * 100 * 100) / 100
      : 0;

  const churnRate =
    clientsManaging > 0
      ? Math.round((churned / clientsManaging) * 100 * 100) / 100
      : 0;

  const refundDisputeRate =
    clientsManaging > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) => sum + csm.refundDisputeRate * csm.clientsManaging,
            0
          ) /
            clientsManaging) *
            100
        ) / 100
      : 0;

  // Calculate weighted averages for numeric fields
  const avgMonthlyUsagePerClient =
    clientsManaging > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) =>
              sum + csm.avgMonthlyUsagePerClient * csm.clientsManaging,
            0
          ) /
            clientsManaging) *
            100
        ) / 100
      : 0;

  const avgMonthlyReviews =
    clientsManaging > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) => sum + csm.avgMonthlyReviews * csm.clientsManaging,
            0
          ) /
            clientsManaging) *
            100
        ) / 100
      : 0;

  const avgMonthlyNewLeads =
    clientsManaging > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) => sum + csm.avgMonthlyNewLeads * csm.clientsManaging,
            0
          ) /
            clientsManaging) *
            100
        ) / 100
      : 0;

  // Calculate weighted average for CHI
  const chi =
    clientsManaging > 0
      ? Math.round(
          (customerRetention.reduce(
            (sum, csm) => sum + csm.chi * csm.clientsManaging,
            0
          ) /
            clientsManaging) *
            100
        ) / 100
      : 0;

  return {
    csm: "Totals",
    clientsManaging,
    chi,
    inactiveClientsPercentage,
    avgMonthlyUsagePerClient,
    avgMonthlyReviews,
    avgMonthlyNewLeads,
    csatCount,
    csatGoodPercentage,
    ccDeclined,
    ccDeclinedRate,
    refundDisputeRate,
    churned,
    churnRate,
  };
};

// ===========================================================/
// Other helper functions
// ===========================================================/

/**
 * Calculate weighted average duration from an array of duration-weight pairs
 */
const calculateWeightedAverageDuration = (
  durationWeights: { duration: string; weight: number }[]
): string => {
  const validEntries = durationWeights.filter((entry) => entry.weight > 0);

  if (validEntries.length === 0) return "0d 0h 0m";

  const totalWeight = validEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  if (totalWeight === 0) return "0d 0h 0m";

  const weightedMinutes = validEntries.reduce((sum, entry) => {
    const minutes = parseDurationToMinutes(entry.duration);
    return sum + minutes * entry.weight;
  }, 0);

  const averageMinutes = Math.round(weightedMinutes / totalWeight);
  return minutesToDuration(averageMinutes);
};

/**
 * Calculate client onboarding metrics from raw client data
 */
const calculateClientOnboardingFromData = (
  clients: ClientData[],
  csmName: string
) => {
  const csmClients = clients.filter((client) => client["CSM Name"] === csmName);

  const newClients = csmClients.length;
  const formsCompleted = csmClients.filter(
    (client) => client.form_complete_time
  ).length;
  const formsMissing = newClients - formsCompleted;

  // Calculate form complete percentage
  const formCompletePercentage =
    newClients > 0
      ? Math.round((formsCompleted / newClients) * 100 * 100) / 100
      : 0;

  // Calculate average form complete time
  const formCompleteTimes = csmClients
    .filter((client) => client.form_complete_time)
    .map((client) =>
      calculateTimeDifference(client.started_on, client.form_complete_time!)
    );
  const formCompleteTimeAvg = calculateAverageDuration(formCompleteTimes);

  // Calculate onboarding call metrics
  const onboardCallShows = csmClients.filter(
    (client) => client.onboarding_call_time
  ).length;
  const onboardCallShowPercentage =
    newClients > 0
      ? Math.round((onboardCallShows / newClients) * 100 * 100) / 100
      : 0;

  // Calculate average time to onboarding call
  const timeToOnboardCalls = csmClients
    .filter((client) => client.onboarding_call_time)
    .map((client) =>
      calculateTimeDifference(client.started_on, client.onboarding_call_time!)
    );
  console.log({ timeToOnboardCalls });
  const timeToOnboardCallAvg = calculateAverageDuration(timeToOnboardCalls);

  // Calculate launch call metrics
  const launchCallShows = csmClients.filter(
    (client) => client.launch_call_time
  ).length;
  const launchCallShowPercentage =
    newClients > 0
      ? Math.round((launchCallShows / newClients) * 100 * 100) / 100
      : 0;

  // Calculate average time to launch call
  const timeToLaunchCalls = csmClients
    .filter((client) => client.launch_call_time)
    .map((client) =>
      calculateTimeDifference(client.started_on, client.launch_call_time!)
    );
  const timeToLaunchCallAvg = calculateAverageDuration(timeToLaunchCalls);

  // Calculate TTFV (Time to First Value) - using minutes_to_first_value
  const ttfvTimes = csmClients
    .filter((client) => client.minutes_to_first_value)
    .map((client) => client.minutes_to_first_value!.toString());
  const ttfv = calculateAverageDuration(ttfvTimes);

  // Calculate TTA (Time to Activation) - using minutes_to_100_usage
  const ttaTimes = csmClients
    .filter((client) => client.minutes_to_100_usage)
    .map((client) => client.minutes_to_100_usage!.toString());
  const tta = calculateAverageDuration(ttaTimes);

  // Filter out clients with tta (minutes_to_100_usage) less than 30 days (43200 minutes)
  const filteredClients = csmClients.filter((client) => {
    if (
      client.minutes_to_100_usage === null ||
      client.minutes_to_100_usage === undefined
    )
      return false;
    return client.minutes_to_100_usage <= 43200;
  });

  const activatedUnder30Days = filteredClients.length;

  const activatedUnder30DaysPercentage =
    newClients > 0
      ? Math.round((activatedUnder30Days / newClients) * 100 * 100) / 100
      : 0;

  return {
    csm: csmName,
    newClients,
    formsMissing,
    formCompletePercentage,
    formCompleteTimeAvg,
    onboardCallShow: onboardCallShows,
    onboardCallShowPercentage,
    timeToOnboardCallAvg,
    launchCallShow: launchCallShows,
    launchCallShowPercentage,
    timeToLaunchCallAvg,
    ttfv,
    tta, // This seems to be always 0 based on the image
    activatedUnder30Days,
    activatedUnder30DaysPercentage,
  };
};

/**
 * Calculate time difference between two timestamps in duration format
 */
const calculateTimeDifference = (
  startTime: string | null,
  endTime: string | null
): string => {
  if (!startTime || !endTime) return "0d 0h 0m";

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs < 0) return "0d 0h 0m";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  return totalMinutes.toString();
  // return minutesToDuration(totalMinutes);
};

/**
 * Convert minutes back to duration string
 */
const minutesToDuration = (totalMinutes: number): string => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
};

/**
 * Calculate average duration from an array of duration strings
 */
const calculateAverageDuration = (durations: string[]): string => {
  if (durations.length === 0) return "0d 0h 0m";

  const totalMinutes = durations.reduce((sum, duration) => {
    return sum + +duration;
  }, 0);

  const averageMinutes = Math.round(totalMinutes / durations.length);
  return minutesToDuration(averageMinutes);
};

/**
 * Parse duration string to minutes for calculations
 */
const parseDurationToMinutes = (duration: string): number => {
  const match = duration.match(/(\d+)d\s*(\d+)h\s*(\d+)m/);
  if (!match) return 0;

  const days = parseInt(match[1]) || 0;
  const hours = parseInt(match[2]) || 0;
  const minutes = parseInt(match[3]) || 0;

  return days * 24 * 60 + hours * 60 + minutes;
};

/**
 * Calculate customer retention metrics from raw client data
 */
const calculateCustomerRetentionFromData = (
  clients: ClientData[],
  csmName: string,
  dateRange: DateRange
): CustomerRetentionMetrics => {
  const csmClients = clients.filter((client) => client["CSM Name"] === csmName);

  // Basic counts
  const clientsManaging = csmClients.filter(
    (client) => client.status === "Active"
  ).length;

  const churned = csmClients.filter(
    (client) =>
      client.churned_on !== null &&
      client.churned_on >= dateRange.startDate &&
      client.churned_on <= dateRange.endDate
  ).length;

  // Calculate inactive clients (no meaningful activity in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const inactiveClients = csmClients.filter((client) => {
    if (!client.last_meaningful_activity_time) return true;
    const lastActivity = new Date(client.last_meaningful_activity_time);
    return lastActivity > thirtyDaysAgo;
  }).length;

  const inactiveClientsPercentage =
    clientsManaging > 0
      ? Math.round((inactiveClients / clientsManaging) * 100 * 100) / 100
      : 0;

  // Calculate averages (using available data)
  const totalUsage = csmClients.reduce(
    (sum, client) => sum + (client.total_usage || 0),
    0
  );
  const avgMonthlyUsagePerClient =
    clientsManaging > 0
      ? Math.round((totalUsage / clientsManaging) * 100) / 100
      : 0;

  const totalReviews = csmClients.reduce(
    (sum, client) => sum + (client.new_reviews || 0),
    0
  );
  const avgMonthlyReviews =
    clientsManaging > 0
      ? Math.round((totalReviews / clientsManaging) * 100) / 100
      : 0;

  const totalLeads = csmClients.reduce(
    (sum, client) => sum + (client.new_website_leads || 0),
    0
  );
  const avgMonthlyNewLeads =
    clientsManaging > 0
      ? Math.round((totalLeads / clientsManaging) * 100) / 100
      : 0;

  // Placeholder values for metrics not available in current data
  const chi = 0; // Customer Health Index - would need additional data
  const csatCount = 0; // CSAT Count - would need additional data
  const csatGoodPercentage = 0; // CSAT Good % - would need additional data

  const ccDeclined = csmClients.filter(
    (client) => client.status === "CC Declined"
  ).length;
  const ccDeclinedRate =
    clientsManaging > 0
      ? Math.round((ccDeclined / clientsManaging) * 100 * 100) / 100
      : 0;
  const refundDisputeRate = 0; // Refund/Dispute Rate - would need additional data

  const churnRate =
    clientsManaging > 0
      ? Math.round((churned / clientsManaging) * 100 * 100) / 100
      : 0;

  return {
    csm: csmName,
    clientsManaging,
    chi,
    inactiveClientsPercentage,
    avgMonthlyUsagePerClient,
    avgMonthlyReviews,
    avgMonthlyNewLeads,
    csatCount,
    csatGoodPercentage,
    ccDeclined,
    ccDeclinedRate,
    refundDisputeRate,
    churned,
    churnRate,
  };
};
