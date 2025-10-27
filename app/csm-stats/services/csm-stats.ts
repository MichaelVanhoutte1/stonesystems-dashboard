import { supabase } from "@/lib/supabase";
import { ClientData } from "@/lib/types/client";

/**
 * Fetch all clients data (for both onboarding and retention metrics)
 */
export const fetchCSMStats = async (): Promise<ClientData[]> => {
  try {
    // Fetch all clients data (no date filter)
    const { data: clients, error } = await supabase.from("clients").select("*");

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
