"use client";

import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutBtn({
  fullWidth = false,
  prominent = false,
}: {
  fullWidth?: boolean;
  prominent?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        logout()
          .then(() => {
            toast.success("Logged out");
            router.push("/login");
          })
          .catch(() => {
            toast.error("Logout failed");
          });
      }}
      className={`inline-flex min-h-[44px] items-center rounded-lg border border-admin-border font-medium text-admin-muted transition-colors hover:bg-admin-canvas hover:text-admin-ink ${
        fullWidth ? "w-full justify-center" : ""
      } ${prominent ? "px-4 py-3.5 text-base" : "px-3 py-2 text-sm"}`}
    >
      Logout
    </button>
  );
}
