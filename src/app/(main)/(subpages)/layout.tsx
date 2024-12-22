import Navbar from "@/components/custom/NavBar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-[70px] relative bg-black flex justify-center items-center">
        <Navbar />
      </div>
      {children}
    </>
  );
}
