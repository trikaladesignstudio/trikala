"use client";

import {
  createContext,
  RefObject,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type ScrollContainerContextValue = {
  scrollRef: RefObject<HTMLElement | null>;
  scrollLocked: boolean;
  setScrollLocked: Dispatch<SetStateAction<boolean>>;
};

export const ScrollContainerContext =
  createContext<ScrollContainerContextValue | null>(null);

export function useScrollContainerContext() {
  const ctx = useContext(ScrollContainerContext);
  if (!ctx) {
    throw new Error(
      "useScrollContainerContext must be used within ScrollContainerContext.Provider"
    );
  }
  return ctx;
}

export function useScrollContainer() {
  return useScrollContainerContext().scrollRef;
}

export function useScrollLock() {
  const { scrollLocked, setScrollLocked } = useScrollContainerContext();
  return { scrollLocked, setScrollLocked };
}

export function useScrollContainerState() {
  const [scrollLocked, setScrollLocked] = useState(false);
  return useMemo(
    () => ({ scrollLocked, setScrollLocked }),
    [scrollLocked]
  );
}
