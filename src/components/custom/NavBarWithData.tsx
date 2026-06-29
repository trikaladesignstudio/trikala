import Navbar from "@/components/custom/NavBar";
import { resolveStartAProjectLink } from "@/lib/contactData";
import { getContactProjects } from "@/utils/dbActions";

export default async function NavBarWithData() {
  const contactProjects = await getContactProjects();
  const startAProjectLink = resolveStartAProjectLink(contactProjects);

  return <Navbar startAProjectLink={startAProjectLink} />;
}
