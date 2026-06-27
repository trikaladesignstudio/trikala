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
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        projects.length === 0 && "flex justify-center"
      )}
    >
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col rounded-xl border border-slate-200/50 bg-admin-canvas p-3 transition-shadow hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex flex-col h-full justify-between gap-2">
            <div className="w-full p-2 border rounded-sm">
              {project.images && (
                <Carousel
                  className="h-full rounded-sm"
                  // style={{ height: "100%"  }}
                >
                  <CarouselContent className="-ml-1">
                    {Array.isArray(project.images) &&
                      project.images?.map(({ url }, index) => (
                        <CarouselItem key={index} className="pl-1 ">
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            transition={{ duration: 0.5 }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-shrink-0 h-full justify-center items-center flex max-h-60"
                          >
                            <Image
                              loading="lazy"
                              src={url}
                              width={400}
                              height={400}
                              alt={`Slide ${index}`}
                              className="w-auto object-cover "
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
            <div className="w-full flex flex-col justify-between p-2">
              <div className="flex flex-col justify-between ">
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-admin-ink">
                    {project.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 text-sm text-admin-muted">
                    {project.description}
                  </p>
                  {project.featured && (
                    <span className="mb-4 inline-block rounded-full bg-admin-accent/10 px-2 py-1 text-xs text-admin-accent">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2 justify-end">
                    <div className="mb-2 flex text-xs font-geist-mono text-admin-muted">
                      <b>{project.section !== "none" ? project.section : ""}</b>
                      {project.type !== "none" ? (
                        <p>&nbsp;-&nbsp;{project.type}</p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
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
                    <Link
                      href={`/admin/${project.id}`}
                      className="rounded-lg border border-admin-accent px-4 py-2 text-center text-sm text-admin-accent transition-colors hover:bg-admin-accent hover:text-white"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
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
