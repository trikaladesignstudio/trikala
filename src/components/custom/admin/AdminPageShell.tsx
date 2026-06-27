import AdminHeader, {
  AdminHeaderAction,
} from "@/components/custom/admin/AdminHeader";

type AdminPageShellProps = {
  title: string;
  description: string;
  totalProjects: number;
  activeSections: number;
  action?: AdminHeaderAction;
  fullWidth?: boolean;
  children: React.ReactNode;
};

export default function AdminPageShell({
  title,
  description,
  totalProjects,
  activeSections,
  action,
  fullWidth = false,
  children,
}: AdminPageShellProps) {
  return (
    <div className="min-h-full">
      <AdminHeader
        title={title}
        description={description}
        totalProjects={totalProjects}
        activeSections={activeSections}
        action={action}
        fullWidth={fullWidth}
      />
      <div
        className={
          fullWidth
            ? "w-full px-4 py-6 md:px-8"
            : "mx-auto max-w-[1400px] px-4 py-6 md:px-8"
        }
      >
        {children}
      </div>
    </div>
  );
}
