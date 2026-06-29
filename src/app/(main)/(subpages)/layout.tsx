import Navbar from "@/components/custom/NavBar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-0 flex-1 flex-col snap-none">
      <div className="relative shrink-0 bg-black">
      <Navbar />
    </div>
      {children}
    </div>
  );
}
