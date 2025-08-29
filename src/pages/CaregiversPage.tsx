import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import CaregiverProfileModal from "../components/CaregiverProfileModal";
import EmailUserModal from "../components/EmailUserModal";

const CaregiversPage = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<number | null>(
    null
  );
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedCaregiverForEmail, setSelectedCaregiverForEmail] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (caregiverId: number) => {
    setOpenDropdown(openDropdown === caregiverId ? null : caregiverId);
  };

  const handleViewProfile = (caregiverId: number) => {
    setSelectedCaregiverId(caregiverId);
    setIsProfileModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSendEmail = (caregiver: any) => {
    setSelectedCaregiverForEmail({
      id: caregiver.id,
      name: caregiver.fullName,
      email: caregiver.email,
    });
    setIsEmailModalOpen(true);
    setOpenDropdown(null);
  };

  const caregivers = [
    {
      id: 1,
      fullName: "Denise Edwards",
      email: "denise.edwards@example.com",
      type: "Caregiver",
      accountCreated: "07 June 2025",
    },
    {
      id: 2,
      fullName: "James Dean",
      email: "james.dean@example.com",
      type: "Caregiver",
      accountCreated: "07 June 2025",
    },
    {
      id: 3,
      fullName: "Mary Jane",
      email: "mary.jane@example.com",
      type: "Caregiver",
      accountCreated: "04 June 2025",
    },
    {
      id: 4,
      fullName: "Nischa Wraith",
      email: "nischa.wraith@example.com",
      type: "Caregiver",
      accountCreated: "06 May 2025",
    },
    {
      id: 5,
      fullName: "Ina Padley",
      email: "ina.padley@example.com",
      type: "Caregiver",
      accountCreated: "15 March 2025",
    },
    {
      id: 6,
      fullName: "Tom Welling",
      email: "tom.welling@example.com",
      type: "Caregiver",
      accountCreated: "15 March 2025",
    },
    {
      id: 7,
      fullName: "Richard Banks",
      email: "richard.banks@example.com",
      type: "Caregiver",
      accountCreated: "15 March 2025",
    },
    {
      id: 8,
      fullName: "Heather Seth",
      email: "heather.seth@example.com",
      type: "Caregiver",
      accountCreated: "11 March 2025",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-nunito" ref={dropdownRef}>
      <Sidebar activePage="Care givers" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Care givers</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Caregivers Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Top Row Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Caregivers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Caregivers
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">1,204</p>
              <div className="flex items-center text-green-600 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                +120 more caregivers than last week
              </div>
            </div>

            {/* Verified Caregivers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Verified Caregivers
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">980</p>
              <div className="text-red-600 text-sm">
                224 Pending verification
              </div>
            </div>

            {/* Caregivers with Active Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Caregivers with Active Jobs
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">945</p>
              <div className="flex items-center text-green-600 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                +45 more caregivers than last week
              </div>
            </div>
          </div>

          {/* Caregivers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Verified Caregivers
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                    Sort
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download CSV
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    New User
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Full Name</span>
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
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {caregivers.map((caregiver) => (
                    <tr key={caregiver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {caregiver.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {caregiver.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {caregiver.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caregiver.accountCreated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => handleActionClick(caregiver.id)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdown === caregiver.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() =>
                                    handleViewProfile(caregiver.id)
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                  <svg
                                    className="w-4 h-4 mr-3 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  View Profile
                                </button>
                                <button
                                  onClick={() => handleSendEmail(caregiver)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                  <svg
                                    className="w-4 h-4 mr-3 text-gray-400"
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
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing 1-20 of 2,209
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                    1
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    2
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    3
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    4
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    5
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Caregiver Profile Modal */}
      {selectedCaregiverId && (
        <CaregiverProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedCaregiverId(null);
          }}
          caregiverId={selectedCaregiverId}
        />
      )}

      {/* Email User Modal */}
      {selectedCaregiverForEmail && (
        <EmailUserModal
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedCaregiverForEmail(null);
          }}
          recipient={{
            name: selectedCaregiverForEmail.name,
            email: selectedCaregiverForEmail.email,
          }}
        />
      )}
    </div>
  );
};

export default CaregiversPage;
