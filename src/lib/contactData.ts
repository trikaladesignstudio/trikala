import type { Project } from "@prisma/client";

export const START_A_PROJECT_LINK_TITLE = "StartAProjectLink";

export const DEFAULT_START_A_PROJECT_LINK =
  "https://wa.me/message/XYR3GG2PO7KRC1";

export function getStartAProjectLinkFromProjects(
  projects: Pick<Project, "title" | "description">[]
): string | null {
  const link = projects.find(
    (project) => project.title === START_A_PROJECT_LINK_TITLE
  )?.description;

  const trimmed = link?.trim();
  return trimmed || null;
}

export function resolveStartAProjectLink(
  projects: Pick<Project, "title" | "description">[]
): string {
  return (
    getStartAProjectLinkFromProjects(projects) ?? DEFAULT_START_A_PROJECT_LINK
  );
}
