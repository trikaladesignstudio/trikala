"use client";

import {
  allProjectTypes,
  allSections,
  ProjectType,
  sectionType,
} from "@/utils/client_utils";
import { motion } from "framer-motion";
import {
  addAProject,
  deleteFile,
  getProject,
  updateProject,
} from "@/utils/dbActions";
import { images } from "@/utils/types";
import { UploadDropzone } from "@/utils/uploadthing";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Cross1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import Heading from "./Heading";
import { cn } from "@/lib/utils";

export default function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [filenames, setFileNames] = useState<images[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Prisma.ProjectCreateInput>({
    title: "",
    description: "",
    section: sectionType.none,
    type: ProjectType.none,
    featured: false,
    images: [],
    pdf: "",
  });

  const getProjectInfo = async () => {
    projectId &&
      getProject(projectId).then((project) => {
        console.log("project:", project);
        if (project === null) {
          toast.error("Error fetching project");
          setTimeout(() => {
            router.push("/admin");
          }, 2000);
        }
        if (project) {
          setFormData({
            title: project.title,
            description: project.description,
            section: project.section,
            type: project.type,
            featured: project.featured,
            images: project.images,
            pdf: project.pdf,
          });
          setFileNames(project.images);
        }
      });
  };

  useEffect(() => {
    if (projectId) getProjectInfo();
  }, [projectId]);

  useEffect(() => {
    if (filenames) {
      setFormData((prev) => ({
        ...prev,
        images: filenames,
      }));
    }
  }, [filenames]);

  const deleteFileWithFilename = async (filename: images) => {
    console.log("Deleting file:", filename);
    await deleteFile(filename.name);
    if (filenames) {
      setFileNames(filenames.filter((file) => file.name !== filename.name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSubmited(true);
    // console.log("formData:", formData);

    try {
      if (projectId) {
        await updateProject(projectId, formData);
      } else {
        await addAProject(formData);
      }
      router.push("/admin");
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error("Error creating project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <motion.div
        className={cn(
          "h-full flex flex-col lg:flex-row  gap-8",
        )}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-2 bg-black/20 p-4 rounded-lg max-w-2xl"
        >
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="section"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Section *
              </label>
              <select
                id="section"
                name="section"
                className="block w-full px-3 py-2 text-base text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.section}
                onChange={handleInputChange}
              >
                {/* {"asdfas" + allSections} */}

                {allSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Architecture Category *
              </label>
              <select
                id="type"
                name="type"
                className="block w-full px-3 py-2 text-base text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleInputChange}
              >
                {Object.values(allProjectTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-baseline space-x-2 flex-col gap-1 ">
              <label
                htmlFor="featured"
                className="block text-sm font-medium text-gray-700 "
              >
                Featured Project
              </label>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 "
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <UploadDropzone
              endpoint={"imageUploader"}
              onUploadBegin={() => {
                setIsSubmitting(true);
              }}
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                const files = res.map(({ url, key }) => {
                  return {
                    name: key,
                    url,
                  };
                });
                setFileNames((prev) => (prev ? [...prev, ...files] : files));
                console.log("Files: ", files);
                toast.success("Upload Completed");
                setIsSubmitting(false);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                toast.error(error.message);
              }}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => {
                router.push("/admin");
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting
                ? "Creating..."
                : projectId
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </motion.form>

        {filenames && filenames.length > 0 && (
          <motion.div className="flex-1 w-full space-y-2 bg-black/20 p-4 rounded-lg flex flex-col">
            <h2 className="text-3xl font-thin font-poppins">Uploaded Files </h2>
            <div className="space-y-2 flex-1">
              {filenames && filenames.length > 0 && (
                <div className="grid grid-cols-2 ">
                  {filenames?.map((filename) => (
                    <div key={filename.name} className="m-2 relative group">
                      <div
                        onClick={() => deleteFileWithFilename(filename)}
                        className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 bg-black text-white rounded-full p-1"
                      >
                        <Cross1Icon />
                      </div>
                      <Link
                        href={filename.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          loading="lazy"
                          alt="Forms"
                          height={100}
                          width={100}
                          src={filename.url}
                          className="m-2 h-auto w-[15em] hover:border-1 hover:shadow-lg rounded-lg shadow-md border border-black/20 "
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
