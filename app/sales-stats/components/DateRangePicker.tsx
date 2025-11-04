"use client";

import React from "react";
import { DateRange } from "../types";

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className = "",
}: DateRangePickerProps) {
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onDateRangeChange({
      ...dateRange,
      startDate: event.target.value,
    });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateRangeChange({
      ...dateRange,
      endDate: event.target.value,
    });
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <label
          htmlFor="start-date"
          className="text-sm font-medium text-gray-700"
        >
          Start Date:
        </label>
        <input
          id="start-date"
          type="date"
          value={dateRange.startDate}
          onChange={handleStartDateChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
          End Date:
        </label>
        <input
          id="end-date"
          type="date"
          value={dateRange.endDate}
          onChange={handleEndDateChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
