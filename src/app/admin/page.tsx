import ProjectShowcase from "@/components/custom/projectShow";
import { getAllProjects } from "@/utils/dbActions";
import Link from "next/link";

export default async function Admin() {
  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          href="/admin/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Project
        </Link>
      </div>
      <ProjectShowcase projects={projects} />
    </div>
  );
}
