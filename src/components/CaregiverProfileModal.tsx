import { useState } from "react";
import Modal from "./Modal";
import EmailUserModal from "./EmailUserModal";

interface CaregiverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiverId: number;
}

const CaregiverProfileModal: React.FC<CaregiverProfileModalProps> = ({
  isOpen,
  onClose,
  caregiverId,
}) => {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Mock data - in a real app, this would come from an API
  const caregiver = {
    id: caregiverId,
    name: "Sophia Davis",
    role: "Senior Caregiver",
    email: "sophiadavis@gmail.com",
    phone: "+1 (907) 535-0111",
    bio: "I'm a compassionate caregiver with 5+ years of experience supporting seniors and individuals with special needs. I assist with daily activities, medication reminders, light housekeeping, and companionship.",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalRevenue: "$5,500.00",
    jobsCompleted: 20,
    totalHoursWorked: 88,
    yearsOfExperience: 5,
    rating: 4.5,
    reviewCount: 9,
    experience:
      "With over 5 years of experience in home care, I provide reliable support for seniors, individuals with disabilities, and families in need. I'm trained in personal care, medication reminders, light housekeeping, and emotional companionship.",
    languages: ["English", "French"],
    specialties: ["Senior care", "Child care"],
    serviceArea: "Downtown Houston",
    hourlyRate: "$40.00",
    gender: "Female",
    dateOfBirth: "01 Feb 1992",
    address: "221B Baker Street, Maryland",
    country: "United States",
    zipCode: "18235",
    accountCreated: "24 Jun 2024",
    lastActive: "22 Jul 2025",
    isVerified: true,
  };

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

  // Mock certificate data
  const certificates = [
    {
      id: 1,
      type: "CPR",
      title: "CPR CERTIFICATE",
      name: "Name Surname",
      course: "BASIC LIFE SUPPORT (BLS)",
      issuer: "American Heart Association",
      certificateNumber: "CPR-2024-001",
      expirationDate: "Dec 2025",
    },
    {
      id: 2,
      type: "First Aid",
      title: "FIRST AID CERTIFICATE FOR CAREGIVERS",
      name: "Name Surname",
      course: "FIRST AID",
      issuer: "American Heart Association",
      certificateNumber: "FA-2024-001",
      expirationDate: "Dec 2025",
    },
  ];

  const tabs = ["Profile Information", "User Reviews", "Review Uploads"];

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
                {/* Revenue and Metrics Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600 mb-1">
                      Total User Revenue
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {caregiver.totalRevenue}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600 mb-1">
                      Jobs Completed
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      {caregiver.jobsCompleted}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600 mb-1">
                      Total Hours
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {caregiver.totalHoursWorked}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Rating
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(caregiver.rating)
                                  ? "text-yellow-400"
                                  : i < caregiver.rating
                                  ? "text-yellow-400"
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
                    <button className="text-blue-600 hover:text-blue-700">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
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

                {/* Skills */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Skills & Specialization
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Languages spoken
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
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Areas of specialty
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
                  </div>
                </div>

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

                {/* Certifications */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Certifications
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">CPR, First Aid</p>
                  <div className="bg-gray-100 p-4 rounded-lg mb-3">
                    <img
                      src="https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=CPR+CERTIFICATE"
                      alt="CPR Certificate"
                      className="w-full rounded"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Review Certificate
                  </button>
                </div>

                {/* Introduction Video */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction Video
                  </h3>
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
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Review Video
                  </button>
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
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="bg-gray-100 p-4 rounded-lg mb-3">
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 mb-2">
                            {cert.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            Name: {cert.name}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Course: {cert.course}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Issuer: {cert.issuer}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Certificate Number: {cert.certificateNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expiration Date: {cert.expirationDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Certificate Type: {cert.type}
                        </span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Review Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Video Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction Video
                  </h3>
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
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Review Video
                  </button>
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
    </>
  );
};

export default CaregiverProfileModal;
