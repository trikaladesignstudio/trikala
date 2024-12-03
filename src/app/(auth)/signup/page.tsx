// import { useState } from "react";
// import { useRouter } from "next/router";
// import { signIn } from "next-auth/react";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await signIn("credentials", {
//       redirect: false,
//       email,
//       password,
//     });
//     if (res.ok) {
//       router.push("/");
//     } else {
//       toast.error(res.error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <Input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="you@example.com"
//             className="mt-1 block w-full"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Password
//           </label>
//           <Input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="********"
//             className="mt-1 block w-full"
//           />
//         </div>
//         <Button type="submit" className="w-full">
//           Log in
//         </Button>
//       </form>
//     </div>
//   );
// }
