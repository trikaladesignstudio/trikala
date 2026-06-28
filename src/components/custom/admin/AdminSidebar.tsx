"use client";

import AdminThemeToggle from "@/components/custom/admin/AdminThemeToggle";
import LogoutBtn from "@/components/user/Logout";
import { sectionLabels, sidebarSections } from "@/lib/adminUtils";
import { cn } from "@/lib/utils";
import { sectionType } from "@/utils/client_utils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  Cross2Icon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SIDEBAR_STORAGE_KEY = "admin-sidebar-open";

export type AdminSidebarProps = {
  sectionCounts: Record<string, number>;
  totalCount: number;
  pdfCount: number;
  featuredCount: number;
};

function NavLink({
  href,
  label,
  count,
  isActive,
  indented = false,
  prominent = false,
  onNavigate,
}: {
  href: string;
  label: string;
  count?: number;
  isActive: boolean;
  indented?: boolean;
  prominent?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 font-medium transition-colors font-geist",
        prominent ? "py-3.5 text-base" : "py-2.5 text-sm",
        indented && "pl-5",
        isActive
          ? "bg-admin-accent/10 text-admin-accent"
          : "text-admin-muted hover:bg-admin-canvas hover:text-admin-ink"
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="font-geist-mono text-xs text-admin-muted">{count}</span>
      )}
    </Link>
  );
}

function SectionsGroup({
  pathname,
  sectionCounts,
  onNavigate,
}: {
  pathname: string;
  sectionCounts: Record<string, number>;
  onNavigate?: () => void;
}) {
  const isSectionPage = pathname.startsWith("/admin/sections/");
  const [open, setOpen] = useState(isSectionPage);

  useEffect(() => {
    if (isSectionPage) setOpen(true);
  }, [isSectionPage]);

  const totalInSections = sidebarSections.reduce(
    (sum, section) => sum + (sectionCounts[section] ?? 0),
    0
  );

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-geist-mono uppercase tracking-[0.14em] text-admin-muted transition-colors hover:bg-admin-canvas hover:text-admin-ink"
      >
        <span className="flex items-center gap-2">
          Sections
          {!open && (
            <span className="rounded-full bg-admin-canvas px-1.5 py-0.5 text-[10px] normal-case tracking-normal">
              {totalInSections}
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="mt-1 flex flex-col gap-1">
          {sidebarSections.map((section) => (
            <NavLink
              key={section}
              href={`/admin/sections/${section}`}
              label={sectionLabels[section as sectionType]}
              count={sectionCounts[section] ?? 0}
              isActive={pathname === `/admin/sections/${section}`}
              indented
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarNav({
  pathname,
  sectionCounts,
  totalCount,
  pdfCount,
  featuredCount,
  onNavigate,
}: AdminSidebarProps & { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      <NavLink
        href="/admin/all"
        label="All"
        count={totalCount}
        isActive={pathname === "/admin/all"}
        onNavigate={onNavigate}
      />
      <NavLink
        href="/admin/projects"
        label="Showcase"
        count={pdfCount}
        isActive={pathname === "/admin/projects"}
        onNavigate={onNavigate}
      />
      <NavLink
        href="/admin/featured"
        label="Featured"
        count={featuredCount}
        isActive={pathname === "/admin/featured"}
        onNavigate={onNavigate}
      />

      <SectionsGroup
        pathname={pathname}
        sectionCounts={sectionCounts}
        onNavigate={onNavigate}
      />

      <div className="my-3 border-t border-admin-border" />

      <NavLink
        href="/admin/pricing"
        label="Pricing"
        isActive={pathname === "/admin/pricing"}
        prominent
        onNavigate={onNavigate}
      />
    </nav>
  );
}

function getPageTitle(pathname: string) {
  if (pathname === "/admin/all") return "All";
  if (pathname === "/admin/projects") return "Showcase";
  if (pathname === "/admin/featured") return "Featured";
  if (pathname === "/admin/pricing") return "Pricing";
  if (pathname.startsWith("/admin/sections/")) {
    const section = pathname.split("/").pop() as sectionType;
    return sectionLabels[section] ?? "Section";
  }
  if (pathname === "/admin/new") return "New project";
  if (pathname.match(/^\/admin\/[^/]+$/)) return "Edit project";
  return "Admin";
}

export function AdminSidebarDesktop({
  sectionCounts,
  totalCount,
  pdfCount,
  featuredCount,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) setOpen(stored === "true");
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  }, [open, mounted]);

  const sidebarProps = {
    sectionCounts,
    totalCount,
    pdfCount,
    featuredCount,
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-r-lg border border-l-0 border-admin-border bg-admin-surface px-1.5 py-3 shadow-sm transition-colors hover:bg-admin-canvas md:inline-flex"
          aria-label="Open sidebar"
        >
          <HamburgerMenuIcon className="h-4 w-4 text-admin-ink" />
        </button>
      )}

      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-admin-border bg-admin-surface transition-[width] duration-200 ease-in-out md:flex md:h-[100dvh]",
          open ? "w-56" : "w-0 overflow-hidden border-r-0"
        )}
      >
        <div className="flex w-56 shrink-0 items-start justify-between border-b border-admin-border px-5 py-6">
          <div className="min-w-0">
            <p className="text-xs font-geist-mono uppercase tracking-[0.2em] text-admin-muted">
              Console
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-admin-ink font-geist">
              Trikala Admin
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-[36px] min-w-[36px] shrink-0 items-center justify-center rounded-lg border border-admin-border text-admin-muted transition-colors hover:bg-admin-canvas hover:text-admin-ink"
            aria-label="Close sidebar"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="w-56 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          <SidebarNav pathname={pathname} {...sidebarProps} />
        </div>

        <div className="w-56 shrink-0 space-y-2 border-t border-admin-border p-4">
          <AdminThemeToggle />
          <LogoutBtn fullWidth prominent />
        </div>
      </aside>
    </>
  );
}

export function AdminMobileNav({
  sectionCounts,
  totalCount,
  pdfCount,
  featuredCount,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-admin-border bg-admin-surface px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-admin-border"
          aria-label="Open menu"
        >
          <HamburgerMenuIcon className="h-5 w-5 text-admin-ink" />
        </button>
        <p className="text-sm font-semibold text-admin-ink">{pageTitle}</p>
        <LogoutBtn />
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-admin-ink/40"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,280px)] flex-col bg-admin-surface shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-admin-border px-5 py-4">
              <div>
                <p className="text-xs font-geist-mono uppercase tracking-[0.2em] text-admin-muted">
                  Console
                </p>
                <h2 className="text-lg font-semibold text-admin-ink">Trikala Admin</h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-admin-border"
                aria-label="Close menu"
              >
                <Cross2Icon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
              <SidebarNav
                pathname={pathname}
                sectionCounts={sectionCounts}
                totalCount={totalCount}
                pdfCount={pdfCount}
                featuredCount={featuredCount}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>

            <div className="shrink-0 space-y-2 border-t border-admin-border p-4">
              <AdminThemeToggle />
              <LogoutBtn fullWidth prominent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
