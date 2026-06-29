"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type HeroIntroContextValue = {
  introComplete: boolean;
  markIntroComplete: () => void;
};

const HeroIntroContext = createContext<HeroIntroContextValue>({
  introComplete: false,
  markIntroComplete: () => {},
});

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const markIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <HeroIntroContext.Provider value={{ introComplete, markIntroComplete }}>
      {children}
    </HeroIntroContext.Provider>
  );
}

export function useHeroIntro() {
  return useContext(HeroIntroContext);
}
