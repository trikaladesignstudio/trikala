// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { addAProject } from "@/utils/dbActions";
// import { Prisma } from "@prisma/client";

// export default function CreateProject() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<Prisma.ProjectCreateInput>({
//     title: "",
//     description: "",
//     featured: false,
//     images: [],
//     section: "none",
//     type: "none",
//   });
//   const [error, setError] = useState<string | null>(null);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const technologies = e.target.value.split(",").map((tech) => tech.trim());
//     setFormData((prev) => ({
//       ...prev,
//       technologies,
//     }));
//   };

//   const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const images = e.target.value.split(",").map((url) => url.trim());
//     setFormData((prev) => ({
//       ...prev,
//       images,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       await addAProject(formData);
//       router.push("/admin");
//     } catch (err) {
//       setError("Failed to create project. Please try again.");
//       console.error("Error creating project:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label
//             htmlFor="title"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Title *
//           </label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             required
//             value={formData.title}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="description"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Description *
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             required
//             value={formData.description}
//             onChange={handleInputChange}
//             rows={4}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Category *
//           </label>
//           <select
//             id="category"
//             name="category"
//             required
//             value={formData.category}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           >
//             <option value="">Select a category</option>
//             <option value="Web Development">Web Development</option>
//             <option value="Mobile App">Mobile App</option>
//             <option value="UI/UX Design">UI/UX Design</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="technologies"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Technologies (comma-separated)
//           </label>
//           <input
//             type="text"
//             id="technologies"
//             name="technologies"
//             value={formData.technologies.join(", ")}
//             onChange={handleTechnologiesChange}
//             placeholder="React, Node.js, MongoDB"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="images"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Image URLs (comma-separated)
//           </label>
//           <input
//             type="text"
//             id="images"
//             name="images"
//             value={formData.images.join(", ")}
//             onChange={handleImagesChange}
//             placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="githubLink"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             GitHub Link
//           </label>
//           <input
//             type="url"
//             id="githubLink"
//             name="githubLink"
//             value={formData.githubLink}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="liveLink"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Live Link
//           </label>
//           <input
//             type="url"
//             id="liveLink"
//             name="liveLink"
//             value={formData.liveLink}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="featured"
//             name="featured"
//             checked={formData.featured}
//             onChange={handleInputChange}
//             className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//           />
//           <label
//             htmlFor="featured"
//             className="ml-2 block text-sm text-gray-700"
//           >
//             Featured Project
//           </label>
//         </div>

//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
//           >
//             {isSubmitting ? "Creating..." : "Create Project"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
