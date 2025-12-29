"use client";

import { useState } from "react";
import { EditableField } from "./EditableField";

interface CompanyOverviewSectionProps {
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
  isEditable?: boolean;
  onSave?: (field: string, value: any) => Promise<void>;
}

export function CompanyOverviewSection({
  companyName,
  companyType,
  website,
  foundedYear,
  location,
  companySize,
  missionStatement,
  headquarters,
  isEditable = false,
  onSave,
}: CompanyOverviewSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const formatCompanySize = (size?: string) => {
    if (!size) return "";
    if (size.includes("1000+")) return "1000+ employees";
    if (size.includes("201")) return "201-1000 employees";
    if (size.includes("51")) return "51-200 employees";
    if (size.includes("11")) return "11-50 employees";
    if (size.includes("1-10")) return "1-10 employees";
    return `${size} employees`;
  };

  const locationString = location ? `${location.state}, ${location.country}` : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">Company Overview</h2>
        {isEditable && (
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors"
            title={isEditMode ? "Cancel editing" : "Edit"}
          >
            <svg className={`w-5 h-5 ${isEditMode ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isEditMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              )}
            </svg>
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <EditableField
            value={companyName}
            onSave={async (value) => onSave && await onSave("companyName", value)}
            isEditable={isEditable}
            isEditMode={isEditMode}
            label="Company Name"
            className="text-lg text-zinc-900"
          />
          
          {(companyType || isEditable) && (
            <EditableField
              value={companyType || ""}
              onSave={async (value) => onSave && await onSave("companyType", value)}
              isEditable={isEditable}
            isEditMode={isEditMode}
              label="Company Type"
              className="text-lg text-zinc-900"
            />
          )}
          
          {(foundedYear || isEditable) && (
            <EditableField
              value={foundedYear ? foundedYear.toString() : ""}
              onSave={async (value) => onSave && await onSave("foundedYear", parseInt(value) || foundedYear || new Date().getFullYear())}
              isEditable={isEditable}
            isEditMode={isEditMode}
              label="Founded"
              className="text-lg text-zinc-900"
            />
          )}
          
          {(companySize || isEditable) && (
            <EditableField
              value={companySize ? formatCompanySize(companySize) : ""}
              onSave={async (value) => onSave && await onSave("companySize", value)}
              isEditable={isEditable}
            isEditMode={isEditMode}
              label="Team Size"
              className="text-lg text-zinc-900"
            />
          )}
        </div>
        
        <div className="space-y-4">
          {(headquarters || isEditable) && (
            <EditableField
              value={headquarters || ""}
              onSave={async (value) => onSave && await onSave("headquarters", value)}
              isEditable={isEditable}
            isEditMode={isEditMode}
              label="Headquarters"
              className="text-lg text-zinc-900"
            />
          )}
          
          {(location || isEditable) && (
            <EditableField
              value={locationString || ""}
              onSave={async (value) => {
                const [state, country] = value.split(",").map(s => s.trim());
                if (onSave) {
                  await onSave("location", { state, country });
                }
              }}
              isEditable={isEditable}
            isEditMode={isEditMode}
              label="Location"
              className="text-lg text-zinc-900"
            />
          )}
          
          {(website || isEditable) && (
            <div>
              <EditableField
                value={website || ""}
                onSave={async (value) => onSave && await onSave("website", value)}
                isEditable={isEditable}
            isEditMode={isEditMode}
                label="Website"
                className="text-lg text-zinc-900"
              />
              {!isEditable && website && (
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline text-sm mt-1 block"
                >
                  {website}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      
      {(missionStatement || isEditable) && (
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">Mission Statement</h3>
          <EditableField
            value={missionStatement || ""}
            onSave={async (value) => onSave && await onSave("missionStatement", value)}
            isEditable={isEditable}
            isEditMode={isEditMode}
            multiline={true}
            className="text-zinc-700 leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

