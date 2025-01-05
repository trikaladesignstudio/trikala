"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { allProjectTypes, ProjectType, sectionType } from "./client_utils";
import { revalidatePath } from "next/cache";
import { expertiseDataType } from "@/jsonData/Home/Expertise";

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

export async function getAllProjectsByPDF() {
  try {

    // for some mf reason this is not working with filter not sure why !!!!!! panic 3hrs wasted
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (projects.length) {
      const filteredProject = projects.filter((project) => project.pdf);
      return filteredProject;
    } else {
      return [];
    }
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

export async function getAllProjectsGroupByType() {
  // const tempExpertiseData: expertiseDataType[] = [];
  const architecturalConcepts = [
    "We design bespoke architectural solutions that embody your vision, ensuring functionality and aesthetics seamlessly align with your unique lifestyle.",
    "Our architectural concepts are tailored to reflect your individuality, creating spaces that resonate with your preferences and aspirations.",
    "We craft personalized architectural designs that harmonize your personality with innovative, purpose-driven structures.",
    "Our architecture transforms your ideas into distinctive spaces, blending creativity with your specific needs and desires.",
  ];


  const allProjectTypesData = await allProjectTypes
    .filter((item) => item !== ProjectType.none)
    .map(async (item, index) => {
      const data = await filterAllProjects(undefined, item);
      const allRelatedImages = await data
        .filter((data) => data.type === item)
        .map((data) => data.images)
        .flat()
        .map((image) => image?.url);

      return {
        id: index,
        title: item,
        description: architecturalConcepts[index],
          // "We create unique architectural concepts that reflect your personality and meet your needs and preferences",
        images: allRelatedImages as string[],
      };
    });
  return await Promise.all(allProjectTypesData);
}

export async function getAllFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true,
      },
    });
    if (!projects) {
      return [];
    }
    interface Product {
      category: string;
      [key: string]: any; // Allows additional properties in the product object
    }
    return projects.reduce<Record<string, Product[]>>((acc, product) => {
      (acc[product.type] = acc[product.type] || []).push(product as any);
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function addAProject(projectData: Prisma.ProjectCreateInput) {
  try {
    const project = await prisma.project.create({
      data: projectData,
    });
    revalidatePath("/admin");
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

    revalidatePath("/admin");

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
    revalidatePath("/admin");
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
