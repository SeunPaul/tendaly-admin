import { useState, useEffect } from "react";
import Modal from "./Modal";
import EmailUserModal from "./EmailUserModal";
import {
  careSeekersService,
  type CareSeekerUser,
  type CareSeekerKycProfile,
} from "../services";

interface CareSeekerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  careSeekerId: string;
}

const CareSeekerProfileModal: React.FC<CareSeekerProfileModalProps> = ({
  isOpen,
  onClose,
  careSeekerId,
}) => {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [careSeeker, setCareSeeker] = useState<CareSeekerUser | null>(null);
  const [kycProfile, setKycProfile] = useState<CareSeekerKycProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (isOpen && careSeekerId) {
      fetchCareSeekerProfile();
    }
  }, [isOpen, careSeekerId]);

  const fetchCareSeekerProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await careSeekersService.getCareSeekerProfile(
        careSeekerId
      );

      if (response.success) {
        setCareSeeker(response.data.user);
        setKycProfile(response.data.kyc_profile);
      } else {
        setError(response.message || "Failed to fetch care seeker profile");
      }
    } catch (err) {
      console.error("Error fetching care seeker profile:", err);
      setError("Failed to fetch care seeker profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewImage = (imageUrl: string) => {
    setViewingImageUrl(imageUrl);
    setImageViewerOpen(true);
  };

  const handleKycVerification = async (
    type: "valid_id" | "work_authorization" | "passport",
    verified: boolean
  ) => {
    if (!careSeeker?.id) return;

    const action = verified ? "verify" : "reject";
    setVerifying((prev) => ({ ...prev, [type]: action }));
    try {
      let response;
      switch (type) {
        case "valid_id":
          response = await careSeekersService.verifyValidId(
            careSeeker.id,
            verified
          );
          break;
        case "work_authorization":
          response = await careSeekersService.verifyWorkAuthorization(
            careSeeker.id,
            verified
          );
          break;
        case "passport":
          response = await careSeekersService.verifyPassport(
            careSeeker.id,
            verified
          );
          break;
      }

      if (response.success) {
        // Refresh the profile data to get updated verification status
        await fetchCareSeekerProfile();
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 font-nunito">
                Loading care seeker profile...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Error
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={fetchCareSeekerProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : careSeeker ? (
          <div className="flex h-[85vh] overflow-hidden">
            {/* Left Section - Personal Information */}
            <div className="w-1/3 bg-gray-50 dark:bg-gray-800 p-6 rounded-l-lg overflow-y-auto">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 p-2">
                    <img
                      src={
                        careSeeker.profile_photo ||
                        "https://via.placeholder.com/150"
                      }
                      alt={`${careSeeker.first_name} ${careSeeker.last_name}`}
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {careSeeker.first_name} {careSeeker.last_name}
                  {kycProfile?.valid_id_verified && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {careSeeker.user_type}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Email
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {careSeeker.email}
                    </span>
                    <button
                      onClick={() => handleCopyToClipboard(careSeeker.email)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Phone
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {careSeeker.phone_number}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyToClipboard(careSeeker.phone_number)
                      }
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Send Email
                </button>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Delete User
                </button>
              </div>
            </div>

            {/* Right Section - Detailed Information */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-r-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {["Profile Information", "KYC Details"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto h-full">
                {activeTab === "Profile Information" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {careSeeker.first_name}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {careSeeker.last_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gender
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white capitalize">
                            {careSeeker.gender}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {formatDateOfBirth(careSeeker.dob)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-900 dark:text-white">
                          {careSeeker.address}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Zip Code
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {careSeeker.zip_code}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {careSeeker.country?.name || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Account Created
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(careSeeker.created_at)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Modified
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(careSeeker.modified_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "KYC Details" && (
                  <div className="space-y-6">
                    {kycProfile ? (
                      <>
                        {/* Valid ID Section */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Valid ID
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleKycVerification("valid_id", true)
                                }
                                disabled={verifying.valid_id !== null}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {verifying.valid_id === "verify"
                                  ? "Verifying..."
                                  : "Verify"}
                              </button>
                              <button
                                onClick={() =>
                                  handleKycVerification("valid_id", false)
                                }
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
                              <p className="text-gray-500 dark:text-gray-400">
                                Valid ID Type
                              </p>
                              <p className="text-gray-900 dark:text-white capitalize">
                                {kycProfile.valid_id_type?.replace("_", " ") ||
                                  "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Valid ID Verified
                              </p>
                              <p
                                className={`font-medium ${
                                  kycProfile.valid_id_verified
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {kycProfile.valid_id_verified
                                  ? "Verified"
                                  : "Not Verified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Valid ID Front
                              </p>
                              {kycProfile.valid_id_front ? (
                                <button
                                  onClick={() =>
                                    handleViewImage(kycProfile.valid_id_front!)
                                  }
                                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  —
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Valid ID Back
                              </p>
                              {kycProfile.valid_id_back ? (
                                <button
                                  onClick={() =>
                                    handleViewImage(kycProfile.valid_id_back!)
                                  }
                                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  —
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Work Authorization Section */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Work Authorization
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleKycVerification(
                                    "work_authorization",
                                    true
                                  )
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
                                  handleKycVerification(
                                    "work_authorization",
                                    false
                                  )
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
                              <p className="text-gray-500 dark:text-gray-400">
                                Authorization Type
                              </p>
                              <p className="text-gray-900 dark:text-white capitalize">
                                {kycProfile.work_authorization_type || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Work Auth Verified
                              </p>
                              <p
                                className={`font-medium ${
                                  kycProfile.work_authorization_verified
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {kycProfile.work_authorization_verified
                                  ? "Verified"
                                  : "Not Verified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Work Permit Front
                              </p>
                              {kycProfile.work_permit_front ? (
                                <button
                                  onClick={() =>
                                    handleViewImage(
                                      kycProfile.work_permit_front!
                                    )
                                  }
                                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  —
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Work Permit Back
                              </p>
                              {kycProfile.work_permit_back ? (
                                <button
                                  onClick={() =>
                                    handleViewImage(
                                      kycProfile.work_permit_back!
                                    )
                                  }
                                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  —
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                EIN/TIN Number
                              </p>
                              <p className="text-gray-900 dark:text-white">
                                {kycProfile.ein_tin_number || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                SSN
                              </p>
                              <p className="text-gray-900 dark:text-white">
                                {kycProfile.ssn || "—"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Passport Section */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Passport & Background
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleKycVerification("passport", true)
                                }
                                disabled={verifying.passport !== null}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {verifying.passport === "verify"
                                  ? "Verifying..."
                                  : "Verify"}
                              </button>
                              <button
                                onClick={() =>
                                  handleKycVerification("passport", false)
                                }
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
                              <p className="text-gray-500 dark:text-gray-400">
                                Passport Verified
                              </p>
                              <p
                                className={`font-medium ${
                                  kycProfile.passport_verified
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {kycProfile.passport_verified
                                  ? "Verified"
                                  : "Not Verified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Allow Background Check
                              </p>
                              <p className="text-gray-900 dark:text-white">
                                {kycProfile.allow_background_check
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-gray-500 dark:text-gray-400">
                                Passport Photo
                              </p>
                              {kycProfile.passport_photo ? (
                                <button
                                  onClick={() =>
                                    handleViewImage(kycProfile.passport_photo!)
                                  }
                                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  —
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400 mb-4">
                          <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No KYC Information
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          This care seeker has not completed their KYC
                          verification process.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Email Modal */}
      {careSeeker && (
        <EmailUserModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          recipient={{
            name: `${careSeeker.first_name} ${careSeeker.last_name}`,
            email: careSeeker.email,
          }}
        />
      )}

      {/* Image Viewer Modal */}
      <Modal
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        size="lg"
      >
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Viewer
            </h3>
            <button
              onClick={() => window.open(viewingImageUrl, "_blank")}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
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
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CareSeekerProfileModal;
