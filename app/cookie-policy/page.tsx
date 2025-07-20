"use client"

import { useRouter } from "next/navigation"
import SlidingButton from "@/components/sliding-button"
import StickyBanner from "@/components/sticky-banner"

export default function CookiePolicyPage() {
  const router = useRouter()

  const handleHomeClick = () => {
    router.push("/")
  }

  return (
    <div className="bg-[#f5f4f1] min-h-screen pt-28 pb-20">
      <StickyBanner alwaysVisible={true} />

      <div className="container mx-auto px-6 md:px-8 max-w-4xl">
        <h1 className="font-mulish text-2xl md:text-3xl font-light tracking-widest uppercase text-[#5a5a56] text-center mb-12">
          Cookie Policy
        </h1>

        <div className="bg-white p-8 md:p-12 shadow-sm">
          <div className="prose prose-stone max-w-none font-mulish font-light text-[#5a5a56]/90 leading-relaxed">
            <p className="text-lg mb-8">
              This Cookie Policy explains how ETERNO ("we", "us", or "our") uses cookies and similar technologies on our
              website. We encourage you to read this policy to understand our approach to the use of cookies.
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              What Are Cookies
            </h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used
              to make websites work more efficiently, provide a better browsing experience, and give website owners
              information about how visitors interact with their site.
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              How We Use Cookies
            </h2>
            <p>
              At ETERNO, we use cookies to enhance your experience on our website, analyse how our site is used, and
              assist in our marketing efforts. Our commitment to craftsmanship and quality extends to how we handle your
              data—with precision and respect.
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              Types of Cookies We Use
            </h2>

            <h3 className="font-mulish text-lg font-light tracking-wide text-[#5a5a56] mt-6 mb-2">Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function properly. They enable basic functions like page
              navigation and access to secure areas of the website. The website cannot function properly without these
              cookies.
            </p>

            <h3 className="font-mulish text-lg font-light tracking-wide text-[#5a5a56] mt-6 mb-2">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting
              information anonymously. We use this data to improve our website and your browsing experience. We may use
              Google Analytics to help us understand how our website is being used.
            </p>

            <h3 className="font-mulish text-lg font-light tracking-wide text-[#5a5a56] mt-6 mb-2">Marketing Cookies</h3>
            <p>
              These cookies are used to track visitors across websites. The intention is to display ads that are
              relevant and engaging for the individual user. We may use HubSpot and other marketing tools to better
              understand our audience and provide a tailored experience.
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              Third-Party Cookies
            </h2>
            <p>
              Some cookies are placed by third parties on our behalf. These third parties may include analytics
              providers (like Google) and marketing platforms (like HubSpot). These third parties may use cookies, web
              beacons, and similar technologies to collect or receive information from our website and elsewhere on the
              internet and use that information to provide measurement services and target ads.
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              Managing Your Cookie Preferences
            </h2>
            <p>
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies,
              or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, and
              from version to version.
            </p>
            <p className="mt-4">
              You can obtain up-to-date information about blocking and deleting cookies via these links:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eterno-accent hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eterno-accent hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eterno-accent hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eterno-accent hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p className="mt-4">
              Please note that restricting cookies may impact the functionality of our website. For more information
              about cookies, visit{" "}
              <a
                href="https://www.allaboutcookies.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eterno-accent hover:underline"
              >
                allaboutcookies.org
              </a>
              .
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              Changes to This Cookie Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
              business practices. Any changes will be posted on this page, and if the changes are significant, we will
              provide a more prominent notice.
            </p>

            <h2 className="font-mulish text-xl font-light tracking-wider uppercase text-[#5a5a56] mt-10 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about our use of cookies, please contact us at{" "}
              <a href="mailto:enquiries@eternotailoring.com" className="text-eterno-accent hover:underline">
                enquiries@eternotailoring.com
              </a>
              .
            </p>

            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-[#5a5a56]/70">
                Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <SlidingButton onClick={handleHomeClick} variant="dark" duration={1000} className="min-w-[200px] py-3">
            RETURN TO HOME
          </SlidingButton>
        </div>
      </div>
    </div>
  )
}
