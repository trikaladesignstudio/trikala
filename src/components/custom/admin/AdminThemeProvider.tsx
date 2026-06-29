"use client";

import { cn } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "admin-theme";

export type AdminTheme = "light" | "dark";

type AdminThemeContextValue = {
  theme: AdminTheme;
  toggleTheme: () => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}

type AdminThemeProviderProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminThemeProvider({
  children,
  className,
}: AdminThemeProviderProps) {
  const [theme, setTheme] = useState<AdminTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.add("admin-theme");
    root.classList.toggle("dark", theme === "dark");

    return () => {
      root.classList.remove("admin-theme", "dark");
    };
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={cn(
          "admin-theme h-full",
          theme === "dark" && "dark",
          className
        )}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}
