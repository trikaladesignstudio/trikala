"use client";

import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiPowerOff } from "react-icons/bi";

export default function LogoutBtn() {
  const router = useRouter();

  return (
    <BiPowerOff
      onClick={() => {
        logout()
          .then(() => {
            toast.success("Logout done :(");
            router.push("/admin");
          })
          .catch(() => {
            toast.error("Logout Failed");
          });
      }}
      className="shadow-md border border-black/30  p-1 w-8 h-8 rounded-full bg-gray-400/30 hover:scale-110 cursor-pointer"
    />
  );
}
