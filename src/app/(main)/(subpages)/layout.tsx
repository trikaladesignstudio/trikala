import Navbar from "@/components/custom/NavBar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-0 flex-1 flex-col snap-none">
      <div className="relative flex min-h-[70px] shrink-0 items-center justify-center bg-black">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
