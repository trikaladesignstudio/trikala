import type { Project } from "@prisma/client";

export const START_A_PROJECT_LINK_TITLE = "StartAProjectLink";

export const DEFAULT_START_A_PROJECT_LINK =
  "https://wa.me/message/XYR3GG2PO7KRC1";

export function resolveStartAProjectLink(
  projects: Pick<Project, "title" | "description">[],
): string {
  const link = projects.find(
    (project) => project.title === START_A_PROJECT_LINK_TITLE,
  )?.description;
  const trimmed = link?.trim();
  return trimmed || DEFAULT_START_A_PROJECT_LINK;
}
