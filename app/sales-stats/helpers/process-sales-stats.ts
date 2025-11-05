import {
  SalesStatsResponse,
  SetterMetrics,
  CloserMetrics,
  DateRange,
  Opportunity,
  Appointment,
} from "../types";

/**
 * Process raw opportunities and appointments data into sales stats format
 * @param opportunities - All opportunities data from the database
 * @param appointments - All appointments data from the database
 * @param dateRange - Date range for filtering
 */
export const processSalesStats = (
  opportunities: Opportunity[],
  appointments: Appointment[],
  dateRange: DateRange
): SalesStatsResponse => {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  // Add 1 day to endDate to include the full end date
  endDate.setDate(endDate.getDate() + 1);

  const allowedSetters = ["Javier Ulloa", "Juan Parada", "Agustin Nufio"];

  const allowedClosers = [
    "Jonathan Buitron",
    "Dale Kelley",
    "Daniel Infante",
    "Jay Rojas",
  ];

  const setterNames = Array.from(
    new Set(
      appointments
        .map((apt) => apt.setter)
        .filter((name) => name && name.trim() !== "")
        .filter((name) => allowedSetters.includes(name))
    )
  ).sort();

  const closerNames = Array.from(
    new Set(
      appointments
        .map((apt) => apt.closer)
        .filter((name) => name && name.trim() !== "")
        .filter((name) => allowedClosers.includes(name))
    )
  ).sort();

  // Calculate setter metrics
  const setterMetrics = setterNames.map((setterName) =>
    calculateSetterMetrics(
      opportunities,
      appointments,
      setterName,
      startDate,
      endDate
    )
  );

  // Calculate closer metrics
  const closerMetrics = closerNames.map((closerName) =>
    calculateCloserMetrics(
      opportunities,
      appointments,
      closerName,
      startDate,
      endDate
    )
  );

  // Calculate totals
  const setterTotals = calculateSetterTotals(setterMetrics);
  const closerTotals = calculateCloserTotals(
    closerMetrics,
    appointments,
    startDate,
    endDate,
    allowedClosers
  );

  return {
    setterMetrics,
    closerMetrics,
    setterTotals,
    closerTotals,
  };
};

/**
 * Calculate setter metrics based on formulas
 */
const calculateSetterMetrics = (
  opportunities: Opportunity[],
  appointments: Appointment[],
  setterName: string,
  startDate: Date,
  endDate: Date
): SetterMetrics => {
  const apptsBooked = appointments.filter((apt) => {
    if (apt.setter !== setterName) return false;
    const aptDate = new Date(apt.appointment_date);
    return aptDate >= startDate && aptDate <= endDate;
  }).length;

  // Appts Showed: COUNTIFS(Appointments!G:G, "*" & A5 & "*", Appointments!D:D, "Showed", Appointments!E:E, ">=' & $A$2, Appointments!E:E, "<=' & $B$2, Appointments!H:H, "<>Melo Moore")
  const apptsShowed = appointments.filter((apt) => {
    if (!apt.setter || !apt.setter.includes(setterName)) return false;
    if (apt.status !== "showed") return false;
    const aptDate = new Date(apt.appointment_date);
    if (aptDate < startDate || aptDate > endDate) return false;
    if (apt.closer === "Melo Moore") return false;
    return true;
  }).length;

  // Show Rate = Appts Showed / Appts Booked
  const showRate = apptsBooked > 0 ? (apptsShowed / apptsBooked) * 100 : 0;

  // Appts Closed: SUMPRODUCT matching appointments with opportunities where status = "won"
  const apptsClosed = appointments
    .filter((apt) => {
      if (apt.setter !== setterName) return false;
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= startDate && aptDate < endDate;
    })
    .reduce((count, apt) => {
      // Check if there's a matching opportunity with status "won"
      const hasWonOpportunity = opportunities.some(
        (opp) =>
          opp.company === apt.company &&
          opp.name === apt.name &&
          opp.status?.toLowerCase() === "won"
      );
      return count + (hasWonOpportunity ? 1 : 0);
    }, 0);

  // Close Rate = Appts Closed / Appts Showed
  const closeRate = apptsShowed > 0 ? (apptsClosed / apptsShowed) * 100 : 0;

  return {
    setter: setterName,
    timeToContact: "TODO",
    apptsBooked,
    apptsShowed,
    showRate,
    apptsClosed,
    closeRate,
  };
};

/**
 * Calculate closer metrics based on formulas
 */
