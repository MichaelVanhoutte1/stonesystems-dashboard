"use client";

import React from "react";
import { TableConfig, TableColumn } from "../types";

interface ClientDataTableProps<T> {
  config: TableConfig<T>;
  className?: string;
}

const formatTimestamp = (value: any): string => {
  if (!value || value === null) return "N/A";

  try {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const getDisplayValue = (value: any, type: string): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (type === "timestamp") {
    return formatTimestamp(value);
  }

  if (type === "number") {
    return typeof value === "number" ? value.toFixed(2) : value;
  }

  if (type === "integer") {
    return typeof value === "number" ? Math.round(value).toString() : value;
  }

  return String(value);
};

export function ClientDataTable<T extends Record<string, any>>({
  config,
  className = "",
}: ClientDataTableProps<T>) {
  const { title, columns, data } = config;

  // Determine which columns should be sticky (status and client_id)
  const isStickyColumn = (key: string | number | symbol): boolean => {
    return key === "status" || key === "client_id";
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title} ({data.length} clients)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={{ minWidth: "1600px" }}
        >
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => {
                const isSticky = isStickyColumn(column.key);
                // Calculate left position for second sticky column
                const leftPosition =
                  index === 0 ? "0" : index === 1 ? "200px" : undefined;
                const hasPrevSticky =
                  index > 0 && isStickyColumn(columns[index - 1].key);

                return (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      isSticky ? "sticky z-20 bg-gray-50" : ""
                    }`}
                    style={
                      isSticky
                        ? {
                            left: leftPosition,
                            backgroundColor: "#f9fafb",
                            boxShadow:
                              hasPrevSticky || index > 0
                                ? "2px 0 5px rgba(0, 0, 0, 0.1)"
                                : undefined,
                          }
                        : undefined
                    }
                  >
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No clients found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.key];
                    const displayValue = getDisplayValue(value, column.type);
                    const isSticky = isStickyColumn(column.key);

                    // Calculate left position for second sticky column
                    const leftPosition =
                      colIndex === 0
                        ? "0"
                        : colIndex === 1
                        ? "200px"
                        : undefined;
                    const hasPrevSticky =
                      colIndex > 0 && isStickyColumn(columns[colIndex - 1].key);
                    const bgColor = rowIndex % 2 === 0 ? "#ffffff" : "#f9fafb";

                    return (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 text-sm text-gray-900 ${
                          column.className || ""
                        } ${isSticky ? "sticky z-10" : ""} ${
                          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                        style={
                          isSticky
                            ? {
                                left: leftPosition,
                                backgroundColor: bgColor,
                                boxShadow:
                                  hasPrevSticky || colIndex > 0
                                    ? "2px 0 5px rgba(0, 0, 0, 0.1)"
                                    : undefined,
                              }
                            : undefined
                        }
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
