"use client";

import { formatDistanceToNow } from "date-fns";
import { Undo2, Redo2, History, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LogoHistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onClearHistory: () => void;
  recentHistory: { action: string; timestamp: number }[];
  disabled?: boolean;
}

export function LogoHistoryControls({
  canUndo,
  canRedo,
  historyLength,
  currentIndex,
  onUndo,
  onRedo,
  onClearHistory,
  recentHistory,
  disabled = false,
}: LogoHistoryControlsProps) {
  const t = useTranslations("logoGenerator");

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1">
        {/* Undo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onUndo}
              disabled={disabled || !canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("history.undo")}</p>
          </TooltipContent>
        </Tooltip>

        {/* Redo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onRedo}
              disabled={disabled || !canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("history.redo")}</p>
          </TooltipContent>
        </Tooltip>

        {/* History Popover */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  disabled={disabled || historyLength <= 1}
                >
                  <History className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("history.viewHistory")}</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{t("history.title")}</h4>
                <span className="text-xs text-muted-foreground">
                  {t("history.stateCount", { current: currentIndex + 1, total: historyLength })}
                </span>
              </div>
              <ScrollArea className="h-48">
                <div
                  role="list"
                  aria-label={t("history.historyList")}
                  className="space-y-1"
                >
                  {recentHistory
                    .slice()
                    .reverse()
                    .map((entry, index) => {
                      const originalIndex = recentHistory.length - 1 - index;
                      const isCurrentState = originalIndex === currentIndex;
                      return (
                        <div
                          key={entry.timestamp}
                          role="listitem"
                          tabIndex={0}
                          aria-current={isCurrentState ? "step" : undefined}
                          className={`flex items-center justify-between p-2 rounded text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isCurrentState
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted focus-visible:bg-muted"
                          }`}
                        >
                          <span className="truncate flex-1">{entry.action}</span>
                          <span className="text-muted-foreground ml-2 shrink-0">
                            {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={onClearHistory}
                  disabled={historyLength <= 1}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  {t("history.clearHistory")}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}
