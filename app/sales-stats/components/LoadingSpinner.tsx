"use client";

import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
