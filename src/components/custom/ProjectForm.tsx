"use client";

import { cn } from "@/lib/utils";
import {
  allProjectTypes,
  allSections,
  ProjectType,
  sectionType,
} from "@/utils/client_utils";
import {
  addAProject,
  deleteFile,
  getProject,
  updateProject,
} from "@/utils/dbActions";
import { images } from "@/utils/types";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { Prisma } from "@prisma/client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const RenderPdf = dynamic(() => import("./RenderPdf"), {
  ssr: false,
});

const inputClassName =
  "w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2.5 text-sm text-admin-ink outline-none transition-shadow focus:ring-2 focus:ring-admin-accent/20";

const labelClassName = "mb-1.5 block text-sm font-medium text-admin-ink";

const uploadConfig = { mode: "auto" as const };

function getImages(formData: Prisma.ProjectCreateInput): images[] {
  return Array.isArray(formData.images) ? (formData.images as images[]) : [];
}

export default function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetSection = searchParams.get("section") as sectionType | null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [, setIsSubmited] = useState(false);
  const [pdfFile, setPdfFile] = useState<{ name: string; url: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [formData, setFormData] = useState<Prisma.ProjectCreateInput>({
    title: "",
    description: "",
    section:
      presetSection && Object.values(sectionType).includes(presetSection)
        ? presetSection
        : sectionType.none,
    type: ProjectType.none,
    featured: false,
    images: [],
    pdf: null,
  });

  const uploadedImages = getImages(formData);

  const getProjectInfo = async () => {
    if (projectId) {
      setIsLoading(true);
      getProject(projectId).then((project) => {
        if (project === null) {
          toast.error("Project not found");
          setTimeout(() => {
            router.push("/admin/all");
          }, 1500);
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
          setPdfFile(project.pdf);
        }
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (projectId) getProjectInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const removeImage = (file: images) => {
    const prev = getImages(formData);
    const next = prev.filter((f) => f.name !== file.name);
    setFormData((p) => ({ ...p, images: next }));

    deleteFile(file.name).catch(() => {
      setFormData((p) => ({ ...p, images: prev }));
      toast.error("Could not remove image. Try again.");
    });
  };

  const removePdf = () => {
    if (!pdfFile) return;
    const prevPdf = pdfFile;
    setPdfFile(null);
    setFormData((p) => ({ ...p, pdf: null }));

    deleteFile(prevPdf.name).catch(() => {
      setPdfFile(prevPdf);
      setFormData((p) => ({ ...p, pdf: prevPdf }));
      toast.error("Could not remove PDF. Try again.");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSubmited(true);

    try {
      if (projectId) {
        await updateProject(projectId, formData);
        toast.success("Project updated");
      } else {
        await addAProject(formData);
        toast.success("Project created");
      }
      router.push("/admin/all");
      router.refresh();
    } catch (err) {
      setError("Failed to save project. Please try again.");
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

  const handlePdfUploadComplete = (res: { url: string; name: string }[]) => {
    const neededData = res.map(({ url, name }) => ({ url, name }))[0];
    setPdfFile(neededData);
    setFormData((prev) => ({ ...prev, pdf: neededData }));
    setIsUploading(false);
  };

  const handleImageUploadComplete = (
    res: { url: string; key: string }[]
  ) => {
    const files = res.map(({ url, key }) => ({ name: key, url }));
    setFormData((prev) => ({
      ...prev,
      images: [...getImages(prev), ...files],
    }));
    toast.success("Upload completed");
    setIsUploading(false);
  };

  const handleUploadError = (uploadError: Error) => {
    toast.error(uploadError.message);
    setIsUploading(false);
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-6">
          <div className="h-4 w-32 animate-pulse rounded bg-admin-canvas" />
          <div className="h-10 animate-pulse rounded-lg bg-admin-canvas" />
          <div className="h-10 animate-pulse rounded-lg bg-admin-canvas" />
          <div className="h-24 animate-pulse rounded-lg bg-admin-canvas" />
        </div>
      ) : (
        <motion.div className={cn("flex h-fit flex-col gap-6 lg:flex-row")}>
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-2xl border border-admin-border bg-admin-surface shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]"
          >
            <div className="border-b border-admin-border px-5 py-4 md:px-6">
              <p className="font-geist-mono text-xs uppercase tracking-[0.16em] text-admin-muted">
                Project details
              </p>
              <h2 className="mt-1 text-lg font-semibold text-admin-ink">
                {projectId ? "Update project" : "Create project"}
              </h2>
            </div>

            <div className="space-y-5 px-5 py-5 md:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="section" className={labelClassName}>
                    Section
                  </label>
                  <select
                    id="section"
                    name="section"
                    className={inputClassName}
                    value={formData.section}
                    onChange={handleInputChange}
                  >
                    {allSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className={labelClassName}>
                    Category
                  </label>
                  <select
                    id="type"
                    name="type"
                    className={inputClassName}
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

                <div className="flex flex-col justify-end gap-2">
                  <label htmlFor="featured" className={labelClassName}>
                    Featured
                  </label>
                  <label className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-admin-border px-3 py-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-slate-300 text-admin-accent focus:ring-admin-accent"
                    />
                    <span className="text-sm text-admin-muted">
                      Show in featured grid
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t border-admin-border pt-5">
                <label htmlFor="title" className={labelClassName}>
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>

              <div className="border-t border-admin-border pt-5">
                <label htmlFor="description" className={labelClassName}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={cn(inputClassName, "resize-y")}
                />
              </div>

              <div className="border-t border-admin-border pt-5">
                <label htmlFor="pdf" className={labelClassName}>
                  Project PDF
                </label>
                {!pdfFile && (
                  <UploadButton
                    endpoint="uploadPDF"
                    config={uploadConfig}
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={handlePdfUploadComplete}
                    onUploadError={handleUploadError}
                  />
                )}
                {pdfFile && (
                  <div className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-admin-border px-3">
                    <span className="truncate text-sm text-admin-muted">
                      {pdfFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="shrink-0 rounded-md bg-admin-ink px-3 py-2 text-xs text-white hover:bg-admin-ink/90"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-admin-border pt-5">
                <label htmlFor="images" className={labelClassName}>
                  Images
                </label>
                <UploadDropzone
                  endpoint="imageUploader"
                  config={uploadConfig}
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={handleImageUploadComplete}
                  onUploadError={handleUploadError}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-admin-border px-5 py-4 md:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/all")}
                className="border-admin-border text-admin-muted hover:bg-admin-canvas"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="bg-admin-accent text-white hover:bg-admin-accent/90 active:scale-[0.98]"
              >
                {isUploading
                  ? "Uploading..."
                  : isSubmitting
                    ? "Saving..."
                    : projectId
                      ? "Update project"
                      : "Create project"}
              </Button>
            </div>
          </motion.form>

          {uploadedImages.length > 0 && (
            <motion.div className="flex h-full w-full flex-1 flex-col space-y-2 rounded-2xl border border-admin-border bg-admin-surface lg:max-w-md">
              <div className="border-b border-admin-border px-5 py-4">
                <p className="font-geist-mono text-xs uppercase tracking-[0.16em] text-admin-muted">
                  Uploaded images
                </p>
                <p className="mt-1 text-lg font-semibold text-admin-ink">
                  {uploadedImages.length} files
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-5">
                <AnimatePresence initial={false}>
                  {uploadedImages.map((filename) => (
                    <motion.div
                      key={filename.name}
                      className="relative"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <button
                        type="button"
                        onClick={() => removeImage(filename)}
                        aria-label={`Remove ${filename.name}`}
                        className="absolute right-1.5 top-1.5 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-admin-ink text-white shadow-sm hover:bg-admin-ink/90 active:scale-95"
                      >
                        <Cross1Icon className="h-4 w-4" />
                      </button>
                      <a
                        href={filename.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-lg border border-admin-border"
                      >
                        <Image
                          loading="lazy"
                          alt="Uploaded project image"
                          height={120}
                          width={120}
                          src={filename.url}
                          className="aspect-square w-full object-cover"
                        />
                      </a>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {pdfFile && (
            <motion.div className="flex h-full w-full flex-1 flex-col rounded-2xl border border-admin-border bg-admin-surface lg:max-w-xl">
              <div className="border-b border-admin-border px-5 py-4">
                <p className="font-geist-mono text-xs uppercase tracking-[0.16em] text-admin-muted">
                  PDF preview
                </p>
              </div>
              <div className="flex-1 p-4">
                <RenderPdf url={pdfFile.url} />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}
