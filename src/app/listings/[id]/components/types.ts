export interface Listing {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requiredFeatures: string[];
  preferredFeatures: string[];
  technicalRequirements: string[];
  integrationRequirements: string[];
  complianceRequirements: string[];
  budgetRange: string;
  timeline: string;
  contractType: string[];
  deploymentPreference: string[];
  institutionName?: string;
  institutionType?: string;
  medicalSpecialties?: string[];
  currentSystems?: string[];
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactTitle?: string;
  status: string;
  proposalsCount: number;
  viewsCount: number;
  proposals?: Array<{
    vendorUserId: string;
    vendorName: string;
    proposalText: string;
    proposedPrice?: string;
    proposedTimeline?: string;
    submittedAt: string;
    status: string;
  }>;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  high: 'bg-amber-100 text-amber-700 border-amber-300',
  urgent: 'bg-red-100 text-red-700 border-red-300',
};

