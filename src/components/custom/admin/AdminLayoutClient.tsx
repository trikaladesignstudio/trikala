"use client";

import { AdminThemeProvider } from "@/components/custom/admin/AdminThemeProvider";
import {
  AdminMobileNav,
  AdminSidebarDesktop,
  AdminSidebarProps,
} from "@/components/custom/admin/AdminSidebar";

type AdminLayoutClientProps = {
  children: React.ReactNode;
  sidebarProps: AdminSidebarProps;
  className: string;
};

export default function AdminLayoutClient({
  children,
  sidebarProps,
  className,
}: AdminLayoutClientProps) {
  return (
    <AdminThemeProvider className={className}>
      <div className="flex h-full flex-col overflow-hidden md:flex-row">
        <AdminSidebarDesktop {...sidebarProps} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminMobileNav {...sidebarProps} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminThemeProvider>
  );
}
