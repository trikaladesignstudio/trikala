import ProjectForm from "@/components/custom/ProjectForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <ProjectForm projectId={id} />
    </div>
  );
}
