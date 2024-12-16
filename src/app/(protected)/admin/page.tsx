import PathHeading from "@/components/custom/PathHeading";
import ProjectShowcase from "@/components/custom/projectShow";
import Section from "@/components/custom/Section";
import LogoutBtn from "@/components/user/Logout";
import { allSections } from "@/utils/client_utils";
import { getAllProjects } from "@/utils/dbActions";
import Link from "next/link";

export const revalidate = 0;

export default async function Admin() {
  const projects = await getAllProjects();

  return (
    <Section className="container mx-auto px-4 py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-8">
        <PathHeading />
        <div className="flex gap-4">
          <LogoutBtn />
          <Link
            href="/admin/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add New Project
          </Link>
        </div>
      </div>
      {/* {allSections.toString()} */}

      {allSections.map((section) => (
        <div
          className="flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-gray-200 shadow-md"
          key={section}
        >
          <h1 className="text-3xl font-bold">{section.toUpperCase()}</h1>
          <ProjectShowcase
            projects={projects.filter((p) => p.section === section)}
          />
        </div>
      ))}
    </Section>
  );
}
