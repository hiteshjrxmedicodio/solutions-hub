"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { InstitutionQuestionnaire } from "@/components/InstitutionQuestionnaire";
import { VendorQuestionnaire } from "@/components/vendor-questionnaire/VendorQuestionnaire";
import { RoleSelection } from "@/components/RoleSelection";

interface InstitutionProfile {
  selectedAISolutions?: string[];
  institutionName?: string;
  institutionType?: string;
  location?: {
    state?: string;
    country?: string;
  };
  primaryContact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  secondaryContact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  preferredContactMethod?: string;
  bestTimeToContactDays?: string;
  bestTimeToContactStartTime?: string;
  bestTimeToContactEndTime?: string;
  bestTimeToContactTimeZone?: string;
  medicalSpecialties?: string[];
  patientVolume?: string;
  currentSystems?: string[];
  complianceRequirements?: string[];
  integrationRequirements?: string[];
  dataSecurityNeeds?: string[];
  primaryChallenges?: string[];
  currentPainPoints?: string[];
  goals?: string[];
  interestedSolutionAreas?: string[];
  mustHaveFeatures?: string[];
  niceToHaveFeatures?: string[];
  budgetRange?: string;
  timeline?: string;
  decisionMakers?: string[];
  procurementProcess?: string[];
  additionalNotes?: string;
  status?: string;
}

interface VendorProfile {
  companyName?: string;
  companyType?: string;
  companyTypeOther?: string;
  website?: string;
  foundedYear?: number;
  location?: {
    state?: string;
    country?: string;
    countryOther?: string;
  };
  companySize?: string;
  primaryContact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  secondaryContact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  preferredContactMethod?: string;
  bestTimeToContactDays?: string;
  bestTimeToContactStartTime?: string;
  bestTimeToContactEndTime?: string;
  bestTimeToContactTimeZone?: string;
  bestTimeToContactTimeZoneOther?: string;
  solutionName?: string;
  solutionDescription?: string;
  solutionCategory?: string[];
  targetSpecialties?: string[];
  targetInstitutionTypes?: string[];
  keyFeatures?: string[];
  keyFeaturesOther?: string;
  technologyStack?: string[];
  technologyStackOther?: string;
  deploymentOptions?: string[];
  integrationCapabilities?: string[];
  integrationCapabilitiesOther?: string;
  complianceCertifications?: string[];
  complianceCertificationsOther?: string;
  securityFeatures?: string[];
  securityFeaturesOther?: string;
  dataHandling?: string;
  pricingModel?: string;
  pricingRange?: string;
  contractTerms?: string[];
  implementationTime?: string;
  supportOffered?: string[];
  supportOfferedOther?: string;
  trainingProvided?: string[];
  trainingProvidedOther?: string;
  currentClients?: string[];
  clientCount?: number;
  caseStudies?: string;
  testimonials?: string;
  awards?: string[];
  competitiveAdvantages?: string[];
  competitiveAdvantagesOther?: string;
  futureRoadmap?: string;
  additionalNotes?: string;
  status?: string;
}

// Helper function to check if user logged in within last 24 hours
const isUserActiveLast24Hours = (lastLoginAt?: Date): boolean => {
  if (!lastLoginAt) return false;
  const lastLogin = new Date(lastLoginAt);
  const now = new Date();
  const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
  return hoursSinceLogin <= 24;
};

