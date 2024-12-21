import PathHeading from "@/components/custom/PathHeading";
import ProjectForm from "@/components/custom/ProjectForm";
import Section from "@/components/custom/Section";

export default function CreateProject() {
  return (
    <Section className="container px-4 py-8 gap-4 flex flex-col mx-auto w-fit">
      <PathHeading />
      <ProjectForm projectId={undefined} />
    </Section>
  );
}
