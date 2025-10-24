import { CSMStatsResponse, ClientOnboardingMetrics } from "../types";
import { ClientData } from "@/lib/types/client";

/**
 * Process raw client data into CSM stats format
 */
export const processClientDataToCSMStats = (
  clients: ClientData[]
): CSMStatsResponse => {
  // Hardcoded CSM names as specified
  const csmNames = [
    "Ben Zazueta",
    "Ryan Grant",
    "Fabio Maldonado",
    "Nicolas Vasquez",
  ];

  // Calculate client onboarding metrics from real data
  const clientOnboarding = csmNames.map((csmName) =>
    calculateClientOnboardingFromData(clients, csmName)
  );

  //   Calculate totals
  const totals = calculateClientOnboardingTotals(clientOnboarding);

  return {
    clientOnboarding,
    totals,
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

  console.log({ csmClients });

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
      calculateTimeDifference(client.created_at, client.form_complete_time!)
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
      calculateTimeDifference(client.created_at, client.onboarding_call_time!)
    );
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
      calculateTimeDifference(client.created_at, client.launch_call_time!)
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
      return true;
    return client.minutes_to_100_usage >= 43200;
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
  return minutesToDuration(totalMinutes);
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
    return sum + parseDurationToMinutes(duration);
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
