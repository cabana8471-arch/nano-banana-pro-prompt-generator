"use client";

import { useState, useMemo } from "react";
import { Settings, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_PRICING } from "@/lib/pricing";
import type { UserBudget, PricingSettings } from "@/lib/types/cost-control";

interface BudgetSettingsDialogProps {
  budget: UserBudget | null;
  pricing: PricingSettings | null;
  isLoading: boolean;
  onSaveBudget: (budget: UserBudget) => Promise<boolean>;
  onSavePricing: (pricing: PricingSettings) => Promise<boolean>;
  translations: {
    title: string;
    description: string;
    budgetTab: string;
    pricingTab: string;
    monthlyBudget: string;
    monthlyBudgetDesc: string;
    alertThreshold: string;
    alertThresholdDesc: string;
    enableAlerts: string;
    enableAlertsDesc: string;
    inputTokenPrice: string;
    outputTextPrice: string;
    outputImagePrice: string;
    per1kTokens: string;
    resetToDefaults: string;
    save: string;
    saving: string;
    cancel: string;
    noLimit: string;
  };
}

export function BudgetSettingsDialog({
  budget,
  pricing,
  isLoading,
  onSaveBudget,
  onSavePricing,
  translations: t,
}: BudgetSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Compute initial values from props
  const initialBudgetValues = useMemo(() => ({
    monthlyBudget: budget?.monthlyBudgetMicros && budget.monthlyBudgetMicros > 0
      ? (budget.monthlyBudgetMicros / 1_000_000).toFixed(2)
      : "",
    alertThreshold: budget?.alertThreshold?.toString() ?? "80",
    alertEnabled: budget?.alertEnabled ?? true,
  }), [budget]);

  const initialPricingValues = useMemo(() => ({
    inputPrice: pricing ? (pricing.inputTokenPriceMicros / 1000).toFixed(6) : (DEFAULT_PRICING.inputTokenPriceMicros / 1000).toFixed(6),
    outputTextPrice: pricing ? (pricing.outputTextPriceMicros / 1000).toFixed(6) : (DEFAULT_PRICING.outputTextPriceMicros / 1000).toFixed(6),
    outputImagePrice: pricing ? (pricing.outputImagePriceMicros / 1000).toFixed(6) : (DEFAULT_PRICING.outputImagePriceMicros / 1000).toFixed(6),
  }), [pricing]);

  // Budget state - initialize from memoized values
  const [monthlyBudget, setMonthlyBudget] = useState(initialBudgetValues.monthlyBudget);
  const [alertThreshold, setAlertThreshold] = useState(initialBudgetValues.alertThreshold);
  const [alertEnabled, setAlertEnabled] = useState(initialBudgetValues.alertEnabled);

  // Pricing state - initialize from memoized values
  const [inputPrice, setInputPrice] = useState(initialPricingValues.inputPrice);
  const [outputTextPrice, setOutputTextPrice] = useState(initialPricingValues.outputTextPrice);
  const [outputImagePrice, setOutputImagePrice] = useState(initialPricingValues.outputImagePrice);

  // Reset form values when dialog opens (sync with latest prop values)
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset to current prop values when opening
      setMonthlyBudget(initialBudgetValues.monthlyBudget);
      setAlertThreshold(initialBudgetValues.alertThreshold);
      setAlertEnabled(initialBudgetValues.alertEnabled);
      setInputPrice(initialPricingValues.inputPrice);
      setOutputTextPrice(initialPricingValues.outputTextPrice);
      setOutputImagePrice(initialPricingValues.outputImagePrice);
    }
    setOpen(isOpen);
  };

  const handleSaveBudget = async () => {
    setIsSaving(true);
    const budgetMicros = monthlyBudget ? Math.round(parseFloat(monthlyBudget) * 1_000_000) : 0;
    const threshold = parseInt(alertThreshold) || 80;

    const success = await onSaveBudget({
      monthlyBudgetMicros: budgetMicros,
      alertThreshold: Math.min(100, Math.max(0, threshold)),
      alertEnabled,
    });

    setIsSaving(false);
    if (success) {
      setOpen(false);
    }
  };

  const handleSavePricing = async () => {
    setIsSaving(true);
    const success = await onSavePricing({
      inputTokenPriceMicros: Math.round(parseFloat(inputPrice || "0") * 1000),
      outputTextPriceMicros: Math.round(parseFloat(outputTextPrice || "0") * 1000),
      outputImagePriceMicros: Math.round(parseFloat(outputImagePrice || "0") * 1000),
    });

    setIsSaving(false);
    if (success) {
      setOpen(false);
    }
  };

  const resetPricingToDefaults = () => {
    setInputPrice((DEFAULT_PRICING.inputTokenPriceMicros / 1000).toFixed(6));
    setOutputTextPrice((DEFAULT_PRICING.outputTextPriceMicros / 1000).toFixed(6));
    setOutputImagePrice((DEFAULT_PRICING.outputImagePriceMicros / 1000).toFixed(6));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          {t.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="budget">{t.budgetTab}</TabsTrigger>
            <TabsTrigger value="pricing">{t.pricingTab}</TabsTrigger>
          </TabsList>

          <TabsContent value="budget" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">{t.monthlyBudget}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyBudget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder={t.noLimit}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t.monthlyBudgetDesc}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertThreshold">{t.alertThreshold}</Label>
              <div className="relative">
                <Input
                  id="alertThreshold"
                  type="number"
                  min="0"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.alertThresholdDesc}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t.enableAlerts}</Label>
                <p className="text-xs text-muted-foreground">{t.enableAlertsDesc}</p>
              </div>
              <Switch checked={alertEnabled} onCheckedChange={setAlertEnabled} />
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleSaveBudget} disabled={isSaving || isLoading}>
                {isSaving ? t.saving : t.save}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="inputPrice">{t.inputTokenPrice}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="inputPrice"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t.per1kTokens}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputTextPrice">{t.outputTextPrice}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="outputTextPrice"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={outputTextPrice}
                  onChange={(e) => setOutputTextPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t.per1kTokens}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputImagePrice">{t.outputImagePrice}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="outputImagePrice"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={outputImagePrice}
                  onChange={(e) => setOutputImagePrice(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t.per1kTokens}</p>
            </div>

            <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={resetPricingToDefaults}
                className="sm:mr-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t.resetToDefaults}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleSavePricing} disabled={isSaving || isLoading}>
                {isSaving ? t.saving : t.save}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
