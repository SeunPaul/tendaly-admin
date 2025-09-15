import { useEffect, useState } from "react";
import Modal from "./Modal";
import EmailUserModal from "./EmailUserModal";
import { caregiversService, type CaregiverProfileResponse } from "../services";

interface CaregiverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiverId: string;
}

const CaregiverProfileModal: React.FC<CaregiverProfileModalProps> = ({
  isOpen,
  onClose,
  caregiverId,
}) => {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [profile, setProfile] = useState<
    CaregiverProfileResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewingImageUrl, setViewingImageUrl] = useState<string>("");
  const [verifying, setVerifying] = useState<{
    [key: string]: "verify" | "reject" | null;
  }>({
    valid_id: null,
    work_authorization: null,
    passport: null,
  });

  // Derived fallback/local display using API data where possible
  const caregiver = {
    id: caregiverId,
    name:
      (profile?.user.first_name && profile?.user.last_name
        ? `${profile.user.first_name} ${profile.user.last_name}`
        : undefined) || "",
    role: "Caregiver",
    email: profile?.user.email || "",
    phone: profile?.user.phone_number || "",
    bio: profile?.caregiver_profile?.about || "",
    profileImage:
      profile?.user.profile_photo ||
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalRevenue: "N/A", // Not available in API
    jobsCompleted: 0, // Not available in API
    totalHoursWorked: 0, // Not available in API
    yearsOfExperience: profile?.caregiver_profile?.years_of_experience || 0,
    rating: 0, // Not available in API
    reviewCount: 0, // Not available in API
    experience: profile?.caregiver_profile?.summary_of_experience || "",
    languages:
      profile?.caregiver_profile?.languages?.map((lang) => lang.name) || [],
    specialties:
      profile?.caregiver_profile?.care_types?.map((care) => care.name) || [],
    serviceArea: profile?.caregiver_profile?.service_address || "",
    hourlyRate: (() => {
      const value = profile?.caregiver_profile?.hourly_rate as unknown;
      if (value === null || value === undefined) return "";
      const num = typeof value === "number" ? value : Number(value as string);
      return Number.isFinite(num) ? `$${num.toFixed(2)}` : "";
    })(),
    gender: profile?.user.gender || "",
    dateOfBirth: profile?.user.dob || "",
    address: profile?.user.address || "",
    country: profile?.user.country?.name || "",
    zipCode: profile?.user.zip_code || "",
    accountCreated: profile?.user.created_at
      ? new Date(profile.user.created_at).toLocaleDateString()
      : "",
    lastActive: profile?.user.modified_at
      ? new Date(profile.user.modified_at).toLocaleDateString()
      : "",
    isVerified: profile?.kyc_profile?.valid_id_verified || false,
    // Additional fields from caregiver_profile
    canTravel: profile?.caregiver_profile?.can_travel || false,
    canProvideLiveInCare:
      profile?.caregiver_profile?.can_provide_live_in_care || false,
    acceptBooking: profile?.caregiver_profile?.accept_booking || false,
    serviceRadius: profile?.caregiver_profile?.service_radius || 0,
    videoIntro: profile?.caregiver_profile?.video_intro || null,
    certificates: profile?.caregiver_profile?.certificates || [],
    serviceTypes:
      profile?.caregiver_profile?.service_types?.map(
        (service) => service.name
      ) || [],
  };

  useEffect(() => {
    if (!isOpen || !caregiverId) return;
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await caregiversService.getCaregiverById(caregiverId);
        if (!ignore) setProfile(res.data);
      } catch (e) {
        if (!ignore)
          setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [isOpen, caregiverId]);

  // Mock review data
  const reviews = [
    {
      id: 1,
      rating: 5,
      title: "Lacinia diam consequat",
      body: "Vitae sit adipiscing ipsum placerat. Pretium et nec scelerisque tellus luctus. Mauris consequat nunc elit auctor enim.",
      reviewerName: "Johnson Fanning",
      date: "2 days ago",
    },
    {
      id: 2,
      rating: 5,
      title: "Excellent care and attention",
      body: "Sophia provided exceptional care for my mother. She was always punctual, professional, and caring. Highly recommend!",
      reviewerName: "Sarah Johnson",
      date: "1 week ago",
    },
    {
      id: 3,
      rating: 5,
      title: "Very reliable and compassionate",
      body: "Sophia has been taking care of my grandmother for months now. She's incredibly patient and understanding.",
      reviewerName: "Michael Chen",
      date: "2 weeks ago",
    },
    {
      id: 4,
      rating: 5,
      title: "Outstanding service quality",
      body: "Professional, caring, and always goes above and beyond. My family is very grateful for her services.",
      reviewerName: "Emily Rodriguez",
      date: "3 weeks ago",
    },
  ];

  const tabs = ["Profile Information", "User Reviews", "Review Uploads", "KYC"];

  const handleEmailUser = () => {
    setIsEmailModalOpen(true);
  };

  const handleSuspendUser = () => {
    console.log(`Suspend user: ${caregiver.id}`);
  };

  const handleDeleteUser = () => {
    console.log(`Delete user: ${caregiver.id}`);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleViewImage = (imageUrl: string) => {
    setViewingImageUrl(imageUrl);
    setImageViewerOpen(true);
  };

  const handleViewCertificate = (certificateUrl: string) => {
    setViewingImageUrl(certificateUrl);
    setImageViewerOpen(true);
  };

  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return "image";
    } else if (extension === "pdf") {
      return "pdf";
    }
    return "unknown";
  };

  const handleKycVerification = async (
    type: "valid_id" | "work_authorization" | "passport",
    verified: boolean
  ) => {
    if (!profile?.user?.id) return;

    const action = verified ? "verify" : "reject";
    setVerifying((prev) => ({ ...prev, [type]: action }));
    try {
      let response;
      switch (type) {
        case "valid_id":
          response = await caregiversService.verifyValidId(
            profile.user.id,
            verified
          );
          break;
        case "work_authorization":
          response = await caregiversService.verifyWorkAuthorization(
            profile.user.id,
            verified
          );
          break;
        case "passport":
          response = await caregiversService.verifyPassport(
            profile.user.id,
            verified
          );
          break;
      }

      if (response.success) {
        // Refresh the profile data to get updated verification status
        const updatedProfile = await caregiversService.getCaregiverById(
          caregiverId
        );
        setProfile(updatedProfile.data);
      }
    } catch (err) {
      console.error(`${type} verification error:`, err);
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${verified ? "verify" : "reject"} ${type}`
      );
    } finally {
      setVerifying((prev) => ({ ...prev, [type]: null }));
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="flex h-[85vh] overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading caregiver profile...</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="flex h-[85vh] overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="flex h-[85vh] overflow-hidden">
          {/* Left Section - Personal Information */}
          <div className="w-1/3 bg-gray-50 p-6 rounded-l-lg overflow-y-auto">
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-100 p-2">
                  <img
                    src={caregiver.profileImage}
                    alt={caregiver.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Name and Role */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {caregiver.name}
                {caregiver.isVerified && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </h2>
              <p className="text-gray-600">{caregiver.role}</p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {caregiver.bio}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Email</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{caregiver.email}</span>
                  <button
                    onClick={() => handleCopyToClipboard(caregiver.email)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Phone</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{caregiver.phone}</span>
                  <button
                    onClick={() => handleCopyToClipboard(caregiver.phone)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="space-y-2">
              <button
                onClick={handleEmailUser}
                className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-white rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Email User</span>
              </button>
              <button
                onClick={handleSuspendUser}
                className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-white rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                <span>Suspend User</span>
              </button>
              <button
                onClick={handleDeleteUser}
                className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete User</span>
              </button>
            </div>
          </div>

          {/* Right Section - Main Content */}
          <div className="w-2/3 p-6 overflow-y-auto">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Profile Information Content */}
            {activeTab === "Profile Information" && (
              <div className="space-y-6">
                {/* Service Information Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600 mb-1">
                      Years of Experience
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {caregiver.yearsOfExperience}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600 mb-1">
                      Service Radius
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      {caregiver.serviceRadius} miles
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600 mb-1">
                      Hourly Rate
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {caregiver.hourlyRate || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Service Capabilities */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Service Capabilities
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          caregiver.canTravel ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-700">Can Travel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          caregiver.canProvideLiveInCare
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-700">
                        Live-in Care
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          caregiver.acceptBooking
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-700">
                        Accepting Bookings
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          caregiver.isVerified ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-700">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Caregiving Experience
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Summary of experience
                  </p>
                  <p className="text-gray-700">{caregiver.experience}</p>
                </div>

                {/* Video Introduction */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Introduction Video
                  </h3>
                  {caregiver.videoIntro ? (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-64 object-cover"
                        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludHJvZHVjdGlvbiBWaWRlbzwvdGV4dD48L3N2Zz4="
                      >
                        <source src={caregiver.videoIntro} type="video/mp4" />
                        <source src={caregiver.videoIntro} type="video/webm" />
                        <source src={caregiver.videoIntro} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="relative bg-gray-100 p-4 rounded-lg mb-3">
                      <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-8 h-8 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills & Specialization */}
                {(caregiver.languages.length > 0 ||
                  caregiver.specialties.length > 0 ||
                  caregiver.serviceTypes.length > 0) && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Skills & Specialization
                    </h3>
                    <div className="space-y-3">
                      {caregiver.languages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Languages Spoken
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {caregiver.languages.map((language) => (
                              <span
                                key={language}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {caregiver.specialties.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Areas of Specialty
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {caregiver.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {caregiver.serviceTypes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Service Types
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {caregiver.serviceTypes.map((serviceType) => (
                              <span
                                key={serviceType}
                                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                              >
                                {serviceType}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Service Area & Rates */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Service area & Rates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">
                        Service area
                      </span>
                      <p className="font-medium">{caregiver.serviceArea}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Hourly rate</span>
                      <p className="font-medium">{caregiver.hourlyRate}</p>
                    </div>
                  </div>
                </div>

                {/* Other Information */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Other Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Gender</span>
                      <p className="font-medium">{caregiver.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Date of Birth
                      </span>
                      <p className="font-medium">{caregiver.dateOfBirth}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">
                        Home address
                      </span>
                      <p className="font-medium">{caregiver.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Country</span>
                      <p className="font-medium">{caregiver.country}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Zip code</span>
                      <p className="font-medium">{caregiver.zipCode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Account created
                      </span>
                      <p className="font-medium">{caregiver.accountCreated}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Last active</span>
                      <p className="font-medium">{caregiver.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Reviews Tab */}
            {activeTab === "User Reviews" && (
              <div className="space-y-6">
                {/* Overall Rating */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Overall Rating
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(caregiver.rating)
                                  ? "text-red-500"
                                  : i < caregiver.rating
                                  ? "text-red-500"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {caregiver.rating} out of 5
                        </span>
                        <span className="text-gray-500">
                          ({caregiver.reviewCount} Reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rating Distribution
                  </h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-12">
                          {stars} Stars
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${
                                stars === 5
                                  ? "80"
                                  : stars === 4
                                  ? "15"
                                  : stars === 3
                                  ? "3"
                                  : stars === 2
                                  ? "1"
                                  : "1"
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Individual Reviews
                  </h3>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            {review.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {review.body}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {review.reviewerName}
                            </span>
                            <span className="text-sm text-gray-400">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <button className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                          REVIEW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Uploads Tab */}
            {activeTab === "Review Uploads" && (
              <div className="space-y-6">
                {/* Certifications Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Certifications
                  </h3>
                  {caregiver.certificates &&
                  caregiver.certificates.length > 0 ? (
                    caregiver.certificates.map((cert, index) => (
                      <div
                        key={cert.id}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex gap-4">
                          {/* Certificate Preview */}
                          <div className="flex-shrink-0">
                            {cert.certificate_url ? (
                              <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                {getFileType(cert.certificate_url) ===
                                "image" ? (
                                  <img
                                    src={cert.certificate_url}
                                    alt={`Certificate ${index + 1}`}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() =>
                                      handleViewCertificate(
                                        cert.certificate_url!
                                      )
                                    }
                                  />
                                ) : getFileType(cert.certificate_url) ===
                                  "pdf" ? (
                                  <div
                                    className="w-full h-full flex flex-col items-center justify-center bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                                    onClick={() =>
                                      handleViewCertificate(
                                        cert.certificate_url!
                                      )
                                    }
                                  >
                                    <svg
                                      className="w-8 h-8 text-red-600 mb-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="text-xs text-red-600 font-medium">
                                      PDF
                                    </span>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <svg
                                      className="w-8 h-8 text-gray-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Certificate Details */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Certificate {index + 1}
                            </h4>
                            <div className="space-y-1">
                              {cert.issuing_organization && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Organization:
                                  </span>{" "}
                                  {cert.issuing_organization}
                                </p>
                              )}
                              {cert.license_number && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    License #:
                                  </span>{" "}
                                  {cert.license_number}
                                </p>
                              )}
                              {cert.issue_date && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Issued:</span>{" "}
                                  {new Date(
                                    cert.issue_date
                                  ).toLocaleDateString()}
                                </p>
                              )}
                              {cert.expiration_date && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Expires:</span>{" "}
                                  {new Date(
                                    cert.expiration_date
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {cert.certificate_url && (
                              <button
                                onClick={() =>
                                  handleViewCertificate(cert.certificate_url!)
                                }
                                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-500 text-center">
                        No certificates uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* Video Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction Video
                  </h3>
                  {caregiver.videoIntro ? (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <video
                        controls
                        className="w-full h-64 object-cover"
                        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludHJvZHVjdGlvbiBWaWRlbzwvdGV4dD48L3N2Zz4="
                      >
                        <source src={caregiver.videoIntro} type="video/mp4" />
                        <source src={caregiver.videoIntro} type="video/webm" />
                        <source src={caregiver.videoIntro} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="relative bg-gray-100 p-4 rounded-lg mb-3">
                      <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-8 h-8 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Review Video
                  </button>
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === "KYC" && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Valid ID
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleKycVerification("valid_id", true)}
                        disabled={verifying.valid_id !== null}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifying.valid_id === "verify"
                          ? "Verifying..."
                          : "Verify"}
                      </button>
                      <button
                        onClick={() => handleKycVerification("valid_id", false)}
                        disabled={verifying.valid_id !== null}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifying.valid_id === "reject"
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Valid ID Type</p>
                      <p className="text-gray-900">
                        {profile?.kyc_profile?.valid_id_type || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid ID Verified</p>
                      <p
                        className={`font-medium ${
                          profile?.kyc_profile?.valid_id_verified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {profile?.kyc_profile?.valid_id_verified
                          ? "Verified"
                          : "Not Verified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid ID Front</p>
                      {profile?.kyc_profile?.valid_id_front ? (
                        <button
                          onClick={() =>
                            handleViewImage(
                              profile.kyc_profile!.valid_id_front!
                            )
                          }
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Valid ID Back</p>
                      {profile?.kyc_profile?.valid_id_back ? (
                        <button
                          onClick={() =>
                            handleViewImage(profile.kyc_profile!.valid_id_back!)
                          }
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Work Authorization
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleKycVerification("work_authorization", true)
                        }
                        disabled={verifying.work_authorization !== null}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifying.work_authorization === "verify"
                          ? "Verifying..."
                          : "Verify"}
                      </button>
                      <button
                        onClick={() =>
                          handleKycVerification("work_authorization", false)
                        }
                        disabled={verifying.work_authorization !== null}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifying.work_authorization === "reject"
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Authorization Type</p>
                      <p className="text-gray-900">
                        {profile?.kyc_profile?.work_authorization_type || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Work Auth Verified</p>
                      <p
                        className={`font-medium ${
                          profile?.kyc_profile?.work_authorization_verified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {profile?.kyc_profile?.work_authorization_verified
                          ? "Verified"
                          : "Not Verified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">EIN/TIN Number</p>
                      <p className="text-gray-900">
                        {profile?.kyc_profile?.ein_tin_number || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">SSN</p>
                      <p className="text-gray-900">
                        {profile?.kyc_profile?.ssn || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Permit Front</p>
                      {profile?.kyc_profile?.work_permit_front ? (
                        <button
                          onClick={() =>
                            handleViewImage(
                              profile.kyc_profile!.work_permit_front!
                            )
                          }
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Permit Back</p>
                      {profile?.kyc_profile?.work_permit_back ? (
                        <button
                          onClick={() =>
                            handleViewImage(
                              profile.kyc_profile!.work_permit_back!
                            )
                          }
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Passport & Background
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleKycVerification("passport", true)}
                        disabled={verifying.passport !== null}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifying.passport === "verify"
                          ? "Verifying..."
                          : "Verify"}
                      </button>
                      <button
                        onClick={() => handleKycVerification("passport", false)}
                        disabled={verifying.passport !== null}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifying.passport === "reject"
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Passport Verified</p>
                      <p
                        className={`font-medium ${
                          profile?.kyc_profile?.passport_verified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {profile?.kyc_profile?.passport_verified
                          ? "Verified"
                          : "Not Verified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Allow Background Check</p>
                      <p className="text-gray-900">
                        {profile?.kyc_profile?.allow_background_check
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Passport Photo</p>
                      {profile?.kyc_profile?.passport_photo ? (
                        <button
                          onClick={() =>
                            handleViewImage(
                              profile.kyc_profile!.passport_photo!
                            )
                          }
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Email User Modal */}
      <EmailUserModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipient={{
          name: caregiver.name,
          email: caregiver.email,
          profileImage: caregiver.profileImage,
        }}
      />

      {/* Document Viewer Modal */}
      <Modal
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        size="lg"
      >
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Document Viewer
            </h3>
            <button
              onClick={() => window.open(viewingImageUrl, "_blank")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in New Tab
            </button>
          </div>
          <div className="flex justify-center">
            {getFileType(viewingImageUrl) === "pdf" ? (
              <iframe
                src={viewingImageUrl}
                className="w-full h-[70vh] border-0 rounded-lg shadow-lg"
                title="PDF Document"
              />
            ) : (
              <img
                src={viewingImageUrl}
                alt="Document"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CaregiverProfileModal;
