"use client";

import { useState } from "react";
import { Calculator } from "@/components/calculator";
import { SavedCalculationsMenu } from "@/components/saved-calculations-menu";
import { Settings } from "@/components/settings";
import { Help } from "@/components/help";
import type { SavedCalculation } from "@/lib/storage";

export default function Home() {
  const [selectedCalc, setSelectedCalc] = useState<SavedCalculation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSave = () => {
    setRefreshKey((k) => k + 1);
    if (typeof window !== "undefined" && (window as any).refreshSavedCalculations) {
      (window as any).refreshSavedCalculations();
    }
  };

  const handleSelectSaved = (calc: SavedCalculation) => {
    setSelectedCalc(calc);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-20 pb-24 px-4 safe-area-inset">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-1">CardCalc</h1>
        
        {selectedCalc && (
          <div className="mb-6 p-4 bg-card border rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{selectedCalc.name}</h2>
              <button
                onClick={() => setSelectedCalc(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Base: ${selectedCalc.price.toFixed(2)} • Step: {selectedCalc.percentageStep}%
            </p>
          </div>
        )}

        <Calculator
          key={selectedCalc ? `calc-${selectedCalc.id}` : `calc-new-${refreshKey}`}
          onSave={handleSave}
          initialPrice={selectedCalc?.price}
          initialPercentageStep={selectedCalc?.percentageStep}
        />
      </div>

      <SavedCalculationsMenu onSelect={handleSelectSaved} />
      <Settings />
      <Help />
    </main>
  );
}
