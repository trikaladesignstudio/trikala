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
  action?: AdminHeaderAction;
};

export default function AdminHeader({
  title,
  action = defaultAction,
}: AdminHeaderProps) {
  const actionClassName =
    "inline-flex shrink-0 items-center gap-1.5 rounded-md bg-admin-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-admin-accent/90";

  return (
    <header className="border-b border-admin-border bg-admin-surface px-4 py-3 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight text-admin-ink">
          {title}
        </h1>
        {action.external ? (
          <Link
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClassName}
          >
            {action.label}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <Link href={action.href} className={actionClassName}>
            {action.label}
          </Link>
        )}
      </div>
    </header>
  );
}
