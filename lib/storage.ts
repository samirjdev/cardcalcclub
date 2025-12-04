export interface SavedCalculation {
  id: string;
  name: string;
  price: number;
  percentageStep: number;
  timestamp: number;
}

const STORAGE_KEY = "cardcalc_saved_calculations";

export function getSavedCalculations(): SavedCalculation[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveCalculation(calculation: Omit<SavedCalculation, "id" | "timestamp">): SavedCalculation {
  const saved = getSavedCalculations();
  const newCalc: SavedCalculation = {
    ...calculation,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  const updated = [newCalc, ...saved].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newCalc;
}

export function deleteCalculation(id: string): void {
  const saved = getSavedCalculations();
  const updated = saved.filter((calc) => calc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
