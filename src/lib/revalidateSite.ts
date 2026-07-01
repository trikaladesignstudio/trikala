import { revalidatePath } from "next/cache";

import { syncLocationSnapshot } from "@/lib/locationSnapshot";

/** Public routes that share (main)/layout.tsx (footer with contact data). */
const MAIN_LAYOUT_ROUTES = [
  "/",
  "/aboutus",
  "/projects",
  "/locations",
  "/privacyPolicy",
  "/termAndCondition",
] as const;

export async function revalidateLocationPages() {
  await syncLocationSnapshot();
  revalidatePath("/locations", "layout");
  revalidatePath("/sitemap.xml");
}

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
