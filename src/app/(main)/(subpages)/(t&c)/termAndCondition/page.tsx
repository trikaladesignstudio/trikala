import Section from "@/components/custom/Section";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions",
  description: "Terms and Conditions for Trikal Architects and Associates.",
  path: "/termAndCondition",
  noIndex: true,
});

export default function TandC() {
  return (
    <Section
      toSnap={false}
      className="min-h-0 w-full max-w-4xl justify-start gap-6 bg-[#f5f5f5] pb-16 lg:mx-auto"
    >
      <h1 className="text-3xl font-extrabold">Terms &amp; Conditions</h1>
      <div className="">
        Welcome to Trikala Architects and Associates. By
        accessing or using our services, including but not limited to
        consultations, design processes, or interactions through our website or
        app, you agree to comply with these Terms and Conditions. Please read
        them carefully before proceeding.
      </div>
      <h2 className="text-2xl font-bold my-4">
        Usage and Intellectual Property
      </h2>
      <div className="">
        You are not permitted to copy, modify, distribute, or reproduce any part
        of our services, materials, or trademarks without explicit written
        permission. You must not attempt to extract, reverse-engineer, or
        repurpose the source code of any software, tools, or applications
        provided by us. All intellectual property rights, including trademarks,
        copyrights, and database rights, remain the sole property of Trikala
        Architects and Associates.
      </div>
      <h2 className="text-2xl font-bold my-4">Changes to Services</h2>
      <div className="">
        We reserve the right to update, modify, or discontinue any part of our
        services at any time without prior notice. Any changes will be made to
        enhance efficiency and meet operational needs. We will not impose
        additional charges for services without clearly notifying you of the
        cost and obtaining your consent.
      </div>
      <h2 className="text-2xl font-bold my-4">Data and Privacy</h2>
      <div className="">
        To deliver our services effectively, we may collect and process your
        personal data. Your responsibility is to ensure that the information you
        provide is accurate and up-to-date. Please review our Privacy Policy for
        details on how we manage your personal data.
      </div>
      <h2 className="text-2xl font-bold my-4">User Responsibility</h2>
      <div className="">
        You are responsible for maintaining the security of your device and
        ensuring it is free from viruses or malware. We are not liable for any
        issues arising from compromised device security, including rooted or
        jailbroken devices. Additionally, you must ensure your device has an
        active internet connection if required for our services. We are not
        liable for service interruptions due to lack of connectivity or device
        issues (e.g., low battery).
      </div>
      <h2 className="text-2xl font-bold my-4">Third-Party Services</h2>
      <div className="">
        Our services may include links to or integrations with third-party
        providers. Each third-party service operates independently and has its
        own terms and conditions. We are not responsible for their actions,
        content, or policies.
      </div>
      <h2 className="text-2xl font-bold my-4">Liability Disclaimer</h2>
      <div className="">
        While we strive to deliver high-quality services, Trikala Architects and
        Associates cannot guarantee uninterrupted, error-free performance of all
        features. We are not liable for direct or indirect losses incurred due
        to reliance on our services, external factors, or third-party
        dependencies.
      </div>
      <h2 className="text-2xl font-bold my-4">Termination</h2>
      <div className="">
        We reserve the right to terminate your access to our services at any
        time without prior notice. Upon termination:
        <ul className="list-disc pl-4 py-2">
          <li>Your rights and licenses under these terms will end.</li>
          <li>
            You must cease using our services and delete any associated software
            or tools.
          </li>
        </ul>
      </div>
      <h2 className="text-2xl font-bold my-4">
        Updates to Terms and Conditions
      </h2>
      <div className="">
        We may update these Terms and Conditions periodically. Changes will be
        posted on our website, and you are encouraged to review them regularly.
        Continued use of our services after changes are published constitutes
        acceptance of the updated terms.
      </div>
      <div className="">
        These Terms and Conditions are effective as of December 24, 2024.
      </div>
      <h2 className="text-2xl font-bold my-4">Contact Us</h2>
      <div className="">
        If you have any questions, concerns, or suggestions regarding these
        Terms and Conditions, please contact us at{" "}
        <Link
          href="mailto:trikalaarchitects@gmail.com"
          className="underline text-blue-300 hover:text-blue-700"
        >
          trikalaarchitects@gmail.com
        </Link>
        .
      </div>
    </Section>
  );
}
