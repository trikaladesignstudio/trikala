"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { ProjectType, sectionType } from "./client_utils";

export async function getAllProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function filterAllProjects(
  section?: sectionType,
  type?: ProjectType
) {
  const filterConditions: any = {};
  if (!section && !type) {
    return [];
  }

  if (section) {
    filterConditions.section = section;
  }
  if (type) {
    filterConditions.type = type;
  }

  const filteredData = await prisma.project.findMany({
    where: filterConditions,
  });

  return filteredData;
}

export async function addAProject(projectData: Prisma.ProjectCreateInput) {
  try {
    const project = await prisma.project.create({
      data: projectData,
    });

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      error: "Error creating project",
    };
  }
}

export async function deleteProject(projectData: Prisma.ProjectCreateInput) {
  try {
    // get the project
    const project = await prisma.project.findUnique({
      where: {
        id: projectData.id,
      },
      select: {
        images: true,
      },
    });

    project?.images.forEach(async (image) => {
      await deleteFile(image.name);
    });

    const projectDel = await prisma.project.delete({
      where: {
        id: projectData.id,
      },
    });
    return projectDel;
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      error: "Error deleting project",
    };
  }
}

export async function updateProject(
  id: string,
  projectData: Prisma.ProjectUpdateInput
) {
  try {
    const project = await prisma.project.update({
      where: {
        id: id,
      },
      data: projectData,
    });
    return project;
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      error: "Error updating project",
    };
  }
}

export async function getProject(id: string) {
  // console.log("id:", id);
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });
    return project;
  } catch (error) {
    return null;
  }
}

// upload thing del file
const utapi = new UTApi();

export const deleteFile = async (name: string) => {
  const data = await utapi.deleteFiles(name);
  console.log("data:", data);
};
