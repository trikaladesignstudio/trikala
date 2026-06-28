"use client";

import { createContext, RefObject, useContext } from "react";

export const ScrollContainerContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}
