import { supabase } from "@/lib/supabase";
import { DateRange } from "../types";
import { ClientData } from "@/lib/types/client";

/**
 * Fetch CSM statistics for a given date range
 */
export const fetchCSMStats = async (
  dateRange: DateRange
): Promise<ClientData[]> => {
  try {
    // Fetch clients data within the date range
    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .gte("started_on", dateRange.startDate)
      .lte("started_on", dateRange.endDate);

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    if (!clients) {
      throw new Error("No clients data received");
    }

    return clients as ClientData[];
  } catch (error) {
    console.error("Error fetching CSM stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch CSM stats"
    );
  }
};
