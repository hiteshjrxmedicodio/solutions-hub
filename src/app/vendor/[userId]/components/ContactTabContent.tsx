"use client";

import { CompanyOverviewSection } from "./CompanyOverviewSection";
import { TeamLeadershipSection } from "./TeamLeadershipSection";

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  expertise?: string[];
  linkedinUrl?: string;
}

interface ContactTabContentProps {
  // Company Overview
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
  
  // Contact Info
  primaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  secondaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  
  // Demo/Trial Links
  demoLink?: string;
  trialLink?: string;
  
  // Team & Leadership
  teamMembers?: TeamMember[];
  
  // Enabled subsections
  enabledSubSections?: string[];
  
  // Editing
  isEditable?: boolean;
  onSave?: (field: string, value: any) => Promise<void>;
}

export function ContactTabContent({
  companyName,
  companyType,
  website,
  foundedYear,
  location,
  companySize,
  missionStatement,
  headquarters,
  primaryContact,
  secondaryContact,
  demoLink,
  trialLink,
  teamMembers,
  enabledSubSections = [],
  isEditable = false,
  onSave,
}: ContactTabContentProps) {
  const locationString = location 
    ? `${location.state}, ${location.country}`
    : headquarters || "";

  const isSubSectionEnabled = (subSectionId: string) => {
    return enabledSubSections.includes(`contact.${subSectionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Book a Demo Section - First */}
      {isSubSectionEnabled("book-demo") && (
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl shadow-lg border border-blue-700 p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Transform Your Healthcare Operations?
        </h2>
        <p className="text-lg text-blue-100 mb-6">
          Book a personalized demo to see how {companyName} can help streamline your workflow and improve patient care.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {demoLink ? (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl text-center"
            >
              Book a Demo Now →
            </a>
          ) : (
            <a
              href={`mailto:${primaryContact?.email || website || 'info@' + companyName.toLowerCase().replace(/\s+/g, '') + '.com'}?subject=Demo Request for ${companyName}`}
              className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl text-center"
            >
              Book a Demo Now →
            </a>
          )}
          {trialLink && (
            <a
              href={trialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 font-semibold text-lg text-center"
            >
              Start Free Trial
            </a>
          )}
        </div>
        {primaryContact && (
          <p className="mt-6 text-blue-200 text-sm text-center">
            Or contact us directly:{" "}
            <a 
              href={`mailto:${primaryContact.email}`}
              className="text-white hover:underline font-semibold"
            >
              {primaryContact.email}
            </a>
          </p>
        )}
        </div>
      )}

      {/* Company Overview */}
      {isSubSectionEnabled("company-overview") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <CompanyOverviewSection 
            companyName={companyName}
            companyType={companyType}
            website={website}
            foundedYear={foundedYear}
            location={location}
            companySize={companySize}
            missionStatement={missionStatement}
            headquarters={headquarters}
            isEditable={isEditable}
            onSave={onSave}
          />
        </div>
      )}

      {/* Contact Information */}
      {isSubSectionEnabled("contact-info") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-zinc-900 mb-6">Contact Information</h2>
        
        {/* Address */}
        <div className="mb-6 pb-6 border-b border-zinc-200">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Address</h3>
          <div className="space-y-2 text-sm text-zinc-700">
            {headquarters ? (
              <p>{headquarters}</p>
            ) : locationString ? (
              <p>{locationString}</p>
            ) : (
              <p className="text-zinc-500 italic">No address information available.</p>
            )}
            {location && (
              <p>{location.state}, {location.country}</p>
            )}
          </div>
        </div>

        {/* Primary Contact */}
        {primaryContact && (
          <div className="mb-6 pb-6 border-b border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Primary Contact</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-zinc-900">{primaryContact.name}</p>
                <p className="text-zinc-600">{primaryContact.title}</p>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${primaryContact.phone}`} className="hover:text-blue-600">
                  {primaryContact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${primaryContact.email}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {primaryContact.email}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Contact */}
        {secondaryContact && (
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Secondary Contact</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-zinc-900">{secondaryContact.name}</p>
                <p className="text-zinc-600">{secondaryContact.title}</p>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${secondaryContact.phone}`} className="hover:text-blue-600">
                  {secondaryContact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${secondaryContact.email}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {secondaryContact.email}
                </a>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Team & Leadership Section */}
      {isSubSectionEnabled("team-leadership") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">Team & Leadership</h2>
          <TeamLeadershipSection teamMembers={teamMembers} />
        </div>
      )}
    </div>
  );
}
