"use client";

import React from "react";
import Tooltip from "./Tooltip";

// primitive types sometimes used for date conversion

export interface SharedTableColumn<T extends object> {
  key: keyof T;
  label: string;
  type: string; // accepts unions like "number" | "integer" | "percentage" | "timestamp" | "text" | ...
  className?: string;
  description?: string; // brief explanation shown as tooltip
}

export interface SharedTableConfig<T extends object> {
  title: string;
  columns: SharedTableColumn<T>[];
  data: T[];
}

interface DataTableProps<T extends object> {
  config: SharedTableConfig<T>;
  className?: string;
  // Optional UX customizations
  showCountInTitle?: boolean;
  minTableWidth?: string | number;
  stickyColumns?: (keyof T)[]; // e.g., ["client_id", "status"]
  stickyColumnWidths?: (string | number)[]; // e.g., ["200px", "200px"]
}

const formatTimestamp = (value: unknown): string => {
  if (value === null || value === undefined) return "N/A";
  try {
    const date = new Date(value as string | number | Date);
    // Get month, day, year numbers
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return "Invalid Date";
  }
};

const getDisplayValue = (value: unknown, type: string): string => {
  if (value === null || value === undefined) return "N/A";

  if (type === "timestamp" || type === "date") {
    return formatTimestamp(value);
  }
  if (type === "number") {
    return typeof value === "number" ? value.toFixed(2) : String(value);
  }
  if (type === "integer") {
    return typeof value === "number"
      ? Math.round(value).toString()
      : String(value);
  }
  return String(value);
};

export default function DataTable<T extends object>({
  config,
  className = "",
  showCountInTitle = false,
  minTableWidth,
  stickyColumns = [],
  stickyColumnWidths = [],
}: DataTableProps<T>) {
  const { title, columns, data } = config;

  const isStickyColumn = (key: keyof T): boolean => stickyColumns.includes(key);

  const computeLeft = (colIndex: number): string | number | undefined => {
    const stickyIndex = columns
      .filter((c) => isStickyColumn(c.key))
      .findIndex((c) => c.key === columns[colIndex].key);
    if (stickyIndex === -1) return undefined;
    // Sum widths of previous sticky columns if provided; fallback to simple positions
    if (stickyColumnWidths.length > 0) {
      let total = 0;
      for (let i = 0; i < stickyIndex; i++) {
        const w = stickyColumnWidths[i];
        if (typeof w === "number") total += w;
        else if (typeof w === "string")
          return stickyColumnWidths.slice(0, stickyIndex).join(" + ");
      }
      return total;
    }
    // default: 0 for first, 200px for second, otherwise undefined
    if (stickyIndex === 0) return "0";
    if (stickyIndex === 1) return "200px";
    return undefined;
  };

  const getCellClassName = (
    column: SharedTableColumn<T>,
    value: unknown,
    isHeader: boolean,
    rowIndex?: number
  ) => {
    const base = isHeader
      ? "px-4 py-3 text-xs font-medium uppercase tracking-wider"
      : "px-4 py-3 text-sm";
    const textTone = isHeader ? "text-gray-600" : "text-gray-900";
    const alignment = ["number", "integer", "percentage"].includes(column.type)
      ? "text-right"
      : "text-left";
    const zebra =
      !isHeader && rowIndex !== undefined
        ? rowIndex % 2 === 0
          ? "bg-white"
          : "bg-gray-50"
        : "";
    return `${base} ${textTone} ${alignment} ${
      column.className || ""
    } ${zebra}`.trim();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
          {showCountInTitle ? ` (${data.length})` : ""}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={
            minTableWidth
              ? {
                  minWidth:
                    typeof minTableWidth === "number"
                      ? `${minTableWidth}px`
                      : minTableWidth,
                }
              : undefined
          }
        >
          <thead className="bg-gray-50 sticky top-0 z-30 shadow-sm">
            <tr className="divide-x divide-gray-200">
              {columns.map((column, index) => {
                const sticky = isStickyColumn(column.key);
                const left = sticky ? computeLeft(index) : undefined;
                const hasPrevSticky =
                  index > 0 && isStickyColumn(columns[index - 1].key);
                return (
                  <th
                    key={String(column.key)}
                    className={`${getCellClassName(column, undefined, true)} ${
                      sticky ? "sticky z-20 bg-gray-50" : ""
                    }`}
                    style={
                      sticky
                        ? {
                            left,
                            backgroundColor: "#f9fafb",
                            boxShadow:
                              hasPrevSticky || index > 0
                                ? "2px 0 5px rgba(0, 0, 0, 0.1)"
                                : undefined,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span className="font-semibold tracking-wide">
                        {column.label}
                      </span>
                      {column.description && (
                        <Tooltip content={column.description}>
                          <span
                            aria-label="Help"
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] hover:bg-gray-300"
                          >
                            i
                          </span>
                        </Tooltip>
                      )}
                    </div>
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
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`divide-x divide-gray-200 hover:bg-gray-100 ${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {columns.map((column, colIndex) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const value = (row as any)[
                      column.key as keyof T
                    ] as unknown;
                    const displayValue = getDisplayValue(value, column.type);
                    const sticky = isStickyColumn(column.key);
                    const left = sticky ? computeLeft(colIndex) : undefined;
                    const hasPrevSticky =
                      colIndex > 0 && isStickyColumn(columns[colIndex - 1].key);
                    const bgColor = rowIndex % 2 === 0 ? "#ffffff" : "#f9fafb";

                    return (
                      <td
                        key={`${rowIndex}-${String(column.key)}`}
                        className={`${getCellClassName(
                          column,
                          value,
                          false,
                          rowIndex
                        )} ${sticky ? "sticky z-10" : ""}`}
                        style={
                          sticky
                            ? {
                                left,
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
