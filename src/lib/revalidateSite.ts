import { revalidatePath } from "next/cache";

/** Public routes that share (main)/layout.tsx (footer with contact data). */
const MAIN_LAYOUT_ROUTES = [
  "/",
  "/aboutus",
  "/projects",
  "/privacyPolicy",
  "/termAndCondition",
] as const;

export function revalidatePublicSite(projectId?: string) {
  revalidatePath("/", "page");

  for (const route of MAIN_LAYOUT_ROUTES) {
    revalidatePath(route, "layout");
  }

  revalidatePath("/aboutus", "page");
  revalidatePath("/projects", "layout");
  revalidatePath("/sitemap.xml");

  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
  }
}
