"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type ThemeMode = "light" | "night" | "dark" | "tsg";

export function Settings() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [maxPercentage, setMaxPercentage] = useState<number>(100);
  const [expertMode, setExpertMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const storedMaxPercentage = localStorage.getItem("maxPercentage");
    
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "night" : "light";
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }

    if (storedMaxPercentage) {
      setMaxPercentage(parseInt(storedMaxPercentage, 10));
    }

    const storedExpertMode = localStorage.getItem("expertMode");
    if (storedExpertMode) {
      setExpertMode(storedExpertMode === "true");
    }
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    document.documentElement.classList.remove("light", "night", "dark", "tsg");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Apply gradient background for TSG theme
    if (newTheme === "tsg") {
      document.body.style.background = "radial-gradient(ellipse at center, hsl(195 70% 20%), hsl(195 70% 12%))";
      document.body.style.minHeight = "100vh";
    } else {
      document.body.style.background = "";
      document.body.style.minHeight = "";
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleMaxPercentageChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 100 && num <= 500) {
      setMaxPercentage(num);
      localStorage.setItem("maxPercentage", num.toString());
      // Trigger a custom event to notify calculator
      window.dispatchEvent(new CustomEvent("maxPercentageChanged", { detail: num }));
    }
  };

  const handleExpertModeChange = (checked: boolean) => {
    setExpertMode(checked);
    localStorage.setItem("expertMode", checked.toString());
    // Trigger a custom event to notify calculator
    window.dispatchEvent(new CustomEvent("expertModeChanged", { detail: checked }));
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50">
        <SettingsIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        aria-label="Open settings"
      >
        <SettingsIcon className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your CardCalc experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                id="theme"
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as ThemeMode)}
              >
                <option value="light">Light Mode</option>
                <option value="night">Night Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="tsg">TSG</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-percentage">Maximum Percentage</Label>
              <Input
                id="max-percentage"
                type="number"
                min="100"
                max="500"
                value={maxPercentage}
                onChange={(e) => handleMaxPercentageChange(e.target.value)}
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground">
                The highest percentage to calculate (default: 100%)
              </p>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="expert-mode">Expert Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Add multiple prices at once
                </p>
              </div>
              <Switch
                id="expert-mode"
                checked={expertMode}
                onCheckedChange={handleExpertModeChange}
              />
            </div>

            <div className="pt-4 border-t space-y-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
