"use client";

import { FormattedText } from "@/components/custom/FormattedText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProject } from "@/utils/dbActions";
import { Prisma } from "@prisma/client";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

import { AdminProject } from "@/lib/adminUtils";

type AdminProjectCardProps = {
  project: AdminProject;
  showSection?: boolean;
};

function getThumbnail(project: AdminProject) {
  if (Array.isArray(project.images) && project.images[0]?.url) {
    return project.images[0].url;
  }
  return null;
}

export default function AdminProjectCard({
  project,
  showSection = false,
}: AdminProjectCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const thumbnail = getThumbnail(project);

  if (!project.id) return null;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProject({ id: project.id } as Prisma.ProjectCreateInput);
        toast.success("Project deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete project");
      }
    });
  };

  return (
    <article className="flex min-h-[220px] flex-col rounded-2xl border border-admin-border bg-admin-surface p-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)]">
      <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-lg border border-admin-border bg-admin-canvas">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-geist-mono uppercase tracking-wider text-admin-muted">
            No image
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-admin-ink">
            {project.title}
          </h3>
          {project.featured && (
            <span className="rounded-full bg-admin-accent/10 px-2 py-0.5 text-[10px] font-geist-mono uppercase tracking-wide text-admin-accent">
              Featured
            </span>
          )}
        </div>

        <FormattedText className="mt-1 line-clamp-2 text-sm text-admin-muted">
          {project.description || "No description"}
        </FormattedText>

        <p className="mt-2 font-geist-mono text-xs text-admin-muted">
          {showSection && project.section !== "none"
            ? `${project.section} · `
            : ""}
          {project.type !== "none" ? project.type : "Uncategorized"}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Link
            href={`/admin/${project.id}`}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-admin-accent px-3 py-2 text-sm font-medium text-white transition-transform active:scale-[0.98] hover:bg-admin-accent/90"
          >
            <Pencil1Icon className="h-4 w-4" />
            Edit
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={isPending}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-transform active:scale-[0.98] hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-admin-border bg-admin-surface text-admin-ink sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-admin-ink">
                  Delete this project?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-admin-muted">
                  &ldquo;{project.title}&rdquo; will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <AlertDialogCancel className="min-h-[44px] w-full border-admin-border bg-admin-surface text-admin-ink hover:bg-admin-canvas sm:w-auto">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="min-h-[44px] w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto"
                >
                  Delete project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}
