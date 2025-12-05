"use client";

import { useState } from "react";
import { HelpCircle, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function Help() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg"
        aria-label="Open help"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Help & Information</DialogTitle>
            <DialogDescription>
              Learn how to use CardCalc
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                CardCalc is available on GitHub
              </p>
              <a
                href="https://github.com/samirjdev/cardcalc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Github className="h-4 w-4" />
                github.com/samirjdev/cardcalc
              </a>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="text-sm font-semibold">Add to Home Screen</h3>
              <p className="text-xs text-muted-foreground">
                To add CardCalc to your iOS home screen, tap the Share button in Safari, then select &quot;Add to Home Screen&quot;. This lets you access CardCalc like a native app with one tap.
              </p>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="text-sm font-semibold">How to Use</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium mb-1">Basic Mode:</p>
                  <p>Enter a price and select a percentage step. View all calculated percentages from 100% down to 0%.</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Expert Mode:</p>
                  <p>Add multiple prices at once. Click on any percentage for each price to select it. The total combines all selected percentages. Swipe left/right or use arrows to navigate between prices.</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Saving:</p>
                  <p>Save your calculations with a custom name for quick access later from the menu (top left).</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

