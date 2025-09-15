import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import CaregiverProfileModal from "../components/CaregiverProfileModal";
import EmailUserModal from "../components/EmailUserModal";
import {
  caregiversService,
  type Caregiver,
  type CaregiversQueryParams,
  type CaregiverMetrics,
} from "../services";

const CaregiversPage = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string | null>(
    null
  );
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedCaregiverForEmail, setSelectedCaregiverForEmail] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [metrics, setMetrics] = useState<CaregiverMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCaregivers, setTotalCaregivers] = useState(0);
  const [sortBy] = useState("created_at");
  const [sortOrder] = useState<"ASC" | "DESC">("DESC");
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

  // Fetch caregivers data
  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        setIsLoading(true);
        setError("");
        const params: CaregiversQueryParams = {
          page: currentPage,
          limit: 10,
          sortBy,
          sortOrder,
        };

        const response = await caregiversService.getCaregivers(params);
        if (response.success) {
          setCaregivers(response.data.caregivers);
          setMetrics(response.data.metrics);
          setTotalPages(response.data.pagination.totalPages);
          setTotalCaregivers(response.data.pagination.total);
        } else {
          setError(response.message || "Failed to load caregivers");
        }
      } catch (err) {
        console.error("Caregivers fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load caregivers"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaregivers();
  }, [currentPage, sortBy, sortOrder]);

  const handleActionClick = (caregiverId: string) => {
    setOpenDropdown(openDropdown === caregiverId ? null : caregiverId);
  };

  const handleViewProfile = (caregiverId: string) => {
    setSelectedCaregiverId(caregiverId);
    setIsProfileModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSendEmail = (caregiver: Caregiver) => {
    setSelectedCaregiverForEmail({
      id: caregiver.id,
      name: caregiver.full_name,
      email: caregiver.email,
    });
    setIsEmailModalOpen(true);
    setOpenDropdown(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-nunito">
        <Sidebar activePage="Care givers" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading caregivers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-nunito">
        <Sidebar activePage="Care givers" />
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
    );
  }

  return (
    <div
      className="flex h-screen bg-gray-50 dark:bg-gray-900 font-nunito"
      ref={dropdownRef}
    >
      <Sidebar activePage="Care givers" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Care givers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Total Caregivers
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {metrics?.totalCaregivers.value.toLocaleString() || "0"}
              </p>
              <div
                className={`flex items-center text-sm ${
                  metrics?.totalCaregivers.changeType === "positive"
                    ? "text-green-600"
                    : metrics?.totalCaregivers.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {metrics?.totalCaregivers.change || "No change"}
              </div>
            </div>

            {/* Verified Caregivers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Verified Caregivers
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {metrics?.verifiedCaregivers.value.toLocaleString() || "0"}
              </p>
              <div
                className={`flex items-center text-sm mt-1 ${
                  metrics?.verifiedCaregivers.changeType === "positive"
                    ? "text-green-600"
                    : metrics?.verifiedCaregivers.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {metrics?.verifiedCaregivers.change || "No change"}
              </div>
            </div>

            {/* Caregivers with Active Jobs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Caregivers with Active Jobs
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {metrics?.caregiversWithActiveJobs.value.toLocaleString() ||
                  "0"}
              </p>
              <div
                className={`flex items-center text-sm ${
                  metrics?.caregiversWithActiveJobs.changeType === "positive"
                    ? "text-green-600"
                    : metrics?.caregiversWithActiveJobs.changeType ===
                      "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {metrics?.caregiversWithActiveJobs.change || "No change"}
              </div>
            </div>
          </div>

          {/* Caregivers Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Verified Caregivers
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Account Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {caregivers.map((caregiver) => (
                    <tr
                      key={caregiver.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {caregiver.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          {caregiver.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {caregiver.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {new Date(
                          caregiver.account_created
                        ).toLocaleDateString()}
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
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(currentPage - 1) * 10 + 1}-
                  {Math.min(currentPage * 10, totalCaregivers)} of{" "}
                  {totalCaregivers.toLocaleString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                    {currentPage}
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
