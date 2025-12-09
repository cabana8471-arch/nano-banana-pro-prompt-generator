"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image, LayoutPanelTop, Hexagon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCost, formatTokens } from "@/lib/pricing";
import type { CostHistoryResponse, GenerationType, CostHistoryQueryParams } from "@/lib/types/cost-control";

interface CostHistoryTableProps {
  history: CostHistoryResponse | null;
  isLoading: boolean;
  onLoadHistory: (params: CostHistoryQueryParams) => void;
  translations: {
    title: string;
    description: string;
    date: string;
    type: string;
    prompt: string;
    tokens: string;
    cost: string;
    noData: string;
    previous: string;
    next: string;
    page: string;
    of: string;
    all: string;
    photo: string;
    banner: string;
    logo: string;
    filterByType: string;
  };
}

const typeIcons = {
  photo: Image,
  banner: LayoutPanelTop,
  logo: Hexagon,
};

export function CostHistoryTable({
  history,
  isLoading,
  onLoadHistory,
  translations: t,
}: CostHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<GenerationType | "all">("all");

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params: CostHistoryQueryParams = { page: newPage };
    if (selectedType !== "all") {
      params.generationType = selectedType;
    }
    onLoadHistory(params);
  };

  const handleTypeChange = (type: GenerationType | "all") => {
    setSelectedType(type);
    setCurrentPage(1);
    const params: CostHistoryQueryParams = { page: 1 };
    if (type !== "all") {
      params.generationType = type;
    }
    onLoadHistory(params);
  };

  const pagination = history?.pagination;
  const entries = history?.entries || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <Select value={selectedType} onValueChange={(v) => handleTypeChange(v as GenerationType | "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t.filterByType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="photo">{t.photo}</SelectItem>
              <SelectItem value="banner">{t.banner}</SelectItem>
              <SelectItem value="logo">{t.logo}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.type}</TableHead>
                    <TableHead className="max-w-[300px]">{t.prompt}</TableHead>
                    <TableHead className="text-right">{t.tokens}</TableHead>
                    <TableHead className="text-right">{t.cost}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => {
                    const TypeIcon = typeIcons[entry.generationType] || Image;
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">
                              {entry.generationType === "photo"
                                ? t.photo
                                : entry.generationType === "banner"
                                ? t.banner
                                : t.logo}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate" title={entry.prompt}>
                          {entry.prompt}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.totalTokenCount
                            ? formatTokens(entry.totalTokenCount)
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.estimatedCostMicros
                            ? formatCost(entry.estimatedCostMicros)
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {t.page} {pagination.page} {t.of} {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t.previous}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages || isLoading}
                  >
                    {t.next}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            {isLoading ? "Loading..." : t.noData}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
