"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
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
  const [maxPercentageInput, setMaxPercentageInput] = useState<string>("100");
  const [minPercentage, setMinPercentage] = useState<number>(0);
  const [minPercentageInput, setMinPercentageInput] = useState<string>("0");
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
      const parsed = parseInt(storedMaxPercentage, 10);
      setMaxPercentage(parsed);
      setMaxPercentageInput(storedMaxPercentage);
    }

    const storedMinPercentage = localStorage.getItem("minPercentage");
    if (storedMinPercentage) {
      const parsed = parseInt(storedMinPercentage, 10);
      setMinPercentage(parsed);
      setMinPercentageInput(storedMinPercentage);
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
    
    // Update theme-color meta tag for iOS
    const themeColorMap: Record<ThemeMode, string> = {
      light: "#ffffff",
      night: "#0f172a",
      dark: "#000000",
      tsg: "#1a3d47"
    };
    const themeColor = themeColorMap[newTheme];
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", themeColor);
    
    // Apply gradient background for TSG theme
    if (newTheme === "tsg") {
      document.body.style.background = "radial-gradient(ellipse at center, hsl(195 70% 20%), hsl(195 70% 12%))";
      document.body.style.minHeight = "100vh";
      document.body.style.minHeight = "-webkit-fill-available";
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
    // Update input value immediately to allow clearing
    setMaxPercentageInput(value);
    
    // Allow empty string while typing
    if (value === "" || value === "-") {
      return;
    }
    
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 1000) {
      const intNum = Math.round(num);
      setMaxPercentage(intNum);
      localStorage.setItem("maxPercentage", intNum.toString());
      // Trigger a custom event to notify calculator
      window.dispatchEvent(new CustomEvent("maxPercentageChanged", { detail: intNum }));
    }
  };

  const handleMaxPercentageBlur = () => {
    // If empty or invalid, reset to current value
    if (maxPercentageInput === "" || isNaN(parseFloat(maxPercentageInput))) {
      setMaxPercentageInput(maxPercentage.toString());
    } else {
      const num = parseFloat(maxPercentageInput);
      if (num < 0 || num > 1000) {
        setMaxPercentageInput(maxPercentage.toString());
      }
    }
  };

  const handleMinPercentageChange = (value: string) => {
    // Update input value immediately to allow clearing
    setMinPercentageInput(value);
    
    // Allow empty string while typing
    if (value === "" || value === "-") {
      return;
    }
    
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 1000) {
      const intNum = Math.round(num);
      setMinPercentage(intNum);
      localStorage.setItem("minPercentage", intNum.toString());
      // Trigger a custom event to notify calculator
      window.dispatchEvent(new CustomEvent("minPercentageChanged", { detail: intNum }));
    }
  };

  const handleMinPercentageBlur = () => {
    // If empty or invalid, reset to current value
    if (minPercentageInput === "" || isNaN(parseFloat(minPercentageInput))) {
      setMinPercentageInput(minPercentage.toString());
    } else {
      const num = parseFloat(minPercentageInput);
      if (num < 0 || num > 1000) {
        setMinPercentageInput(minPercentage.toString());
      }
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
                type="text"
                value={maxPercentageInput}
                onChange={(e) => handleMaxPercentageChange(e.target.value)}
                onBlur={handleMaxPercentageBlur}
                placeholder="100"
                className={minPercentage > maxPercentage ? "border-destructive" : ""}
              />
              {minPercentage > maxPercentage && (
                <p className="text-xs text-destructive font-medium">
                  ⚠️ Maximum cannot be less than minimum. Calculations will not work correctly.
                </p>
              )}
              {minPercentage <= maxPercentage && (
                <p className="text-xs text-muted-foreground">
                  The highest percentage to calculate (default: 100%)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-percentage">Minimum Percentage</Label>
              <Input
                id="min-percentage"
                type="text"
                value={minPercentageInput}
                onChange={(e) => handleMinPercentageChange(e.target.value)}
                onBlur={handleMinPercentageBlur}
                placeholder="0"
                className={minPercentage > maxPercentage ? "border-destructive" : ""}
              />
              {minPercentage > maxPercentage && (
                <p className="text-xs text-destructive font-medium">
                  ⚠️ Minimum cannot be greater than maximum. Calculations will not work correctly.
                </p>
              )}
              {minPercentage <= maxPercentage && (
                <p className="text-xs text-muted-foreground">
                  The lowest percentage to calculate (default: 0%)
                </p>
              )}
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

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
