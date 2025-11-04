import { TableConfig } from "@/app/csm-stats";
import { SetterMetrics, CloserMetrics } from "../types";

// Setter Table Configuration
export const setterConfig: TableConfig<SetterMetrics> = {
  title: "SETTER",
  columns: [
    {
      key: "setter",
      label: "SETTER",
      type: "text",
      description: "Setter name",
    },
    {
      key: "timeToContact",
      label: "Time To Contact",
      type: "todo",
      description: "Time to contact (TODO)",
    },
    {
      key: "apptsBooked",
      label: "Appts Booked",
      type: "integer",
      description: "Appointments booked",
    },
    {
      key: "apptsShowed",
      label: "Appts Showed",
      type: "integer",
      description: "Appointments that showed",
    },
    {
      key: "showRate",
      label: "Show Rate %",
      type: "percentage",
      description: "Percentage of appointments that showed",
    },
    {
      key: "apptsClosed",
      label: "Appts Closed",
      type: "integer",
      description: "Appointments that closed",
    },
    {
      key: "closeRate",
      label: "Close Rate %",
      type: "percentage",
      description: "Percentage of showed appointments that closed",
    },
  ],
  data: [],
  showTotals: true,
};

// Closer Table Configuration
export const closerConfig: TableConfig<CloserMetrics> = {
  title: "CLOSER",
  columns: [
    {
      key: "closer",
      label: "CLOSER",
      type: "text",
      description: "Closer name",
    },
    {
      key: "apptsTaken",
      label: "Appts Taken",
      type: "integer",
      description: "Appointments taken (showed)",
    },
    {
      key: "showRate",
      label: "Show Rate %",
      type: "percentage",
      description: "Percentage of appointments that showed",
    },
    {
      key: "closedPaid",
      label: "Closed (Paid)",
      type: "integer",
      description: "Closed opportunities with paid status",
    },
    {
      key: "closedTrial",
      label: "Closed (Trial)",
      type: "integer",
      description: "Closed opportunities with trial status",
    },
    {
      key: "closeRate",
      label: "Close Rate %",
      type: "percentage",
      description: "Percentage of appointments that closed",
    },
    {
      key: "upgrades",
      label: "Upgrades",
      type: "integer",
      description: "Number of upgrades",
    },
    {
      key: "upgradeRate",
      label: "Upgrade Rate %",
      type: "percentage",
      description: "Percentage of closed opportunities that upgraded",
    },
  ],
  data: [],
  showTotals: true,
};
