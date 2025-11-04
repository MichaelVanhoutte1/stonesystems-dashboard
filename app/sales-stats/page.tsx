"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { fetchSalesStats } from "./services/sales-stats";
import DataTable from "@/components/DataTable";
import { DateRangePicker } from "./components/DateRangePicker";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { setterConfig, closerConfig } from "./config/table-configs";
import { SalesStatsResponse, DateRange, LoadingState } from "./types";
import { processSalesStats } from "./helpers/process-sales-stats";

export default function SalesStats() {
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
  const [data, setData] = useState<SalesStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  // Load data function
  const loadData = useCallback(async (currentDateRange: DateRange) => {
    setStatsLoading({ isLoading: true, error: null });

    try {
      // Fetch all opportunities and appointments data from Supabase
      const { opportunities, appointments } = await fetchSalesStats();

      // Process the raw data into sales stats format
      const processedData = processSalesStats(
        opportunities,
        appointments,
        currentDateRange
      );

      setData(processedData);
      setStatsLoading({ isLoading: false, error: null });
    } catch (error) {
      console.error("Error loading sales stats:", error);
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
      <main className="w-full py-6 px-4">
        <div className="w-full px-0 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sales Stats
            </h1>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={updateDateRange}
            />
          </div>

          {/* Loading State */}
          {statsLoading.isLoading && (
            <LoadingSpinner message="Loading sales statistics..." />
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
              {/* Setter Metrics */}
              <DataTable
                config={{
                  ...setterConfig,
                  data: [...data.setterMetrics, data.setterTotals],
                }}
              />

              {/* Closer Metrics */}
              <DataTable
                config={{
                  ...closerConfig,
                  data: [...data.closerMetrics, data.closerTotals],
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
