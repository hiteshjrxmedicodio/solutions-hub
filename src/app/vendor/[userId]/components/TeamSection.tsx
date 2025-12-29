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

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

export function TeamSection({ teamMembers }: TeamSectionProps) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-zinc-900 mb-6">Team & Leadership</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white rounded-lg border border-zinc-200"
          >
            {member.photoUrl ? (
              <div className="mb-4 h-32 w-32 mx-auto">
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="mb-4 h-32 w-32 mx-auto bg-zinc-200 rounded-full flex items-center justify-center">
                <span className="text-4xl text-zinc-400">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-zinc-900 text-center mb-1">
              {member.name}
            </h3>
            <p className="text-sm text-zinc-600 text-center mb-4">{member.title}</p>
            
            {member.expertise && member.expertise.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 justify-center">
                {member.expertise.map((exp, expIdx) => (
                  <span 
                    key={expIdx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}
            
            {member.bio && (
              <p className="text-sm text-zinc-700 mb-4 text-center">{member.bio}</p>
            )}
            
            {member.linkedinUrl && (
              <div className="text-center">
                <a 
                  href={member.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  LinkedIn →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

