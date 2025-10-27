"use client";

import React from "react";
import { TableConfig, TableColumn } from "../types";
// import { getDisplayValue } from "../helpers/calculations";

interface DataTableProps<T> {
  config: TableConfig<T>;
  className?: string;
}

const getDisplayValue = (value: any, type: string) => {
  if (type === "number") {
    return value.toFixed(2);
  }
  if (type === "integer") {
    return Math.round(value).toString();
  }
  return value;
};

export function DataTable<T extends Record<string, any>>({
  config,
  className = "",
}: DataTableProps<T>) {
  const { title, columns, data, showTotals = false } = config;

  const getCellClassName = (
    column: TableColumn<T>,
    value: any,
    isTotalRow: boolean = false
  ) => {
    const baseClasses = "px-3 py-2 text-sm";
    const todoClasses = "bg-red-100 text-red-800 font-medium";
    const percentageClasses = "bg-green-100 text-green-800 font-medium";
    const totalClasses = isTotalRow ? "font-semibold bg-gray-50" : "";

    if (isTodoValue(value)) {
      return `${baseClasses} ${todoClasses} ${totalClasses}`;
    }

    if (column.type === "percentage" && !isTodoValue(value)) {
      return `${baseClasses} ${percentageClasses} ${totalClasses}`;
    }

    return `${baseClasses} ${totalClasses}`;
  };

  const isTodoValue = (value: any): boolean => {
    return value === "TODO" || value === null || value === undefined;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((column, colIndex) => {
                  const value = row[column.key];
                  const displayValue = getDisplayValue(value, column.type);
                  const isTotalRow =
                    row.csm === "TOTAL" || row.expert === "TOTAL";

                  return (
                    <td
                      key={colIndex}
                      className={getCellClassName(column, value, isTotalRow)}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
