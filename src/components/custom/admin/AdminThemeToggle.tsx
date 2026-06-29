"use client";

import { useAdminTheme } from "@/components/custom/admin/AdminThemeProvider";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function AdminThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-admin-border px-4 py-3.5 text-base font-medium text-admin-muted transition-colors hover:bg-admin-canvas hover:text-admin-ink"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <SunIcon className="h-4 w-4" />
          Light mode
        </>
      ) : (
        <>
          <MoonIcon className="h-4 w-4" />
          Dark mode
        </>
      )}
    </button>
  );
}
