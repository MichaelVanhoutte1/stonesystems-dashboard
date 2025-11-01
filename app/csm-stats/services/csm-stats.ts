import { supabase } from "@/lib/supabase";
// import { ClientData } from "@/lib/types/client";
import { Client } from "../../clients/types";

/**
 * Fetch all clients data (for both onboarding and retention metrics)
 */
export const fetchCSMStats = async (): Promise<Client[]> => {
  try {
    // Fetch all clients data (no date filter)
    const { data: clients, error } = await supabase.from("clients").select("*");

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    if (!clients) {
      throw new Error("No clients data received");
    }

    return clients as Client[];
  } catch (error) {
    console.error("Error fetching CSM stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch CSM stats"
    );
  }
};
