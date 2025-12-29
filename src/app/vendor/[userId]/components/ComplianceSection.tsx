"use client";
import Image from "next/image";

interface CertificationDocument {
  certification: string;
  documentUrl?: string;
  logoUrl?: string;
  issuedDate?: Date;
  expiryDate?: Date;
}

interface ComplianceSectionProps {
  complianceCertifications?: string[];
  certificationDocuments?: CertificationDocument[];
}

export function ComplianceSection({
  complianceCertifications,
  certificationDocuments,
}: ComplianceSectionProps) {
  const hasCertifications = complianceCertifications && complianceCertifications.length > 0;
  const hasDocuments = certificationDocuments && certificationDocuments.length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Compliance & Certifications</h2>
      
      <div className="space-y-4">
        {hasCertifications ? (
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {complianceCertifications.map((cert, idx) => (
                  <span 
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold"
                  >
                    {cert}
                  </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-zinc-500 text-sm italic">No certifications listed.</div>
        )}

        {hasDocuments ? (
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Official Certifications</h3>
            <div className="space-y-3">
              {certificationDocuments.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                >
                  {doc.logoUrl ? (
                    <div className="mb-2 h-12 flex items-center justify-center">
                      <Image
                        src={doc.logoUrl}
                        alt={doc.certification}
                        width={100}
                        height={50}
                        className="object-contain max-h-12"
                      />
                    </div>
                  ) : (
                    <h4 className="text-sm font-semibold text-zinc-900 mb-2">{doc.certification}</h4>
                  )}
                  
                  <div className="space-y-1 text-xs">
                    {doc.issuedDate && (
                      <p className="text-zinc-600">
                        <span className="font-medium">Issued: </span>
                        {new Date(doc.issuedDate).toLocaleDateString()}
                      </p>
                    )}
                    {doc.expiryDate && (
                      <p className="text-zinc-600">
                        <span className="font-medium">Expires: </span>
                        {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                    {doc.documentUrl && (
                        <a 
                          href={doc.documentUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          View →
                        </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-zinc-500 text-sm italic">No certification documents available.</div>
        )}
      </div>
    </div>
  );
}
