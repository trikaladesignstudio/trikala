import logo from "../../assets/logo.png";
import { FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Heading from "./Heading";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="bg-zinc-950 text-zinc-100 px-[5vw] py-10 snap-end snap-always shrink-0">
      <div className=" mx-auto space-y-16">
        <div className="flex lg:flex-row flex-col justify-between gap-20">
          {/* Main CTA Section */}
          <div className="space-y-4  ">
            <Heading
              className="text-3xl"
              text={`Shall we discuss\n the project ?`}
            />

            <p className="text-zinc-400">
              Leave a request using the button below and a manager will contact
              you shortly to discuss the details
            </p>
            <Button
              variant="outline"
              className="mt-4 border-zinc-700 text-zinc-100 hover:bg-zinc-900 hover:text-zinc-50"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                router.push("#lead");
              }}
            >
              Leave a request
              <span className="ml-2">+</span>
            </Button>
          </div>

          {/* Contact Grid */}
          <div className=" flex lg:flex-row flex-col-reverse justify-center items-center lg:text-left text-center lg:gap-32 gap-5">
            <div className="flex-col flex space-y-8">
              {/* Address */}
              <div className="">
                <h3 className="text-zinc-500 text-sm tracking-wider">
                  ADDRESS
                </h3>
                <p className="text-zinc-100">
                  r. St. Petersburg, Bolshaya Zelenina Street, 24
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-4">
                <h3 className="text-zinc-500 text-sm tracking-wider">PHONE</h3>
                <Link
                  href="tel:+78124084151"
                  className="text-zinc-100 hover:text-zinc-300 transition-colors"
                >
                  +7 (812) 408-4151
                </Link>
              </div>

              {/* Social Media */}
              <div className="space-y-4 flex flex-col ">
                <h3 className="text-zinc-500 text-sm tracking-wider">
                  SOCIAL MEDIA
                </h3>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    <FaLinkedinIn />
                  </Link>
                  <Link
                    href="#"
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    <ImInstagram />
                  </Link>
                  <Link
                    href="#"
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    <FaFacebookF />
                  </Link>
                  <Link
                    href="#"
                    className="text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    <FaTwitter />
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Emails */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-zinc-500 text-sm tracking-wider">MAIL</h3>
                <Link
                  href="mailto:info@taiga-arch.com"
                  className="text-zinc-100 hover:text-zinc-300 transition-colors"
                >
                  info@trikalarchitect.com
                </Link>
              </div>
              <div className="space-y-4">
                <h3 className="text-zinc-500 text-sm tracking-wider">
                  DISCUSS THE PROJECT
                </h3>
                <Link
                  href="mailto:deal@taiga-arch.com"
                  className="text-zinc-100 hover:text-zinc-300 transition-colors"
                >
                  info@trikalarchitect.com
                </Link>
              </div>
              <div className="space-y-4">
                <h3 className="text-zinc-500 text-sm tracking-wider">
                  SUPPLIERS
                </h3>
                <Link
                  href="mailto:job@taiga-arch.com"
                  className="text-zinc-100 hover:text-zinc-300 transition-colors"
                >
                  info@trikalarchitect.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between lg:items-start md:items-center gap-4">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-light tracking-tight"
          >
            <Image src={logo} alt="logo" width={300} height={300} />
          </Link>
          <div className="flex gap-8 text-sm lg:flex-row flex-col lg:items-end items-center lg:justify-end justify-center">
            <Link
              href="/sitemap"
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Site Map
            </Link>
            <Link
              href="/agreement"
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              User Agreement
            </Link>
            <p className="text-zinc-600">
              {new Date().getFullYear()} &copy; Trikala Architecture Group
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
