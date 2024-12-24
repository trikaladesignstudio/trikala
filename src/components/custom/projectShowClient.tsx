"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { Card } from "../ui/card";
import Link from "next/link";

const ProjectShowClient = ({
  projects,
}: {
  projects: Prisma.ProjectCreateInput[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="relative overflow-hidden max-h-96 lg:max-h-[14rem] "
        >
          <Link
            href={`/projects/${project.id}`}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 via-transparent to-slate-50/10 z-10"
          />
          <div className="w-full h-full hover:scale-[1.01] transition-all">
            <div className="flex flex-col h-full justify-between gap-2 cursor-pointer">
              <div className="w-full aspect-w-16 aspect-h-9 ">
                {project.images && (
                  <Carousel>
                    <CarouselContent className="-ml-4">
                      {Array.isArray(project.images) &&
                        project.images?.map(({ url }, index) => (
                          <CarouselItem key={index} className="pl-4">
                            <Image
                              loading="lazy"
                              src={url}
                              width={400}
                              height={200}
                              alt={`Slide ${index}`}
                              className="object-cover rounded-lg w-full "
                            />
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </div>
              <div className="flex justify-between  items-center absolute left-0 bottom-0 px-4 p-2 w-full   ">
                <div className="flex flex-row gap-2 w-full justify-between z-20 pointer-events-none">
                  <div className="text-xl font-semibold mb-2 text-white capitalize">
                    {project.title}
                  </div>
                  <div className="text-lg font-semibold mb-2 text-white capitalize opacity-45">
                    Public
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      {projects.length === 0 && (
        <div className="text-center">
          <p>No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectShowClient;
