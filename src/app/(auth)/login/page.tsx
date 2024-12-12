"use client";
import { useState } from "react";
// import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Link from "next/link";
import Section from "@/components/custom/Section";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // formdata
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const success = await login(formData);
    // console.log("success:", success);
    toast.success("Login Successful " + success);
    if (success) {
      router.push("/admin");
    } else {
      toast.error("Login Failed, username or password incorrect");
    }
  };

  return (
    <Section className="flex items-center justify-center gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border border-black rounded-md p-6 gap-4 min-w-[20%]"
      >
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 block w-full"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="block w-full"
          />
        </div>
        <Button
          type="submit"
          className="w-full border border-black/50 hover:bg-black hover:text-white"
        >
          Log in
        </Button>
      </form>
      <Link
        href="/"
        className="px-2 py-1 rounded-md hover:bg-black hover:text-white "
      >
        Go back home &rarr;
      </Link>
    </Section>
  );
}
