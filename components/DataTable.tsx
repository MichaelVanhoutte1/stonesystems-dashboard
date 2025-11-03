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
  // Optional custom renderer to override default cell content
  render?: (value: unknown, row: T) => React.ReactNode;
}

const SORTABLE_TYPES = new Set(["number", "integer", "timestamp", "date"]);

export interface SharedTableConfig<T extends object> {
  title: string;
  columns: SharedTableColumn<T>[];
  data: T[];
  search?: {
    weights?: Partial<Record<keyof T, number>>;
    scorer?: (row: T, term: string) => number;
    term?: string; // provided by consumer; when empty/undefined, search is skipped
  };
}

interface DataTableProps<T extends object> {
  config: SharedTableConfig<T>;
  className?: string;
  // Optional UX customizations
  showCountInTitle?: boolean;
  minTableWidth?: string | number;
  stickyColumns?: (keyof T)[]; // e.g., ["client_id", "status"]
  stickyColumnWidths?: (string | number)[]; // e.g., ["200px", "200px"]
  // Constrain vertical size to make body scrollable while headers stay sticky
  maxBodyHeight?: string | number;
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
    return typeof value === "number" ? value.toFixed(1) : String(value);
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
  maxBodyHeight,
}: DataTableProps<T>) {
  const { title, columns, data } = config;

  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );

  const isSortableColumn = (columnType: string): boolean =>
    SORTABLE_TYPES.has(columnType);

  const getComparableValue = (value: unknown, type: string): number => {
    if (value === null || value === undefined) return Number.NaN;
    if (type === "number" || type === "integer") {
      if (typeof value === "number") return value;
      const parsed = Number(value as never);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    }
    if (type === "timestamp" || type === "date") {
      const time = new Date(value as string | number | Date).getTime();
      return Number.isFinite(time) ? time : Number.NaN;
    }
    return Number.NaN;
  };

  // Default weighted search scorer using column metadata and optional weights
  const defaultScorer = React.useCallback(
    (row: T, rawTerm: string): number => {
      if (!rawTerm) return 0;
      const term = rawTerm.toLowerCase().trim();
      if (!term) return 0;

      const weights =
        config.search?.weights || ({} as Partial<Record<keyof T, number>>);
      let score = 0;
      for (const col of columns) {
        if (col.type !== "text") continue;
        const key = col.key;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (row as any)[key as keyof T] as unknown;
        if (value === null || value === undefined) continue;
        const valueStr = String(value).toLowerCase();
        if (!valueStr) continue;
        if (valueStr.includes(term)) {
          const weight = (weights[key] as number | undefined) ?? 1;
          // small boost for prefix and exact match
          const prefixBoost = valueStr.startsWith(term) ? 0.5 : 0;
          const exactBoost = valueStr === term ? 1 : 0;
          score += weight * (1 + prefixBoost + exactBoost);
        }
      }
      return score;
    },
    [columns, config.search?.weights]
  );

  const applySearch = React.useCallback(
    (rows: T[]): { rows: T[]; scores: number[] } => {
      const term = config.search?.term;
      if (!term) return { rows, scores: [] };

      const scorer = config.search?.scorer || defaultScorer;
      const scored = rows
        .map((r) => ({ r, s: scorer(r, term) }))
        .filter(({ s }) => s > 0);

      // If no sort key is active, sort by score desc by default
      if (!sortKey) {
        scored.sort((a, b) => b.s - a.s);
      }

      return {
        rows: scored.map(({ r }) => r),
        scores: scored.map(({ s }) => s),
      };
    },
    [config.search?.term, config.search?.scorer, defaultScorer, sortKey]
  );

  const searchedData = React.useMemo(() => {
    return applySearch(data).rows;
  }, [data, applySearch]);

  const sortedData = React.useMemo(() => {
    if (!sortKey) return searchedData;
    const column = columns.find((c) => c.key === sortKey);
    if (!column || !SORTABLE_TYPES.has(column.type)) return searchedData;

    const copied = [...searchedData];
    copied.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = (a as any)[sortKey as keyof T] as unknown;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = (b as any)[sortKey as keyof T] as unknown;
      const aComp = getComparableValue(aVal, column.type);
      const bComp = getComparableValue(bVal, column.type);

      const aIsNaN = Number.isNaN(aComp);
      const bIsNaN = Number.isNaN(bComp);
      if (aIsNaN && bIsNaN) return 0;
      if (aIsNaN) return 1; // push undefined/invalid to bottom
      if (bIsNaN) return -1;

      if (aComp < bComp) return sortDirection === "asc" ? -1 : 1;
      if (aComp > bComp) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copied;
  }, [searchedData, columns, sortKey, sortDirection]);

  const onHeaderClick = (column: SharedTableColumn<T>) => {
    if (!isSortableColumn(column.type)) return;
    if (sortKey === column.key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column.key);
      setSortDirection("asc");
    }
  };

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

  // Returns configured width for a sticky column at given colIndex, if any
  const computeStickyWidth = (
    colIndex: number
  ): string | number | undefined => {
    const stickyOnly = columns.filter((c) => isStickyColumn(c.key));
    const stickyIndex = stickyOnly.findIndex(
      (c) => c.key === columns[colIndex].key
    );
    if (stickyIndex === -1) return undefined;
    const configured = stickyColumnWidths[stickyIndex];
    return configured;
  };

  const getMinWidthForColumn = (
    column: SharedTableColumn<T>
  ): number | undefined => {
    return column.type === "duration" ? 110 : undefined;
  };

  const getCellClassName = (
    column: SharedTableColumn<T>,
    value: unknown,
    isHeader: boolean,
    rowIndex?: number
  ) => {
    const base = isHeader
      ? "px-3 py-2 text-[11px] font-medium uppercase tracking-wide"
      : "px-3 py-1.5 text-sm";
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
          {showCountInTitle ? ` (${sortedData.length})` : ""}
        </h3>
      </div>

      <div
        className="overflow-auto"
        style={
          maxBodyHeight
            ? {
                maxHeight:
                  typeof maxBodyHeight === "number"
                    ? `${maxBodyHeight}px`
                    : maxBodyHeight,
              }
            : undefined
        }
      >
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
                const stickyWidth = computeStickyWidth(index);
                const minWidth = getMinWidthForColumn(column);
                const headerStyle: React.CSSProperties | undefined = sticky
                  ? {
                      left,
                      width: stickyWidth,
                      minWidth: stickyWidth ?? minWidth,
                      backgroundColor: "#f9fafb",
                      boxShadow:
                        hasPrevSticky || index > 0
                          ? "2px 0 5px rgba(0, 0, 0, 0.1)"
                          : undefined,
                    }
                  : minWidth
                  ? { minWidth }
                  : undefined;

                return (
                  <th
                    key={String(column.key)}
                    onClick={() => onHeaderClick(column)}
                    className={`relative ${getCellClassName(
                      column,
                      undefined,
                      true
                    )} ${sticky ? "sticky z-20 bg-gray-50" : ""} ${
                      isSortableColumn(column.type)
                        ? "cursor-pointer select-none"
                        : ""
                    }`}
                    style={headerStyle}
                  >
                    {column.description && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-l-[10px] border-t-black border-l-transparent"></div>
                    )}
                    <Tooltip content={column.description || ""}>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <span className="font-semibold tracking-wide">
                          {column.label}
                        </span>
                        {isSortableColumn(column.type) && (
                          <span className="text-[10px] text-gray-500">
                            {sortKey === column.key
                              ? sortDirection === "asc"
                                ? "▲"
                                : "▼"
                              : "↕"}
                          </span>
                        )}
                      </div>
                    </Tooltip>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
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
                    const displayValue =
                      typeof column.render === "function"
                        ? column.render(value, row)
                        : getDisplayValue(value, column.type);
                    const sticky = isStickyColumn(column.key);
                    const left = sticky ? computeLeft(colIndex) : undefined;
                    const hasPrevSticky =
                      colIndex > 0 && isStickyColumn(columns[colIndex - 1].key);
                    const bgColor = rowIndex % 2 === 0 ? "#ffffff" : "#f9fafb";

                    const stickyWidth = computeStickyWidth(colIndex);
                    const minWidth = getMinWidthForColumn(column);
                    const cellStyle: React.CSSProperties | undefined = sticky
                      ? {
                          left,
                          width: stickyWidth,
                          minWidth: stickyWidth ?? minWidth,
                          backgroundColor: bgColor,
                          boxShadow:
                            hasPrevSticky || colIndex > 0
                              ? "2px 0 5px rgba(0, 0, 0, 0.1)"
                              : undefined,
                        }
                      : minWidth
                      ? { minWidth, backgroundColor: bgColor }
                      : undefined;

                    return (
                      <td
                        key={`${rowIndex}-${String(column.key)}`}
                        className={`${getCellClassName(
                          column,
                          value,
                          false,
                          rowIndex
                        )} ${sticky ? "sticky z-10" : ""}`}
                        style={cellStyle}
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
