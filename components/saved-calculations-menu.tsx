"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getSavedCalculations, type SavedCalculation } from "@/lib/storage";

interface SavedCalculationsMenuProps {
  onSelect: (calc: SavedCalculation) => void;
}

export function SavedCalculationsMenu({ onSelect }: SavedCalculationsMenuProps) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<SavedCalculation[]>([]);

  const loadSaved = () => {
    setSaved(getSavedCalculations());
  };

  useEffect(() => {
    loadSaved();
    // Listen for storage changes (from other tabs)
    window.addEventListener("storage", loadSaved);
    return () => window.removeEventListener("storage", loadSaved);
  }, []);

  // Expose refresh function to parent
  useEffect(() => {
    (window as any).refreshSavedCalculations = loadSaved;
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50"
        aria-label="Open saved calculations"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Saved Calculations</SheetTitle>
            <SheetDescription>
              Select a calculation to view it. You cannot edit saved calculations.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
            {saved.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No saved calculations yet.
              </p>
            ) : (
              saved.map((calc) => (
                <Button
                  key={calc.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => {
                    onSelect(calc);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col items-start space-y-1">
                    <div className="font-semibold">{calc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ${calc.price.toFixed(2)} • {calc.percentageStep}% steps
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(calc.timestamp).toLocaleString()}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
