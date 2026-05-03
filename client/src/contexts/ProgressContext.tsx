import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { QuestKey } from "@/lib/quest";

type Progress = {
  completed: Record<QuestKey, boolean>;
  coins: number;
  markComplete: (k: QuestKey) => void;
  addCoins: (n: number) => void;
  reset: () => void;
};

const empty: Record<QuestKey, boolean> = {
  intro: false,
  explore: false,
  level1: false,
  level2: false,
  level3: false,
  ending: false,
};

const ProgressCtx = createContext<Progress | null>(null);
const KEY = "hca_progress_v1";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Record<QuestKey, boolean>>(empty);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.completed) setCompleted({ ...empty, ...data.completed });
        if (typeof data?.coins === "number") setCoins(data.coins);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ completed, coins }));
  }, [completed, coins]);

  const markComplete = useCallback((k: QuestKey) => {
    setCompleted((p) => (p[k] ? p : { ...p, [k]: true }));
  }, []);
  const addCoins = useCallback((n: number) => setCoins((c) => c + n), []);
  const reset = useCallback(() => {
    setCompleted(empty);
    setCoins(0);
  }, []);

  const value = useMemo(
    () => ({ completed, coins, markComplete, addCoins, reset }),
    [completed, coins, markComplete, addCoins, reset]
  );

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("ProgressProvider missing");
  return ctx;
}
