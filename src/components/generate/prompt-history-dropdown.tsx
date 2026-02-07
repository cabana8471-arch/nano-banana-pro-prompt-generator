"use client";

import { History, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PromptHistoryEntry } from "@/hooks/use-prompt-history";
import type { GenerationType } from "@/lib/types/generation";

interface PromptHistoryDropdownProps {
  history: PromptHistoryEntry[];
  onSelect: (prompt: string) => void;
  onRemove: (timestamp: number) => void;
  onClear: () => void;
  filterType?: GenerationType | undefined;
  disabled?: boolean;
}

export function PromptHistoryDropdown({
  history,
  onSelect,
  onRemove,
  onClear,
  filterType,
  disabled = false,
}: PromptHistoryDropdownProps) {
  const t = useTranslations("generate");

  // Filter by generation type if specified
  const filtered = filterType
    ? history.filter((e) => e.generationType === filterType)
    : history;

  if (filtered.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <History className="h-4 w-4 mr-1.5" />
          {t("recentPrompts")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 max-h-80 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t("recentPrompts")}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t("clearHistory")}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filtered.map((entry) => {
          const timeAgo = getTimeAgo(entry.timestamp);
          return (
            <DropdownMenuItem
              key={entry.timestamp}
              className="flex items-start gap-2 cursor-pointer py-2"
              onClick={() => onSelect(entry.prompt)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{entry.prompt}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry.generationType} &middot; {timeAgo}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(entry.timestamp);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
