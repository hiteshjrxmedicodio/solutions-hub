"use client";

import { ReactNode } from "react";
import { CompanyOverviewSection } from "./CompanyOverviewSection";
import { ComplianceSection } from "./ComplianceSection";

interface VendorLayoutProps {
  children: ReactNode;
  companyName: string;
  companyType?: string;
  website?: string;
  foundedYear?: number;
  location?: {
    state: string;
    country: string;
  };
  companySize?: string;
  missionStatement?: string;
  headquarters?: string;
  complianceCertifications?: string[];
  certificationDocuments?: Array<{
    certification: string;
    documentUrl?: string;
    logoUrl?: string;
    issuedDate?: Date;
    expiryDate?: Date;
  }>;
}

export function VendorLayout({
  children,
  companyName,
  companyType,
  website,
  foundedYear,
  location,
  companySize,
  missionStatement,
  headquarters,
  complianceCertifications,
  certificationDocuments,
}: VendorLayoutProps) {
  return (
    <div className="w-full pt-24 pb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Company Overview - Increased by 30% */}
        <aside className="w-full lg:w-80 flex-shrink-0 pl-6">
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 sticky top-24">
            <CompanyOverviewSection 
              companyName={companyName}
              companyType={companyType}
              website={website}
              foundedYear={foundedYear}
              location={location}
              companySize={companySize}
              missionStatement={missionStatement}
              headquarters={headquarters}
            />
          </div>
        </aside>

        {/* Main Content Area - Tabs - Reduced by 30% */}
        <div className="flex-1 min-w-0 px-6" style={{ flex: '0 0 45%', maxWidth: '45%' }}>
          {children}
        </div>

        {/* Right Sidebar - Compliance & Certifications */}
        <aside className="w-full lg:w-64 flex-shrink-0 pr-6">
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 sticky top-24">
            {(complianceCertifications || certificationDocuments) ? (
              <ComplianceSection 
                complianceCertifications={complianceCertifications}
                certificationDocuments={certificationDocuments}
              />
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Compliance & Certifications</h2>
                <p className="text-sm text-zinc-600">No certifications available.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

