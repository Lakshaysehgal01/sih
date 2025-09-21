import React from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/components/Footer";

const TermsOfService: React.FC = () => {
  return (
    <div className="h-full w-screen min-h-screen bg-[#0a0a10] flex flex-col">
      <Navbar />
      <section className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8">
            Terms of Service
          </h1>
          <div className="prose prose-invert max-w-none">
            <div className="text-white/70 space-y-6">
              <p className="text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing and using VeriFy's document verification
                  services, you accept and agree to be bound by the terms and
                  provision of this agreement.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Use License
                </h2>
                <p>
                  Permission is granted to temporarily use VeriFy's services for
                  personal, non-commercial transitory viewing only. This is the
                  grant of a license, not a transfer of title.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  User Responsibilities
                </h2>
                <p>
                  Users are responsible for maintaining the confidentiality of
                  their account information and for all activities that occur
                  under their account.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Limitation of Liability
                </h2>
                <p>
                  VeriFy shall not be liable for any damages arising from the
                  use or inability to use our services, even if we have been
                  notified of the possibility of such damages.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Contact Information
                </h2>
                <p>
                  Questions about the Terms of Service should be sent to us at
                  support@verify.com
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

export default TermsOfService;
