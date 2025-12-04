"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { saveCalculation, getSavedCalculations, type SavedCalculation } from "@/lib/storage";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

interface CalculatorProps {
  onSave: () => void;
  initialPrice?: number;
  initialPercentageStep?: number;
}

export function Calculator({ onSave, initialPrice, initialPercentageStep }: CalculatorProps) {
  const [price, setPrice] = useState<string>(initialPrice?.toString() || "");
  const [prices, setPrices] = useState<string[]>([initialPrice?.toString() || ""]);
  const [percentageStep, setPercentageStep] = useState<number>(initialPercentageStep || 5);
  const [maxPercentage, setMaxPercentage] = useState<number>(100);
  const [minPercentage, setMinPercentage] = useState<number>(0);
  const [expertMode, setExpertMode] = useState<boolean>(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState<string>("");
  const [calculations, setCalculations] = useState<Array<{ percent: number; value: number }>>([]);
  const [allCalculations, setAllCalculations] = useState<Array<{ price: number; calcs: Array<{ percent: number; value: number }> }>>([]);
  const [currentPriceIndex, setCurrentPriceIndex] = useState<number>(0);
  const [selectedPercentages, setSelectedPercentages] = useState<Map<number, number>>(new Map()); // priceIndex -> selectedPercent
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (initialPrice !== undefined) {
      setPrice(initialPrice.toString());
      setPrices([initialPrice.toString()]);
    }
    if (initialPercentageStep !== undefined) {
      setPercentageStep(initialPercentageStep);
    }
    
    // Load max percentage from localStorage
    const storedMaxPercentage = localStorage.getItem("maxPercentage");
    if (storedMaxPercentage) {
      const parsed = parseInt(storedMaxPercentage, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        setMaxPercentage(parsed);
      }
    }

    // Load min percentage from localStorage
    const storedMinPercentage = localStorage.getItem("minPercentage");
    if (storedMinPercentage) {
      const parsed = parseInt(storedMinPercentage, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        setMinPercentage(parsed);
      }
    }

    // Load expert mode from localStorage
    const storedExpertMode = localStorage.getItem("expertMode");
    if (storedExpertMode) {
      setExpertMode(storedExpertMode === "true");
    }
    
    // Listen for max percentage changes
    const handleMaxPercentageChange = (e: CustomEvent<number>) => {
      setMaxPercentage(e.detail);
    };

    // Listen for min percentage changes
    const handleMinPercentageChange = (e: CustomEvent<number>) => {
      setMinPercentage(e.detail);
    };

    // Listen for expert mode changes
    const handleExpertModeChange = (e: CustomEvent<boolean>) => {
      setExpertMode(e.detail);
      if (!e.detail) {
        // Reset to single price mode
        setPrices([price || ""]);
        setCurrentPriceIndex(0);
      }
    };
    
    window.addEventListener("maxPercentageChanged", handleMaxPercentageChange as EventListener);
    window.addEventListener("minPercentageChanged", handleMinPercentageChange as EventListener);
    window.addEventListener("expertModeChanged", handleExpertModeChange as EventListener);
    
    return () => {
      window.removeEventListener("maxPercentageChanged", handleMaxPercentageChange as EventListener);
      window.removeEventListener("minPercentageChanged", handleMinPercentageChange as EventListener);
      window.removeEventListener("expertModeChanged", handleExpertModeChange as EventListener);
    };
  }, [initialPrice, initialPercentageStep, price]);

  useEffect(() => {
    if (expertMode) {
      // Calculate for all prices
      const allCalcs: Array<{ price: number; calcs: Array<{ percent: number; value: number }> }> = [];
      prices.forEach((p) => {
        const numPrice = parseFloat(p);
        if (!isNaN(numPrice) && numPrice > 0) {
          const calcs: Array<{ percent: number; value: number }> = [];
          for (let percent = maxPercentage; percent >= minPercentage; percent -= percentageStep) {
            const value = (numPrice * percent) / 100;
            calcs.push({ percent, value });
          }
          allCalcs.push({ price: numPrice, calcs });
        }
      });
      setAllCalculations(allCalcs);
      // Set current price calculations
      if (allCalcs.length > 0 && currentPriceIndex < allCalcs.length) {
        setCalculations(allCalcs[currentPriceIndex].calcs);
      } else {
        setCalculations([]);
      }
    } else {
      // Single price mode
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        setCalculations([]);
        return;
      }

      const calcs: Array<{ percent: number; value: number }> = [];
      for (let percent = maxPercentage; percent >= minPercentage; percent -= percentageStep) {
        const value = (numPrice * percent) / 100;
        calcs.push({ percent, value });
      }
      setCalculations(calcs);
      setAllCalculations([]);
    }
  }, [price, prices, percentageStep, maxPercentage, minPercentage, expertMode, currentPriceIndex]);

  const handleSave = () => {
    if (expertMode) {
      // Save all prices as a single calculation
      const validPrices = prices.map(p => parseFloat(p)).filter(p => !isNaN(p) && p > 0);
      if (validPrices.length === 0) return;
      
      const name = saveName.trim() || `Expert Calculation ${new Date().toLocaleDateString()}`;
      // Save with first price as representative
      saveCalculation({
        name,
        price: validPrices[0],
        percentageStep,
      });
    } else {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return;
      }

      const name = saveName.trim() || `Calculation ${new Date().toLocaleDateString()}`;
      saveCalculation({
        name,
        price: numPrice,
        percentageStep,
      });
    }
    setSaveName("");
    setSaveDialogOpen(false);
    onSave();
  };

  const addPriceField = () => {
    setPrices([...prices, ""]);
  };

  const removePriceField = (index: number) => {
    const newPrices = prices.filter((_, i) => i !== index);
    setPrices(newPrices);
    if (currentPriceIndex >= newPrices.length) {
      setCurrentPriceIndex(Math.max(0, newPrices.length - 1));
    }
  };

  const updatePrice = (index: number, value: string) => {
    const newPrices = [...prices];
    newPrices[index] = value;
    setPrices(newPrices);
    if (index === 0) {
      setPrice(value);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next price
        setCurrentPriceIndex((prev) => Math.min(prev + 1, allCalculations.length - 1));
      } else {
        // Swipe right - previous price
        setCurrentPriceIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const scrollToPrice = (index: number) => {
    setCurrentPriceIndex(index);
  };

  const togglePercentage = (priceIndex: number, percent: number) => {
    const newSelected = new Map(selectedPercentages);
    if (newSelected.get(priceIndex) === percent) {
      newSelected.delete(priceIndex);
    } else {
      newSelected.set(priceIndex, percent);
    }
    setSelectedPercentages(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    allCalculations.forEach((item, index) => {
      const selectedPercent = selectedPercentages.get(index);
      if (selectedPercent !== undefined) {
        const calc = item.calcs.find((c) => c.percent === selectedPercent);
        if (calc) {
          total += calc.value;
        }
      }
    });
    return total;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {!expertMode ? (
        <div className="space-y-2">
          <Label htmlFor="price">Base Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price (e.g., 100)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-lg"
            step="0.01"
            min="0"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Prices</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPriceField}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Price
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {prices.map((p, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <Input
                  type="number"
                  placeholder={`Price ${index + 1}`}
                  value={p}
                  onChange={(e) => updatePrice(index, e.target.value)}
                  className="text-lg flex-1"
                  step="0.01"
                  min="0"
                />
                {prices.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePriceField(index)}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="percentage-step">Percentage Step</Label>
        <Select
          id="percentage-step"
          value={percentageStep.toString()}
          onChange={(e) => setPercentageStep(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
            <option key={step} value={step}>
              {step}%
            </option>
          ))}
        </Select>
      </div>

      {expertMode && allCalculations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              Calculations ({currentPriceIndex + 1} of {allCalculations.length})
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setCurrentPriceIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentPriceIndex === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setCurrentPriceIndex((prev) => Math.min(prev + 1, allCalculations.length - 1))}
                disabled={currentPriceIndex === allCalculations.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Base Price: ${allCalculations[currentPriceIndex]?.price.toFixed(2)}
          </div>
        </div>
      )}

      {calculations.length > 0 && (
        <div className="space-y-2">
          {!expertMode && <Label>Calculations</Label>}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto p-2 border rounded-md calculations-scroll"
            onTouchStart={expertMode ? handleTouchStart : undefined}
            onTouchMove={expertMode ? handleTouchMove : undefined}
            onTouchEnd={expertMode ? handleTouchEnd : undefined}
          >
            {calculations.map((calc) => {
              const isSelected = expertMode && selectedPercentages.get(currentPriceIndex) === calc.percent;
              return (
                <button
                  key={calc.percent}
                  onClick={expertMode ? () => togglePercentage(currentPriceIndex, calc.percent) : undefined}
                  className={`p-3 border rounded-md text-center space-y-1 transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-accent"
                  } ${expertMode ? "cursor-pointer" : ""}`}
                >
                  <div className={`text-sm font-semibold ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {calc.percent}%
                  </div>
                  <div className="text-lg font-bold">
                    ${calc.value.toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {expertMode && allCalculations.length > 1 && (
        <div className="space-y-2">
          <Label>All Prices - Swipe or click to view</Label>
          <div className="flex gap-2 overflow-x-auto pb-2 calculations-scroll">
            {allCalculations.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToPrice(index)}
                className={`flex-shrink-0 p-3 border rounded-md text-center transition-colors ${
                  currentPriceIndex === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent"
                }`}
              >
                <div className="text-sm font-semibold">
                  ${item.price.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {expertMode && allCalculations.length > 0 && (
        <div className="space-y-2">
          <Label>Total</Label>
          <div className="p-4 bg-card border rounded-md space-y-3">
            <div className="space-y-2">
              {allCalculations.map((item, index) => {
                const selectedPercent = selectedPercentages.get(index);
                const selectedCalc = selectedPercent !== undefined
                  ? item.calcs.find((c) => c.percent === selectedPercent)
                  : null;
                
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${item.price.toFixed(2)}
                      {selectedPercent !== undefined && (
                        <span className="ml-2">({selectedPercent}%)</span>
                      )}
                    </span>
                    <span className="font-semibold">
                      {selectedCalc ? `$${selectedCalc.value.toFixed(2)}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              {selectedPercentages.size === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Click on percentages above to add them to the total
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setSaveDialogOpen(true)}
        className="w-full"
        disabled={
          expertMode
            ? prices.every((p) => !p || parseFloat(p) <= 0)
            : !price || parseFloat(price) <= 0
        }
      >
        Save Calculation
      </Button>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Calculation</DialogTitle>
            <DialogDescription>
              Give this calculation a name to save it for later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="save-name">Name</Label>
            <Input
              id="save-name"
              placeholder="Enter name (optional)"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
