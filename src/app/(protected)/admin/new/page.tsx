import PathHeading from "@/components/custom/PathHeading";
import ProjectForm from "@/components/custom/ProjectForm";

export default function CreateProject() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl gap-8 flex flex-col">
      <PathHeading />
      <ProjectForm projectId={undefined} />
    </div>
  );
}
