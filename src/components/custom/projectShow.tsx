"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { deleteProject } from "@/utils/dbActions";
import { Prisma } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProjectShowcase = ({
  projects,
}: {
  projects: Prisma.ProjectCreateInput[];
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ",
        projects.length === 0 && "flex justify-center"
      )}
    >
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg p-1 shadow-md hover:shadow-lg transition-shadow flex flex-col border border-gray-300"
        >
          <div className="flex flex-col h-full justify-between gap-2">
            <div className="w-full p-2 border rounded-sm">
              {project.images && (
                <Carousel
                  className="h-full rounded-sm"
                  style={{ height: "100%" }}
                >
                  <CarouselContent className="-ml-1">
                    {Array.isArray(project.images) &&
                      project.images?.map(({ url }, index) => (
                        <CarouselItem key={index} className="pl-1">
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            transition={{ duration: 0.5 }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-shrink-0 h-full"
                          >
                            <Image
                              loading="lazy"
                              src={url}
                              width={400}
                              height={400}
                              alt={`Slide ${index}`}
                              className="w-auto object-cover h-full"
                            />
                          </motion.div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col justify-between ">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  {project.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-4 inline-block">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <div className="mb-2 text-sm text-gray-500 flex ">
                    <b>{project.section !== "none" ? project.section : ""}</b>
                    {project.type !== "none" ? (
                      <p>&nbsp;-&nbsp;{project.type}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <Link
                  href={`/admin/${project.id}`}
                  className="text-blue-500 text-center p-2 rounded-md border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Edit
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteProject(project);
                          router.refresh();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="text-center">
          <p>No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;
