import React from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/components/Footer";

const CookiePolicy: React.FC = () => {
  return (
    <div className="h-full w-screen min-h-screen bg-[#0a0a10] flex flex-col">
      <Navbar />
      <section className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8">
            Cookie Policy
          </h1>
          <div className="prose prose-invert max-w-none">
            <div className="text-white/70 space-y-6">
              <p className="text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  What Are Cookies
                </h2>
                <p>
                  Cookies are small text files that are placed on your computer
                  by websites that you visit. They are widely used to make
                  websites work more efficiently and provide information to site
                  owners.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  How We Use Cookies
                </h2>
                <p>
                  We use cookies to enhance your experience, remember your
                  preferences, and provide personalized content. We also use
                  them for analytics purposes to understand how you use our
                  site.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Types of Cookies We Use
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Essential cookies:</strong> Required for the website
                    to function properly
                  </li>
                  <li>
                    <strong>Analytics cookies:</strong> Help us understand how
                    visitors interact with our website
                  </li>
                  <li>
                    <strong>Functionality cookies:</strong> Remember your
                    preferences and settings
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Managing Cookies
                </h2>
                <p>
                  You can control and/or delete cookies as you wish. You can
                  delete all cookies that are already on your computer and set
                  most browsers to prevent them from being placed.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about our use of cookies, please
                  contact us at support@verify.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
