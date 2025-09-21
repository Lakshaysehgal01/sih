import React from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="h-full w-screen min-h-screen bg-[#0a0a10] flex flex-col">
      <Navbar />
      <section className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-invert max-w-none">
            <div className="text-white/70 space-y-6">
              <p className="text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Information We Collect
                </h2>
                <p>
                  We collect information you provide directly to us, such as
                  when you create an account, upload documents for verification,
                  or contact us for support.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  How We Use Your Information
                </h2>
                <p>
                  We use the information we collect to provide, maintain, and
                  improve our document verification services, process
                  transactions, and communicate with you.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please
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

export default PrivacyPolicy;
