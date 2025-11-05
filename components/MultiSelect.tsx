"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options?: { label: string; value: string }[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
  isLoading = false,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const filtered = React.useMemo(() => {
    if (!options) return [] as { label: string; value: string }[];
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      const container = triggerRef.current?.parentElement;
      if (container && !container.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "flex h-12 w-full transition-all items-center justify-between rounded-md border border-input bg-background text-sm",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          disabled={disabled}
          aria-expanded={open}
          onClick={() => setOpen((p) => !p)}
        >
          <div className="flex justify-between flex-1 overflow-hidden">
            <div
              className="flex gap-1 flex-1 py-2 px-3 overflow-x-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              {value.length === 0 ? (
                <span className="text-muted-foreground truncate">
                  {placeholder}
                </span>
              ) : (
                value.map((item) => {
                  const option = options?.find((opt) => opt.value === item);
                  return (
                    <Badge key={item} variant="default" className="text-xs">
                      {option?.label ?? item}
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 hover:bg-destructive transition-all hover:text-destructive-foreground rounded-full p-0.5"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUnselect(item)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnselect(item);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  );
                })
              )}
            </div>
            <hr className="border-l border-border h-6 mx-0.5 my-auto" />
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              tabIndex={0}
              className={cn(
                "p-1 mx-1.5 my-auto h-full outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-accent/50 rounded-sm cursor-pointer"
              )}
            >
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </span>
          </div>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
            <div className="p-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="max-h-64 overflow-auto p-1">
              {isLoading ? (
                <div className="p-2 space-y-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-4 w-full bg-gray-100 rounded"
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-sm py-4 text-muted-foreground">
                  No items found.
                </div>
              ) : (
                <ul className="py-1">
                  {filtered.map((option) => {
                    const selected = value.includes(option.value);
                    return (
                      <li
                        key={option.value}
                        className={cn(
                          "flex items-center px-2 py-1.5 text-sm cursor-pointer rounded",
                          "hover:bg-accent"
                        )}
                        onClick={() => handleSelect(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
