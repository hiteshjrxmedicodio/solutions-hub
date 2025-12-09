"use client";

import { HamburgerMenu } from "@/components/HamburgerMenu";

export default function AboutPage() {

  return (
    <main className="min-h-screen bg-white overflow-y-auto" style={{ height: "100vh", overflowY: "auto" }}>
      {/* Navigation Bar - Always Open, Not Closable */}
      <HamburgerMenu 
        isOpen={true} 
        onToggle={() => {}}
        onClose={() => {}}
        isClosable={false}
        showShadow={false}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-16 pt-28">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light text-zinc-900">About</h1>
            <div className="h-px bg-zinc-200"></div>
          </div>

          {/* Content */}
          <div className="space-y-8 text-zinc-700 leading-relaxed">
            <p className="text-lg">
              Welcome to our Solutions Hub, a comprehensive platform designed to connect healthcare
              professionals with innovative solutions that transform patient care and streamline
              clinical workflows.
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-zinc-900">Our Mission</h2>
              <p>
                We are dedicated to empowering healthcare organizations by providing access to
                cutting-edge solutions that enhance patient outcomes, improve operational efficiency,
                and drive innovation in healthcare delivery.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-zinc-900">What We Offer</h2>
              <p>
                Our platform features a diverse range of healthcare solutions, from clinical
                decision support systems to telemedicine platforms, revenue cycle management tools,
                and population health analytics. Each solution is carefully curated to meet the
                evolving needs of modern healthcare providers.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-zinc-900">Our Commitment</h2>
              <p>
                We are committed to maintaining the highest standards of quality, security, and
                compliance. All solutions featured on our platform adhere to industry best
                practices and regulatory requirements, ensuring that healthcare organizations can
                implement them with confidence.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="pt-8 border-t border-zinc-200">
            <p className="text-zinc-600">
              For inquiries or more information, please contact us at{" "}
              <a href="mailto:ihyaet@gmail.com" className="text-zinc-900 hover:underline">
                ihyaet@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