const calculateCloserMetrics = (
  opportunities: Opportunity[],
  appointments: Appointment[],
  closerName: string,
  startDate: Date,
  endDate: Date
): CloserMetrics => {
  console.log({ appointments });
  // Appts Taken: COUNTIFS(Appointments!H:H, A12, Appointments!D:D, "Showed", Appointments!E:E, ">=' & $A$2, Appointments!E:E, "<=' & $B$2)
  const apptsTaken = appointments.filter((apt) => {
    if (apt.closer !== closerName) return false;
    if (apt.status !== "showed") return false;
    const aptDate = new Date(apt.appointment_date);
    return aptDate >= startDate && aptDate <= endDate;
  }).length;

  // Total appointments for this closer in date range (for show rate calculation)
  const totalAppts = appointments.filter((apt) => {
    if (apt.closer !== closerName) return false;
    const aptDate = new Date(apt.appointment_date);
    return aptDate >= startDate && aptDate <= endDate;
  }).length;

  // Show Rate = Appts Taken / Total Appts
  const showRate = totalAppts > 0 ? (apptsTaken / totalAppts) * 100 : 0;

  // Closed (Paid): COUNTIFS(Opportunities!G:G, A12, Opportunities!D:D, "Won", Opportunities!M:M, ">=' & $A$2, Opportunities!M:M, "<=' & $B$2)
  const closedPaid = opportunities.filter((opp) => {
    if (opp.closer !== closerName) return false;
    if (opp.status?.toLowerCase() !== "won") return false;
    const oppDate = new Date(opp.updated_at);
    return oppDate >= startDate && oppDate <= endDate;
  }).length;

  // Closed (Trial): COUNTIFS(Opportunities!G:G, A12, Opportunities!D:D, "trial", Opportunities!M:M, ">=' & $A$2, Opportunities!M:M, "<=' & $B$2)
  const closedTrial = opportunities.filter((opp) => {
    if (opp.closer !== closerName) return false;
    if (opp.status?.toLowerCase() !== "trial") return false;
    const oppDate = new Date(opp.updated_at);
    return oppDate >= startDate && oppDate <= endDate;
  }).length;

  // Close Rate = Closed (Paid) / Appts Taken
  const closeRate = apptsTaken > 0 ? (closedPaid / apptsTaken) * 100 : 0;

  // Upgrades: SUMPRODUCT checking upgrade field
  const upgrades = opportunities.filter((opp) => {
    if (!opp.closer || opp.closer.trim() !== closerName.trim()) return false;
    const oppDate = new Date(opp.updated_at);
    if (oppDate < startDate || oppDate >= endDate) return false;

    // Check upgrade field: TRUE
    const upgradeValue = opp.upgrade;
    if (upgradeValue === true) return true;
    return false;
  }).length;

  // Upgrade Rate = Upgrades / Closed (Paid)
  const upgradeRate = closedPaid > 0 ? (upgrades / closedPaid) * 100 : 0;

  return {
    closer: closerName,
    apptsTaken,
    showRate,
    closedPaid,
    closedTrial,
    closeRate,
    upgrades,
    upgradeRate,
  };
};

/**
 * Calculate totals across all setters
 */
const calculateSetterTotals = (
  setterMetrics: SetterMetrics[]
): SetterMetrics => {
  const apptsBooked = setterMetrics.reduce(
    (sum, setter) => sum + setter.apptsBooked,
    0
  );
  const apptsShowed = setterMetrics.reduce(
    (sum, setter) => sum + setter.apptsShowed,
    0
  );
  const apptsClosed = setterMetrics.reduce(
    (sum, setter) => sum + setter.apptsClosed,
    0
  );

  const showRate = apptsBooked > 0 ? (apptsShowed / apptsBooked) * 100 : 0;
  const closeRate = apptsShowed > 0 ? (apptsClosed / apptsShowed) * 100 : 0;

  return {
    setter: "Totals",
    timeToContact: "TODO",
    apptsBooked,
    apptsShowed,
    showRate,
    apptsClosed,
    closeRate,
  };
};

/**
 * Calculate totals across all closers
 */
const calculateCloserTotals = (
  closerMetrics: CloserMetrics[],
  appointments: Appointment[],
  startDate: Date,
  endDate: Date,
  allowedClosers: string[]
): CloserMetrics => {
  const apptsTaken = closerMetrics.reduce(
    (sum, closer) => sum + closer.apptsTaken,
    0
  );
  const closedPaid = closerMetrics.reduce(
    (sum, closer) => sum + closer.closedPaid,
    0
  );
  const closedTrial = closerMetrics.reduce(
    (sum, closer) => sum + closer.closedTrial,
    0
  );
  const upgrades = closerMetrics.reduce(
    (sum, closer) => sum + closer.upgrades,
    0
  );

  const totalAppts = appointments.filter((apt) => {
    if (!apt.closer || apt.closer.trim() === "") return false;
    if (!allowedClosers.includes(apt.closer)) return false;
    const aptDate = new Date(apt.appointment_date);
    return aptDate >= startDate && aptDate < endDate;
  }).length;

  const showRate = totalAppts > 0 ? (apptsTaken / totalAppts) * 100 : 0;
  const closeRate = apptsTaken > 0 ? (closedPaid / apptsTaken) * 100 : 0;
  const upgradeRate = closedPaid > 0 ? (upgrades / closedPaid) * 100 : 0;

  return {
    closer: "Totals",
    apptsTaken,
    showRate,
    closedPaid,
    closedTrial,
    closeRate,
    upgrades,
    upgradeRate,
  };
};
