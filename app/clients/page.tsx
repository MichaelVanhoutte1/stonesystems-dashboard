"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { fetchClients } from "./services/clients";
import { Client, ClientFilters } from "./types";
import { clientsTableConfig } from "./config/table-config";
import { ClientDataTable } from "./components/ClientDataTable";
import ClientFiltersPanel from "./components/ClientFilters";

export default function Clients() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const loadClients = useCallback(async (currentFilters: ClientFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchClients(currentFilters);
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients(filters);
  }, [filters, loadClients]);

  const handleFiltersChange = useCallback((newFilters: ClientFilters) => {
    setFilters(newFilters);
  }, []);

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
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Clients</h1>
            <p className="text-gray-600">
              View and manage all clients with filtering capabilities.
            </p>
          </div>

          {/* Filters */}
          <ClientFiltersPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading clients...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-400 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => loadClients(filters)}
                  className="ml-4 text-sm text-red-600 hover:text-red-800 font-medium underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && !error && (
            <ClientDataTable
              config={{
                ...clientsTableConfig,
                data: clients,
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
