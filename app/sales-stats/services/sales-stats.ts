import { supabase } from "@/lib/supabase";
import { Opportunity, Appointment } from "../types";

const PAGE_SIZE = 1000;

async function fetchAllRows<T>(tableName: string): Promise<T[]> {
  const allRows: T[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allRows.push(...(data as T[]));
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        from += PAGE_SIZE;
      }
    }
  }

  return allRows;
}

export const fetchSalesStats = async (): Promise<{
  opportunities: Opportunity[];
  appointments: Appointment[];
}> => {
  try {
    const [opportunities, appointments] = await Promise.all([
      fetchAllRows<Opportunity>("opportunities"),
      fetchAllRows<Appointment>("appointments"),
    ]);

    return {
      opportunities,
      appointments,
    };
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch sales stats"
    );
  }
};
