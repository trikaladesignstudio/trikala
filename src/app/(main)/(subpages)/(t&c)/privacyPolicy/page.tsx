import Section from "@/components/custom/Section";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <Section
      toSnap={false}
      className="min-h-0 w-full max-w-4xl justify-start gap-6 bg-[#f5f5f5] pb-16 lg:mx-auto"
    >
      <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
      <>
        Trikala Architects and Associates, We operates as an architectural firm
        providing professional services to clients. This Privacy Policy outlines
        our policies regarding the collection, use, and disclosure of personal
        information for visitors and clients who engage with our services.
      </>
      <>
        If you choose to engage with our services, you agree to the collection
        and use of information in accordance with this policy. The personal
        information we collect is used to provide and improve our services. We
        will not use or share your information with anyone except as described
        in this Privacy Policy.
      </>
      <>
        The terms used in this Privacy Policy have the same meanings as in our
        Terms and Conditions unless otherwise defined here.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">
          Information Collection and Use
        </h1>
      </>
      <>
        For a better experience while using our services, we may require you to
        provide certain personally identifiable information, including but not
        limited to:
      </>
      <ul className="list-disc pl-4">
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Project Details (such as location and requirements)</li>
      </ul>
      <>
        This information is collected to facilitate communication, improve
        service delivery, and fulfill contractual obligations.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">
          Third-Party Services
        </h1>
      </>
      <>
        We may use third-party services to support our operations, such as
        project management tools, payment gateways, or cloud storage services.
        These third parties may have access to your personal information but are
        bound by confidentiality and data protection agreements to ensure its
        security.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">Log Data</h1>
      </>
      <>
        When you visit our website or contact us, we may collect data regarding
        your interaction with our services. This data may include your device’s
        Internet Protocol (IP) address, browser type, operating system, pages
        visited, time and date of visit, and other analytical information. This
        is used for internal analysis to improve our services.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">Cookies</h1>
      </>
      <>
        Cookies are small files stored on your device that allow us to analyze
        website usage and enhance user experience. You have the option to manage
        cookie preferences in your browser settings.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">Security</h1>
      </>
      <>
        We value your trust in providing personal information and strive to use
        commercially acceptable means to protect it. However, no method of
        electronic transmission or storage is 100% secure, and we cannot
        guarantee absolute security.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">
          Links to External Sites
        </h1>
      </>
      <>
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices or content of these external
        sites. We encourage you to review their privacy policies independently.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">
          Children’s Privacy
        </h1>
      </>
      <>
        Our services are not directed toward individuals under the age of 13. We
        do not knowingly collect personal information from children. If we
        discover that we have inadvertently collected data from a child under
        13, we will delete it promptly.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">
          Changes to This Privacy Policy
        </h1>
      </>
      <>
        We may update this Privacy Policy periodically. Any changes will be
        posted on this page, and you are advised to review it regularly. This
        policy is effective as of December 24, 2024.
      </>

      <>
        <h1 className="text-3xl font-extrabold my-4 pt-4">Contact Us</h1>
      </>
      <>
        If you have any questions or concerns about our Privacy Policy, please
        contact us at:
      </>
      <>Trikala Architects and Associates</>
      <>
        Email:{" "}
        <Link
          href="mailto:trikalaarchitects@gmail.com"
          className="underline text-blue-300 hover:text-blue-700"
        >
          trikalaarchitects@gmail.com
        </Link>
      </>
    </Section>
  );
}
