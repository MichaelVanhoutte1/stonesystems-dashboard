import { supabase } from "@/lib/supabase";
import { Client, ClientFilters } from "../types";

/**
 * Fetch all clients with optional filters
 */
export const fetchClients = async (
  filters?: ClientFilters
): Promise<Client[]> => {
  try {
    let query = supabase.from("clients").select("*");

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.csmName) {
        query = query.eq("csm_name", filters.csmName);
      }
    }

    const { data: clients, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    if (!clients) {
      throw new Error("No clients data received");
    }

    return clients as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch clients"
    );
  }
};

/**
 * Get unique status values from clients
 */
export const getStatusOptions = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.from("clients").select("*");

    if (error) {
      throw new Error(`Failed to fetch status options: ${error.message}`);
    }

    // Get unique, non-null status values
    const uniqueStatuses = Array.from(
      new Set(
        (data as Client[] | null)
          ?.map((c) => c.status)
          .filter((status): status is string => status !== null)
      )
    ).sort();

    return uniqueStatuses;
  } catch (error) {
    console.error("Error fetching status options:", error);
    return [];
  }
};

/**
 * Get unique CSM names from clients
 */
export const getCSMNameOptions = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.from("clients").select("*");

    if (error) {
      throw new Error(`Failed to fetch CSM name options: ${error.message}`);
    }

    // Get unique, non-null CSM names
    const uniqueCSMNames = Array.from(
      new Set(
        (data as Client[] | null)
          ?.map((c) => c.csm_name)
          .filter((name): name is string => name !== null)
      )
    ).sort();

    return uniqueCSMNames;
  } catch (error) {
    console.error("Error fetching CSM name options:", error);
    return [];
  }
};
