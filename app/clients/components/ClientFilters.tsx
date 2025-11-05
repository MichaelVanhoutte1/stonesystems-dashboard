"use client";

import { useState, useEffect } from "react";
import { ClientFilters } from "../types";
import { getStatusOptions, getCSMNameOptions } from "../services/clients";
import MultiSelect from "@/components/MultiSelect";

interface ClientFiltersPanelProps {
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
}

export default function ClientFiltersPanel({
  filters,
  onFiltersChange,
}: ClientFiltersPanelProps) {
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [csmNameOptions, setCSMNameOptions] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<ClientFilters>(filters);

  // Load filter options
  useEffect(() => {
    const loadOptions = async () => {
      const [statuses, csmNames] = await Promise.all([
        getStatusOptions(),
        getCSMNameOptions(),
      ]);
      setStatusOptions(statuses);
      setCSMNameOptions(csmNames);
    };
    loadOptions();
  }, []);

  const handleChange = (key: keyof ClientFilters, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ClientFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Filter */}
        <div className="md:col-span-1">
          <label
            htmlFor="search-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search
          </label>
          <input
            id="search-filter"
            type="text"
            value={localFilters.searchTerm || ""}
            onChange={(e) =>
              handleChange("searchTerm", e.target.value || undefined)
            }
            placeholder="Search across text columns..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Status Filter (Multi-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statuses
          </label>
          <MultiSelect
            options={statusOptions.map((s) => ({ label: s, value: s }))}
            value={
              Array.isArray(localFilters.status)
                ? localFilters.status
                : localFilters.status
                ? [localFilters.status]
                : []
            }
            onChange={(selected) =>
              handleChange("status", selected.length ? selected : undefined)
            }
            placeholder="Select statuses..."
          />
        </div>

        {/* CSM Name Filter */}
        <div>
          <label
            htmlFor="csm-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            CSM Name
          </label>
          <select
            id="csm-filter"
            value={localFilters.csmName || ""}
            onChange={(e) =>
              handleChange("csmName", e.target.value || undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All CSMs</option>
            {csmNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
