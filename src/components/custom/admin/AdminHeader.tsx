import Link from "next/link";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export type AdminHeaderAction = {
  href: string;
  label: string;
  external?: boolean;
};

const defaultAction: AdminHeaderAction = {
  href: "/admin/new",
  label: "Add project",
};

type AdminHeaderProps = {
  title: string;
  description: string;
  totalProjects: number;
  activeSections: number;
  action?: AdminHeaderAction;
  fullWidth?: boolean;
};

export default function AdminHeader({
  title,
  description,
  totalProjects,
  activeSections,
  action = defaultAction,
  fullWidth = false,
}: AdminHeaderProps) {
  const actionClassName =
    "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg bg-admin-accent px-4 py-2.5 text-sm font-medium text-white transition-transform hover:bg-admin-accent/90 active:scale-[0.98]";

  return (
    <header className="border-b border-admin-border bg-admin-surface px-4 py-6 md:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="font-geist-mono text-xs uppercase tracking-[0.18em] text-admin-muted">
            Content management
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-admin-ink md:text-3xl">
            {title}
          </h1>
          <p
            className={`mt-2 text-sm leading-relaxed text-admin-muted ${
              fullWidth ? "max-w-none" : "max-w-2xl"
            }`}
          >
            {description}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="min-w-[7.5rem] rounded-xl border border-admin-border bg-admin-canvas px-4 py-3">
            <p className="text-xs text-admin-muted">Total projects</p>
            <p className="font-geist-mono text-2xl font-semibold text-admin-ink">
              {totalProjects}
            </p>
          </div>
          <div className="min-w-[7.5rem] rounded-xl border border-admin-border bg-admin-canvas px-4 py-3">
            <p className="text-xs text-admin-muted">Active sections</p>
            <p className="font-geist-mono text-2xl font-semibold text-admin-ink">
              {activeSections}
            </p>
          </div>
          {action.external ? (
            <Link
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClassName}
            >
              {action.label}
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          ) : (
            <Link href={action.href} className={actionClassName}>
              {action.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
