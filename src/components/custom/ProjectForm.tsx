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
import { images } from "@/types";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { Prisma } from "@prisma/client";
import { Cross1Icon, ImageIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const RenderPdf = dynamic(() => import("./RenderPdf"), {
  ssr: false,
});

const inputClassName =
  "w-full rounded-lg border border-admin-border bg-admin-canvas px-3 py-2.5 text-sm text-admin-ink outline-none transition-[border-color,box-shadow] focus:border-admin-accent/40 focus:ring-2 focus:ring-admin-accent/20";

const labelClassName = "mb-1.5 block text-sm font-medium text-admin-ink";

const uploadConfig = { mode: "auto" as const };

const uploadButtonAppearance = {
  button:
    "ut-ready:bg-admin-accent ut-ready:hover:bg-admin-accent/90 ut-uploading:bg-admin-accent/70 ut-uploading:cursor-wait rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors active:scale-[0.98]",
  allowedContent: "text-admin-muted text-xs",
  container: "w-fit",
};

const uploadDropzoneAppearance = {
  container:
    "border-admin-border bg-admin-canvas ut-uploading:border-admin-accent/40 rounded-xl border border-dashed px-4 py-6",
  uploadIcon: "text-admin-muted",
  label: "text-sm font-medium text-admin-ink",
  allowedContent: "text-admin-muted text-xs",
  button:
    "ut-ready:bg-admin-accent ut-ready:hover:bg-admin-accent/90 ut-uploading:bg-admin-accent/70 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
};

function getImages(formData: Prisma.ProjectCreateInput): images[] {
  return Array.isArray(formData.images) ? (formData.images as images[]) : [];
}

function UploadedImageTile({
  file,
  onRemove,
}: {
  file: images;
  onRemove: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="absolute right-1.5 top-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-admin-accent text-white shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-2 ring-admin-surface transition-transform hover:bg-admin-accent/90 active:scale-95"
      >
        <Cross1Icon className="h-3.5 w-3.5" />
      </button>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg border border-admin-border bg-admin-canvas"
      >
        <div className="relative aspect-square w-full">
          {!failed ? (
            <>
              {!loaded && (
                <div
                  className="absolute inset-0 animate-pulse bg-admin-border"
                  aria-hidden
                />
              )}
              {/* Load directly from UploadThing; Next image optimizer 500s on some utfs.io files */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.url}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-200",
                  loaded ? "opacity-100" : "opacity-0"
                )}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 p-3 text-center">
              <ImageIcon className="h-6 w-6 text-admin-muted" aria-hidden />
              <span className="text-[11px] leading-tight text-admin-muted">
                Preview unavailable
              </span>
              <span className="text-[11px] font-medium text-admin-accent">
                Open original
              </span>
            </div>
          )}
        </div>
      </a>
    </motion.div>
  );
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
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="w-full max-w-4xl space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-6">
          <div className="h-4 w-32 animate-pulse rounded bg-admin-canvas" />
          <div className="h-10 animate-pulse rounded-lg bg-admin-canvas" />
          <div className="h-10 animate-pulse rounded-lg bg-admin-canvas" />
          <div className="h-24 animate-pulse rounded-lg bg-admin-canvas" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 flex-col rounded-2xl border border-admin-border bg-admin-surface shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]"
          >
            <div className="border-b border-admin-border px-5 py-4 md:px-6">
              <h2 className="text-lg font-semibold text-admin-ink">
                {projectId ? "Update project" : "Create project"}
              </h2>
              <p className="mt-1 text-sm text-admin-muted">
                Edit metadata, uploads, and featured visibility.
              </p>
            </div>

            <div className="space-y-6 px-5 py-5 md:px-6">
              <fieldset className="space-y-4">
                <legend className="sr-only">Classification</legend>
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

                  <div>
                    <span className={labelClassName}>Featured</span>
                    <label
                      htmlFor="featured"
                      className={cn(
                        inputClassName,
                        "flex h-[42px] cursor-pointer items-center gap-2.5 !py-0"
                      )}
                    >
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 shrink-0 rounded border-admin-border text-admin-accent focus:ring-admin-accent"
                      />
                      <span className="truncate text-sm text-admin-muted">
                        Show in featured grid
                      </span>
                    </label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="sr-only">Content</legend>
                <div>
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

                <div>
                  <label htmlFor="description" className={labelClassName}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={cn(inputClassName, "min-h-[112px] resize-y")}
                  />
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="sr-only">Media</legend>
                <div>
                  <label htmlFor="pdf" className={labelClassName}>
                    Project PDF
                  </label>
                  {!pdfFile ? (
                    <UploadButton
                      endpoint="uploadPDF"
                      config={uploadConfig}
                      appearance={uploadButtonAppearance}
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={handlePdfUploadComplete}
                      onUploadError={handleUploadError}
                    />
                  ) : (
                    <div className="flex min-h-[42px] items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-canvas px-3">
                      <span className="truncate text-sm text-admin-ink">
                        {pdfFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={removePdf}
                        className="shrink-0 rounded-md border border-admin-border px-3 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:bg-admin-surface hover:text-admin-ink"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="images" className={labelClassName}>
                    Images
                  </label>
                  <UploadDropzone
                    endpoint="imageUploader"
                    config={uploadConfig}
                    appearance={uploadDropzoneAppearance}
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={handleImageUploadComplete}
                    onUploadError={handleUploadError}
                  />
                  <p className="mt-1.5 text-xs text-admin-muted">
                    Up to 10 images, 5MB each.
                  </p>
                </div>
              </fieldset>
            </div>

            <div className="sticky bottom-0 mt-auto flex flex-wrap justify-end gap-3 border-t border-admin-border bg-admin-surface/95 px-5 py-4 backdrop-blur-sm md:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/all")}
                className="min-h-[44px] border-admin-border text-admin-muted hover:bg-admin-canvas"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="min-h-[44px] bg-admin-accent text-white hover:bg-admin-accent/90 active:scale-[0.98]"
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
          </form>

          {(uploadedImages.length > 0 || pdfFile) && (
            <aside className="flex min-w-0 flex-col gap-6">
              {uploadedImages.length > 0 && (
                <section className="rounded-2xl border border-admin-border bg-admin-surface">
                  <div className="border-b border-admin-border px-5 py-4">
                    <h3 className="text-base font-semibold text-admin-ink">
                      Uploaded images
                    </h3>
                    <p className="mt-0.5 text-sm text-admin-muted">
                      {uploadedImages.length}{" "}
                      {uploadedImages.length === 1 ? "file" : "files"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-5">
                    <AnimatePresence initial={false}>
                      {uploadedImages.map((filename) => (
                        <UploadedImageTile
                          key={filename.name}
                          file={filename}
                          onRemove={() => removeImage(filename)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {pdfFile && (
                <section className="rounded-2xl border border-admin-border bg-admin-surface">
                  <div className="border-b border-admin-border px-5 py-4">
                    <h3 className="text-base font-semibold text-admin-ink">
                      PDF preview
                    </h3>
                  </div>
                  <div className="overflow-hidden p-4">
                    <RenderPdf url={pdfFile.url} />
                  </div>
                </section>
              )}
            </aside>
          )}
        </div>
      )}
    </>
  );
}