export default function ProfilePage() {
  const { user } = useUser();
  const { userData, isLoading: isLoadingUserData, updateRole, refetch } = useUserData();
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState<InstitutionProfile | VendorProfile>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);

  const userRole = userData?.role;

  // Check if role selection is needed
  useEffect(() => {
    if (!isLoadingUserData && user && userData && !userRole) {
      setIsRoleSelectionOpen(true);
    }
  }, [isLoadingUserData, user, userData, userRole]);

  // Fetch profile data based on role
  useEffect(() => {
    if (user === undefined || !user?.id || !userRole) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const endpoint = userRole === "buyer" 
      ? `/api/institution/${user.id}`
      : `/api/vendor/${user.id}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setHasProfile(true);
          setProfileData(data.data);
        } else {
          setHasProfile(false);
          setProfileData({});
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setHasProfile(false);
        setProfileData({});
        setIsLoading(false);
      });
  }, [user, userRole]);

  const handleRoleSelect = async (role: "buyer" | "seller") => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      
      const result = await response.json();
      if (result.success) {
        updateRole(role);
        setIsRoleSelectionOpen(false);
        // Refetch to get latest data
        await refetch();
      } else {
        alert("Error saving role: " + result.error);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Error saving role. Please try again.");
    }
  };

  const handleSaveQuestionnaire = async (data: any) => {
    if (!userRole) return;
    
    try {
      const endpoint = userRole === "buyer" ? "/api/institution" : "/api/vendor";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        setHasProfile(true);
        setProfileData(result.data);
        setIsQuestionnaireOpen(false);
        alert("Profile saved successfully!");
        // Refetch user data to update profile flags (this will update cache)
        await refetch();
      } else {
        alert("Error saving profile: " + result.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    }
  };

  const renderArrayField = (items: string[] | undefined, label: string) => {
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-600 mb-2">{label}</label>
        {items && items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 italic text-sm">No information provided</p>
        )}
      </div>
    );
  };

  const renderCard = (title: string, children: React.ReactNode, icon?: React.ReactNode) => (
    <div className="bg-white border border-zinc-300 rounded-lg p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 pb-3 border-b border-zinc-200">
        {icon && <div className="text-blue-600 flex-shrink-0">{icon}</div>}
        <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const renderField = (label: string, value: string | undefined | null) => {
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-600 mb-1.5">{label}</label>
        {value ? (
          <p className="text-zinc-900 text-sm break-words">{value}</p>
        ) : (
          <p className="text-zinc-400 italic text-sm">No information provided</p>
        )}
      </div>
    );
  };

  const renderChallengeGoalSolutionGroup = (profile: InstitutionProfile) => {
    const challenges = profile.primaryChallenges || [];
    const painPoints = profile.currentPainPoints || [];
    const goals = profile.goals || [];
    const solutionAreas = profile.interestedSolutionAreas || [];
    const mustHaveFeatures = profile.mustHaveFeatures || [];
    const niceToHaveFeatures = profile.niceToHaveFeatures || [];
    
    const maxLength = Math.max(
      challenges.length,
      painPoints.length,
      goals.length,
      solutionAreas.length
    );

    if (maxLength === 0 && mustHaveFeatures.length === 0 && niceToHaveFeatures.length === 0) {
      return <p className="text-zinc-400 italic text-sm">No information provided</p>;
    }

    return (
      <div className="space-y-6">
        {/* Grouped Challenge-Goal-Solution Items */}
        {maxLength > 0 && (
          <div className="space-y-4">
            {Array.from({ length: maxLength }).map((_, idx) => {
              const challenge = challenges[idx];
              const painPoint = painPoints[idx];
              const goal = goals[idx];
              const solutionArea = solutionAreas[idx];
              
              if (!challenge && !painPoint && !goal && !solutionArea) return null;
              
              return (
                <div key={idx} className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 space-y-3">
                  {challenge && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Challenge</label>
                      <p className="text-sm text-zinc-900">{challenge}</p>
                    </div>
                  )}
                  {painPoint && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Pain Point</label>
                      <p className="text-sm text-zinc-900">{painPoint}</p>
                    </div>
                  )}
                  {goal && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Goal</label>
                      <p className="text-sm text-zinc-900">{goal}</p>
                    </div>
                  )}
                  {solutionArea && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Solution Area</label>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-300">
                        {solutionArea}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Remaining ungrouped items */}
        {(challenges.length > maxLength || painPoints.length > maxLength || goals.length > maxLength || solutionAreas.length > maxLength) && (
          <div className="pt-4 border-t border-zinc-200 space-y-4">
            {challenges.length > maxLength && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Additional Challenges</label>
                <div className="flex flex-wrap gap-2">
                  {challenges.slice(maxLength).map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {painPoints.length > maxLength && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Additional Pain Points</label>
                <div className="flex flex-wrap gap-2">
                  {painPoints.slice(maxLength).map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {goals.length > maxLength && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Additional Goals</label>
                <div className="flex flex-wrap gap-2">
                  {goals.slice(maxLength).map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {solutionAreas.length > maxLength && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Additional Solution Areas</label>
                <div className="flex flex-wrap gap-2">
                  {solutionAreas.slice(maxLength).map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Must-Have and Nice-to-Have Features */}
        {(mustHaveFeatures.length > 0 || niceToHaveFeatures.length > 0) && (
          <div className="pt-4 border-t border-zinc-200 space-y-4">
            {mustHaveFeatures.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Must-Have Features</label>
                <div className="flex flex-wrap gap-2">
                  {mustHaveFeatures.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {niceToHaveFeatures.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Nice-to-Have Features</label>
                <div className="flex flex-wrap gap-2">
                  {niceToHaveFeatures.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm border border-amber-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-white" style={{ WebkitOverflowScrolling: "touch" }}>
      <main className="min-h-full bg-white">
        {/* Navigation Bar - Always Open, Not Closable */}
        <HamburgerMenu 
          isOpen={true} 
          onToggle={() => {}}
          onClose={() => {}}
          isClosable={false}
          showShadow={false}
        />
        
        <div className="w-full px-2 py-6 pt-28 pb-8 max-w-[98%] mx-auto">
          {/* Header with Questionnaire Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">
                {userRole === "buyer" ? "My Healthcare Institution" : userRole === "seller" ? "My Vendor Profile" : ""}
              </h1>
              {hasProfile && (
                <p className="text-zinc-600 mt-2">
                  {userRole === "buyer" 
                    ? "Complete your institution profile to get matched with the best AI solutions"
                    : "Complete your vendor profile to showcase your AI solutions"}
                </p>
              )}
            </div>
            {userRole && (
              <button
                onClick={() => setIsQuestionnaireOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {hasProfile ? "Update Profile" : "Edit Information"}
              </button>
            )}
          </div>

          {/* Vendor Visibility Note - Only for buyers */}
          {userRole === "buyer" && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    <span className="text-amber-900 font-medium">Profile Visibility Notice:</span> <span className="font-semibold">Premium vendors</span> can analyze this profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Status Card */}
          {hasProfile && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Profile Complete</h3>
                  <p className="text-sm text-zinc-600 mb-3">
                    {userRole === "buyer" 
                      ? "Your institution profile has been submitted. We're matching you with relevant AI solutions from our vendor database."
                      : "Your vendor profile has been submitted. Premium member healthcare institutions will be able to view and analyze your profile."}
                  </p>
                  {userRole === "buyer" && (profileData as InstitutionProfile).institutionName && (
                    <p className="text-sm font-medium text-zinc-700">
                      Institution: <span className="text-blue-600">{(profileData as InstitutionProfile).institutionName}</span>
                    </p>
                  )}
                  {userRole === "seller" && (profileData as VendorProfile).companyName && (
                    <p className="text-sm font-medium text-zinc-700">
                      Company: <span className="text-blue-600">{(profileData as VendorProfile).companyName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-zinc-400">Loading profile...</div>
            </div>
          )}

          {/* Profile Data Layout - 30% Left, 70% Right */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4">
              {/* Left Side - User Profile & General Information Card (30%) */}
              <div className="space-y-4">
                {/* User Profile Card */}
                {user && (
                  <div className="bg-white border border-zinc-300 rounded-lg p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow sticky top-28">
                    {/* Avatar and Name Section */}
                    <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-200">
                      <div className="flex-shrink-0 mb-4 relative inline-block">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={user.firstName || "User"}
                            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-300 shadow-sm"
                          />
                        ) : (
                          <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-zinc-300 shadow-sm"
                            style={{ backgroundColor: "#7A8B5A" }}
                          >
                            <span className="text-white text-2xl font-medium">
                              {user.firstName?.[0]?.toUpperCase() || user.lastName?.[0]?.toUpperCase() || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <h2 className="text-xl font-semibold text-zinc-900 break-words">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || user.emailAddresses[0]?.emailAddress || "User"}
                        </h2>
                        <p className="text-sm text-zinc-600 mt-2 break-words">
                          {user.emailAddresses[0]?.emailAddress || ""}
                        </p>
                      </div>
                    </div>

                    {/* General Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-zinc-900 pb-2 border-b border-zinc-200">General Information</h3>
                      {userRole === "buyer" ? (
                        <>
                          {renderField("Institution Name", (profileData as InstitutionProfile).institutionName)}
                          {renderField("Institution Type", (profileData as InstitutionProfile).institutionType)}
                        </>
                      ) : (
                        <>
                          {renderField("Company Name", (profileData as VendorProfile).companyName)}
                          {renderField("Company Type", (profileData as VendorProfile).companyType || (profileData as VendorProfile).companyTypeOther)}
                          {renderField("Website", (profileData as VendorProfile).website)}
                          {renderField("Founded Year", (profileData as VendorProfile).foundedYear?.toString())}
                          {renderField("Company Size", (profileData as VendorProfile).companySize)}
                        </>
                      )}
                      {renderField("State", profileData.location?.state)}
                      {renderField("Country", profileData.location?.country || (profileData as VendorProfile).location?.countryOther)}
                      
                      <div className="pt-4 border-t border-zinc-200">
                        <h4 className="text-sm font-semibold text-zinc-700 mb-3">Primary Contact</h4>
                        {renderField("Name", profileData.primaryContact?.name)}
                        {renderField("Title", profileData.primaryContact?.title)}
                        {renderField("Email", profileData.primaryContact?.email)}
                        {renderField("Phone", profileData.primaryContact?.phone)}
                      </div>
                      
                      {profileData.secondaryContact && (
                        <div className="pt-4 border-t border-zinc-200">
                          <h4 className="text-sm font-semibold text-zinc-700 mb-3">Secondary Contact</h4>
                          {renderField("Name", profileData.secondaryContact.name)}
                          {renderField("Title", profileData.secondaryContact.title)}
                          {renderField("Email", profileData.secondaryContact.email)}
                          {renderField("Phone", profileData.secondaryContact.phone)}
                        </div>
                      )}
                      
                      {renderField("Preferred Contact Method", profileData.preferredContactMethod)}
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-600 mb-1">Best Time to Contact</label>
                        {profileData.bestTimeToContactDays ? (
                          <p className="text-zinc-900 text-sm">
                            {profileData.bestTimeToContactDays}
                            {profileData.bestTimeToContactStartTime && profileData.bestTimeToContactEndTime && 
                              `, ${profileData.bestTimeToContactStartTime} - ${profileData.bestTimeToContactEndTime}`}
                            {profileData.bestTimeToContactTimeZone && ` (${profileData.bestTimeToContactTimeZone})`}
                          </p>
                        ) : (
                          <p className="text-zinc-400 italic text-sm">No information provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - All Other Cards (70%) */}
              <div className="space-y-4">
                {userRole === "buyer" ? (
                  <>
                    {/* Challenges, Goals & Solution Requirements */}
                    {renderCard(
                      "Challenges, Goals & Solution Requirements",
                      <>
                        {renderChallengeGoalSolutionGroup(profileData as InstitutionProfile)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}

                    {/* Medical Information */}
                    {renderCard(
                      "Medical Information",
                      <>
                        {renderField("Patient Volume", (profileData as InstitutionProfile).patientVolume)}
                        {renderArrayField((profileData as InstitutionProfile).medicalSpecialties, "Medical Specialties")}
                        {renderArrayField((profileData as InstitutionProfile).currentSystems, "Current Systems")}
                        {renderArrayField((profileData as InstitutionProfile).complianceRequirements, "Compliance Requirements")}
                        {renderArrayField((profileData as InstitutionProfile).integrationRequirements, "Integration Requirements")}
                        {renderArrayField((profileData as InstitutionProfile).dataSecurityNeeds, "Data Security Needs")}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}

                    {/* Budget & Timeline */}
                    {renderCard(
                      "Budget & Timeline",
                      <>
                        {renderField("Budget Range", (profileData as InstitutionProfile).budgetRange)}
                        {renderField("Implementation Timeline", (profileData as InstitutionProfile).timeline)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}

                    {/* Additional Information */}
                    {renderCard(
                      "Additional Information",
                      <>
                        {renderArrayField((profileData as InstitutionProfile).procurementProcess, "Procurement Process")}
                        {renderField("Additional Notes", (profileData as InstitutionProfile).additionalNotes)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </>
                ) : (
                  <>
                    {/* Solution Information */}
                    {renderCard(
                      "Solution Information",
                      <>
                        {renderField("Solution Name", (profileData as VendorProfile).solutionName)}
                        {renderField("Solution Description", (profileData as VendorProfile).solutionDescription)}
                        {renderArrayField((profileData as VendorProfile).solutionCategory, "Solution Category")}
                        {renderArrayField((profileData as VendorProfile).targetSpecialties, "Target Specialties")}
                        {renderArrayField((profileData as VendorProfile).targetInstitutionTypes, "Target Institution Types")}
                        {renderArrayField((profileData as VendorProfile).keyFeatures, "Key Features")}
                        {renderField("Additional Features", (profileData as VendorProfile).keyFeaturesOther)}
                        {renderArrayField((profileData as VendorProfile).technologyStack, "Technology Stack")}
                        {renderField("Other Technologies", (profileData as VendorProfile).technologyStackOther)}
                        {renderArrayField((profileData as VendorProfile).deploymentOptions, "Deployment Options")}
                        {renderArrayField((profileData as VendorProfile).integrationCapabilities, "Integration Capabilities")}
                        {renderField("Other Integrations", (profileData as VendorProfile).integrationCapabilitiesOther)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}

                    {/* Compliance & Security */}
                    {renderCard(
                      "Compliance & Security",
                      <>
                        {renderArrayField((profileData as VendorProfile).complianceCertifications, "Compliance Certifications")}
                        {renderField("Other Certifications", (profileData as VendorProfile).complianceCertificationsOther)}
                        {renderArrayField((profileData as VendorProfile).securityFeatures, "Security Features")}
                        {renderField("Other Security Features", (profileData as VendorProfile).securityFeaturesOther)}
                        {renderField("Data Handling", (profileData as VendorProfile).dataHandling)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}

                    {/* Business Information */}
                    {renderCard(
                      "Business Information",
                      <>
                        {renderField("Pricing Model", (profileData as VendorProfile).pricingModel)}
                        {renderField("Pricing Range", (profileData as VendorProfile).pricingRange)}
                        {renderArrayField((profileData as VendorProfile).contractTerms, "Contract Terms")}
                        {renderField("Implementation Time", (profileData as VendorProfile).implementationTime)}
                        {renderArrayField((profileData as VendorProfile).supportOffered, "Support Offered")}
                        {renderField("Other Support", (profileData as VendorProfile).supportOfferedOther)}
                        {renderArrayField((profileData as VendorProfile).trainingProvided, "Training Provided")}
                        {renderField("Other Training", (profileData as VendorProfile).trainingProvidedOther)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}

                    {/* Market & Clients */}
                    {renderCard(
                      "Market & Clients",
                      <>
                        {renderArrayField((profileData as VendorProfile).currentClients, "Current Client Types")}
                        {renderField("Client Count", (profileData as VendorProfile).clientCount?.toString())}
                        {renderField("Case Studies", (profileData as VendorProfile).caseStudies)}
                        {renderField("Testimonials", (profileData as VendorProfile).testimonials)}
                        {renderArrayField((profileData as VendorProfile).awards, "Awards")}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}

                    {/* Additional Information */}
                    {renderCard(
                      "Additional Information",
                      <>
                        {renderArrayField((profileData as VendorProfile).competitiveAdvantages, "Competitive Advantages")}
                        {renderField("Other Advantages", (profileData as VendorProfile).competitiveAdvantagesOther)}
                        {renderField("Future Roadmap", (profileData as VendorProfile).futureRoadmap)}
                        {renderField("Additional Notes", (profileData as VendorProfile).additionalNotes)}
                      </>,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Selection Modal */}
        <RoleSelection
          isOpen={isRoleSelectionOpen}
          onClose={() => setIsRoleSelectionOpen(false)}
          onSelect={handleRoleSelect}
        />

        {/* Institution Questionnaire Modal - Only for buyers */}
        {userRole === "buyer" && (
          <InstitutionQuestionnaire
            isOpen={isQuestionnaireOpen}
            onClose={() => setIsQuestionnaireOpen(false)}
            onSave={handleSaveQuestionnaire}
            initialData={profileData}
          />
        )}

        {/* Vendor Questionnaire Modal - Only for sellers */}
        {userRole === "seller" && (
          <VendorQuestionnaire
            isOpen={isQuestionnaireOpen}
            onClose={() => setIsQuestionnaireOpen(false)}
            onSave={handleSaveQuestionnaire}
            initialData={profileData}
          />
        )}
      </main>
    </div>
  );
}

