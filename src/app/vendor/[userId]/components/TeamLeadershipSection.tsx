"use client";
import Image from "next/image";

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  expertise?: string[];
  linkedinUrl?: string;
}

interface TeamLeadershipSectionProps {
  teamMembers?: TeamMember[];
}

export function TeamLeadershipSection({ teamMembers }: TeamLeadershipSectionProps) {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500 text-sm italic">No team information available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
          >
            {/* Photo and Basic Info */}
            <div className="flex items-start gap-4 mb-4">
              {member.photoUrl ? (
                <div className="flex-shrink-0">
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-600">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">{member.name}</h3>
                <p className="text-sm text-zinc-600 mb-2">{member.title}</p>
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <p className="text-sm text-zinc-700 mb-4 leading-relaxed">{member.bio}</p>
            )}

            {/* Expertise Tags */}
            {member.expertise && member.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((exp, expIdx) => (
                  <span
                    key={expIdx}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

