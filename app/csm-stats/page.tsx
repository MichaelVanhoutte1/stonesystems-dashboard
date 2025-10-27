"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { fetchCSMStats } from "./services/csm-stats";
import { DataTable } from "./components/DataTable";
import { DateRangePicker } from "./components/DateRangePicker";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorDisplay } from "./components/ErrorDisplay";
import {
  clientOnboardingConfig,
  customerRetentionConfig,
} from "./config/table-configs";
import { CSMStatsResponse, DateRange, LoadingState } from "./types";
import { processClientDataToCSMStats } from "./helpers/process-csm-stats";
import { ClientData } from "@/lib/types/client";

export default function CSMStats() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize with current month date range
  const currentDate = new Date();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const initialDateRange = {
    startDate: firstDay.toISOString().split("T")[0],
    endDate: lastDay.toISOString().split("T")[0],
  };

  // State management
  const [data, setData] = useState<CSMStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  // Load data function
  const loadData = useCallback(async (currentDateRange: DateRange) => {
    setStatsLoading({ isLoading: true, error: null });

    try {
      // Fetch all clients data from Supabase
      const allClients = await fetchCSMStats();

      // Process the raw client data into CSM stats format
      // Pass dateRange for onboarding metrics filtering
      const processedData = processClientDataToCSMStats(
        allClients as ClientData[],
        currentDateRange
      );

      setData(processedData);
      setStatsLoading({ isLoading: false, error: null });
    } catch (error) {
      console.error("Error loading CSM stats:", error);
      setStatsLoading({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load data",
      });
    }
  }, []);

  // Update date range function
  const updateDateRange = useCallback(
    (newDateRange: DateRange) => {
      setDateRange(newDateRange);
      loadData(newDateRange);
    },
    [loadData]
  );

  // Refresh data function
  const refreshData = useCallback(() => {
    loadData(dateRange);
  }, [loadData, dateRange]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load data on component mount
  useEffect(() => {
    const loadDataAsync = async () => {
      await loadData(dateRange);
    };
    loadDataAsync();
  }, [loadData, dateRange]);

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

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">CSM Stats</h1>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={updateDateRange}
            />
          </div>

          {/* Loading State */}
          {statsLoading.isLoading && (
            <LoadingSpinner message="Loading CSM statistics..." />
          )}

          {/* Error State */}
          {statsLoading.error && (
            <ErrorDisplay
              error={statsLoading.error}
              onRetry={refreshData}
              className="mb-8"
            />
          )}

          {/* Data Tables */}
          {data && !statsLoading.isLoading && (
            <div className="space-y-8">
              {/* Client Onboarding */}
              <DataTable
                config={{
                  ...clientOnboardingConfig,
                  data: [...data.clientOnboarding, data.totals],
                }}
              />

              {/* Customer Retention */}
              <DataTable
                config={{
                  ...customerRetentionConfig,
                  data: [
                    ...data.customerRetention,
                    data.customerRetentionTotals,
                  ],
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
