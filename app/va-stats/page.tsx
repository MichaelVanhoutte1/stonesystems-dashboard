"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import { DateRangePicker } from "@/app/csm-stats/components/DateRangePicker";
import { LoadingSpinner } from "@/app/csm-stats/components/LoadingSpinner";
import { ErrorDisplay } from "@/app/csm-stats/components/ErrorDisplay";
import { fetchVAStats } from "./services/va-stats";
import type { VAStatsResponse } from "./types";

export default function VAStatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize with current month date range
  const currentDate = useMemo(() => new Date(), []);
  const firstDay = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate]
  );
  const lastDay = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate]
  );

  const initialDateRange = useMemo(
    () => ({
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
    }),
    [firstDay, lastDay]
  );

  const [dateRange, setDateRange] = useState(initialDateRange);
  const [data, setData] = useState<VAStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchVAStats(dateRange);
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load VA stats");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const updateDateRange = useCallback((dr: typeof dateRange) => {
    setDateRange(dr);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tableConfig = useMemo(() => {
    const rows = data ? [...data.rows, data.totals] : [];
    return {
      title: "VA Stats",
      columns: [
        { key: "va", label: "VA", type: "text" },
        {
          key: "sitesCompleted",
          label: "Sites Completed",
          type: "integer",
          description: "Sites completed in the date range",
        },
        {
          key: "sitesAvgCompletionTime",
          label: "Avg Completion Time (Sites)",
          type: "text", // display pre-formatted duration
          description:
            "Average completion time for sites completed in the date range",
        },
        { key: "openProjects", label: "Open Projects", type: "integer" },
        {
          key: "revisionsCompleted",
          label: "Revisions Completed",
          type: "integer",
          description: "Revisions completed in the date range",
        },
        {
          key: "revisionsAvgCompletionTime",
          label: "Avg Completion Time (Revisions)",
          type: "text", // display pre-formatted duration
          description:
            "Average completion time for revisions completed in the date range",
        },
        { key: "openRevisions", label: "Open Revisions", type: "integer" },
      ],
      data: rows,
    } as const;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full py-6 px-4">
        <div className="w-full px-0 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">VA Stats</h1>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={updateDateRange}
            />
          </div>

          {isLoading && <LoadingSpinner message="Loading VA statistics..." />}

          {error && (
            <ErrorDisplay error={error} onRetry={loadData} className="mb-8" />
          )}

          {data && !isLoading && (
            <DataTable
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              config={tableConfig as any}
              minTableWidth={900}
              stickyColumns={["va"]}
              stickyColumnWidths={[200]}
              pinLastRow
            />
          )}
        </div>
      </main>
    </div>
  );
}
