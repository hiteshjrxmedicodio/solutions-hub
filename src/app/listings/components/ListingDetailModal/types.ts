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

export interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string | null;
}

export const priorityColors: Record<'low' | 'medium' | 'high' | 'urgent', string> = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
};

