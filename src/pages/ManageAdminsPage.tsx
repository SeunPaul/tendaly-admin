import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";

interface Admin {
  id: number;
  name: string;
  email: string;
  adminLevel: string;
  lastLogin: string;
  profileImage?: string;
}

const ManageAdminsPage = () => {
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 6;
  const totalAdmins = 6;

  // Mock data for admins
  const admins: Admin[] = [
    {
      id: 1,
      name: "Denise Edwards",
      email: "denise.edwards@tendaly.com",
      adminLevel: "Support Admin",
      lastLogin: "07 June 2025 · 2:15 PM",
    },
    {
      id: 2,
      name: "James Dean",
      email: "james.dean@tendaly.com",
      adminLevel: "Support Admin",
      lastLogin: "06 June 2025 · 1:30 PM",
    },
    {
      id: 3,
      name: "Mary Jane",
      email: "mary.jane@tendaly.com",
      adminLevel: "Compliance Admin",
      lastLogin: "04 June 2025 · 1:30 PM",
    },
    {
      id: 4,
      name: "Nischa Wraith",
      email: "nischa.wraith@tendaly.com",
      adminLevel: "Platform Admin",
      lastLogin: "06 May 2025 · 6:00 PM",
    },
    {
      id: 5,
      name: "Ina Padley",
      email: "ina.padley@tendaly.com",
      adminLevel: "Admin",
      lastLogin: "15 March 2025 · 3:30 PM",
    },
    {
      id: 6,
      name: "Heather Seth",
      email: "heather.seth@tendaly.com",
      adminLevel: "Admin",
      lastLogin: "15 March 2025 · 4:00 PM",
    },
  ];

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAdmins(admins.map((admin) => admin.id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const handleSelectAdmin = (adminId: number, checked: boolean) => {
    if (checked) {
      setSelectedAdmins((prev) => [...prev, adminId]);
    } else {
      setSelectedAdmins((prev) => prev.filter((id) => id !== adminId));
    }
  };

  const handleActionClick = (adminId: number) => {
    setOpenDropdown(openDropdown === adminId ? null : adminId);
  };

  const getAdminLevelColor = (level: string) => {
    switch (level) {
      case "Platform Admin":
        return "bg-purple-100 text-purple-800";
      case "Compliance Admin":
        return "bg-blue-100 text-blue-800";
      case "Support Admin":
        return "bg-green-100 text-green-800";
      case "Admin":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages = Math.ceil(totalAdmins / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalAdmins);

  return (
    <div className="flex h-screen bg-gray-50 font-nunito" ref={dropdownRef}>
      <Sidebar activePage="Manage Admins" />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Admins
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download CSV</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>+ Create Admin</span>
          </button>
        </div>

        {/* Pagination Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-700">
            Showing {startItem}-{endItem} of {totalAdmins}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.length === admins.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin Name
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
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
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(admin.id)}
                          onChange={(e) =>
                            handleSelectAdmin(admin.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {admin.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdminLevelColor(
                          admin.adminLevel
                        )}`}
                      >
                        {admin.adminLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() => handleActionClick(admin.id)}
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
                        {openDropdown === admin.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <svg
                                  className="w-4 h-4 mr-3"
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
                                View Profile
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit Admin
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <svg
                                  className="w-4 h-4 mr-3"
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
                                Send Message
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-900">
                                <svg
                                  className="w-4 h-4 mr-3"
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
                                Remove Admin
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
        </div>
      </main>
    </div>
  );
};

export default ManageAdminsPage;
