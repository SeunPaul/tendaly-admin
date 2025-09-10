import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";

interface Review {
  id: number;
  userName: string;
  userRole: string;
  givenToName: string;
  givenToRole: string;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
}

interface Dispute {
  id: number;
  userName: string;
  userRole: string;
  reportedByName: string;
  reportedByRole: string;
  reason: string;
  moreInfo: string;
}

const ReviewsDisputesPage = () => {
  const [activeTab, setActiveTab] = useState("Reviews");
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [selectedDisputes, setSelectedDisputes] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 10;
  const totalItems = 2209;

  const reviews: Review[] = [
    {
      id: 1,
      userName: "Ralph Edwards",
      userRole: "Care Seeker",
      givenToName: "Darrell Steward",
      givenToRole: "Caregiver",
      rating: 4,
      reviewTitle: "Lacinia diam consequat",
      reviewContent:
        "Vitae sit adipiscing ipsum placerat. Pretium et nec scelerisque tellus luctus. Mauris consequat nunc elit auctor enim.",
    },
    {
      id: 2,
      userName: "Ralph Edwards",
      userRole: "Care Seeker",
      givenToName: "Samantha Green",
      givenToRole: "Caregiver",
      rating: 3,
      reviewTitle: "Tempor commodo eros",
      reviewContent:
        "Sed pharetra turpis eu arcu vestibulum, vitae varius tellus congue. Etiam malesuada orci ac ex suscipit, a molestie turpis cursus.",
    },
    {
      id: 3,
      userName: "Ralph Edwards",
      userRole: "Caregiver",
      givenToName: "Elena Gilbert",
      givenToRole: "Care Seeker",
      rating: 3,
      reviewTitle: "Amet facilisis felis",
      reviewContent:
        "Integer tincidunt justo id felis interdum, vitae malesuada libero varius. Nulla facilisi. Sed a mauris ac libero hendrerit porta.",
    },
    {
      id: 4,
      userName: "Ralph Edwards",
      userRole: "Caregiver",
      givenToName: "Leonard Cohen",
      givenToRole: "Care Seeker",
      rating: 4,
      reviewTitle: "Fringilla odio euismod",
      reviewContent:
        "Phasellus convallis arcu vitae ligula pharetra, sit amet hendrerit magna vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.",
    },
    {
      id: 5,
      userName: "Ralph Edwards",
      userRole: "Caregiver",
      givenToName: "Chloe Zhao",
      givenToRole: "Care Seeker",
      rating: 3,
      reviewTitle: "Eros suscipit faucibus",
      reviewContent:
        "Curabitur bibendum arcu nec felis tempus, ac eleifend neque gravida. Nunc et purus vel lorem scelerisque varius sed ac nibh.",
    },
    {
      id: 6,
      userName: "Ralph Edwards",
      userRole: "Caregiver",
      givenToName: "Chloe Zhao",
      givenToRole: "Care Seeker",
      rating: 3,
      reviewTitle: "Eros suscipit faucibus",
      reviewContent:
        "Curabitur bibendum arcu nec felis tempus, ac eleifend neque gravida. Nunc et purus vel lorem scelerisque varius sed ac nibh.",
    },
    {
      id: 7,
      userName: "Sarah Johnson",
      userRole: "Care Seeker",
      givenToName: "Michael Brown",
      givenToRole: "Caregiver",
      rating: 5,
      reviewTitle: "Excellent service provided",
      reviewContent:
        "Very professional and caring. Would highly recommend to others looking for quality care services.",
    },
    {
      id: 8,
      userName: "David Wilson",
      userRole: "Caregiver",
      givenToName: "Emily Davis",
      givenToRole: "Care Seeker",
      rating: 4,
      reviewTitle: "Great communication",
      reviewContent:
        "Clear expectations and good working relationship. Family was very appreciative of the care provided.",
    },
    {
      id: 9,
      userName: "Lisa Anderson",
      userRole: "Care Seeker",
      givenToName: "Robert Taylor",
      givenToRole: "Caregiver",
      rating: 2,
      reviewTitle: "Needs improvement",
      reviewContent:
        "Service was adequate but could be better. Some communication issues that need to be addressed.",
    },
    {
      id: 10,
      userName: "James Miller",
      userRole: "Caregiver",
      givenToName: "Jennifer White",
      givenToRole: "Care Seeker",
      rating: 4,
      reviewTitle: "Professional and reliable",
      reviewContent:
        "Consistent quality of care and always on time. Family was very satisfied with the services.",
    },
  ];

  const disputes: Dispute[] = [
    {
      id: 1,
      userName: "Courtney Henry",
      userRole: "Caregiver",
      reportedByName: "Leslie Alexander",
      reportedByRole: "Care Seeker",
      reason: "No Show",
      moreInfo:
        "Vitae sit adipiscing ipsum placerat. Pretium et nec scelerisque tellus luctus. Mauris consequat nunc elit auctor enim.",
    },
    {
      id: 2,
      userName: "Betty White",
      userRole: "Caregiver",
      reportedByName: "Ruth Bellows",
      reportedByRole: "Care Seeker",
      reason: "Late",
      moreInfo:
        "Sed pharetra turpis eu arcu vestibulum, vitae varius tellus congue. Etiam malesuada orci ac ex suscipit, a molestie turpis cursus.",
    },
    {
      id: 3,
      userName: "Ali Pareet",
      userRole: "Care Seeker",
      reportedByName: "Leslie Alexander",
      reportedByRole: "Caregiver",
      reason: "Harassment",
      moreInfo:
        "Integer tincidunt justo id felis interdum, vitae malesuada libero varius. Nulla facilisi. Sed a mauris ac libero hendrerit porta.",
    },
    {
      id: 4,
      userName: "James Henry",
      userRole: "Care Seeker",
      reportedByName: "Leslie Alexander",
      reportedByRole: "Caregiver",
      reason: "Hostile",
      moreInfo:
        "Phasellus convallis arcu vitae ligula pharetra, sit amet hendrerit magna vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.",
    },
    {
      id: 5,
      userName: "Sean Greenes",
      userRole: "Caregiver",
      reportedByName: "Jerome Paww",
      reportedByRole: "Care Seeker",
      reason: "No Show",
      moreInfo:
        "Curabitur bibendum arcu nec felis tempus, ac eleifend neque gravida. Nunc et purus vel lorem scelerisque varius sed ac nibh.",
    },
    {
      id: 6,
      userName: "Henrietta White",
      userRole: "Caregiver",
      reportedByName: "Rocky Bilbo",
      reportedByRole: "Care Seeker",
      reason: "Late",
      moreInfo:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Sed do eiusmod tempor incididunt ut labore.",
    },
    {
      id: 7,
      userName: "Henry Smith",
      userRole: "Caregiver",
      reportedByName: "Keelan Grey",
      reportedByRole: "Care Seeker",
      reason: "Harassment",
      moreInfo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 8,
      userName: "Maria Garcia",
      userRole: "Care Seeker",
      reportedByName: "John Doe",
      reportedByRole: "Caregiver",
      reason: "Hostile",
      moreInfo:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: 9,
      userName: "Thomas Lee",
      userRole: "Caregiver",
      reportedByName: "Jane Smith",
      reportedByRole: "Care Seeker",
      reason: "No Show",
      moreInfo:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: 10,
      userName: "Amanda Clark",
      userRole: "Care Seeker",
      reportedByName: "Robert Johnson",
      reportedByRole: "Caregiver",
      reason: "Late",
      moreInfo:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (activeTab === "Reviews") {
      if (checked) {
        setSelectedReviews(reviews.map((review) => review.id));
      } else {
        setSelectedReviews([]);
      }
    } else {
      if (checked) {
        setSelectedDisputes(disputes.map((dispute) => dispute.id));
      } else {
        setSelectedDisputes([]);
      }
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (activeTab === "Reviews") {
      if (checked) {
        setSelectedReviews((prev) => [...prev, itemId]);
      } else {
        setSelectedReviews((prev) => prev.filter((id) => id !== itemId));
      }
    } else {
      if (checked) {
        setSelectedDisputes((prev) => [...prev, itemId]);
      } else {
        setSelectedDisputes((prev) => prev.filter((id) => id !== itemId));
      }
    }
  };

  const handleActionClick = (itemId: number) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}/5</span>
      </div>
    );
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className="flex h-screen bg-gray-50 dark:bg-gray-900 font-nunito"
      ref={dropdownRef}
    >
      <Sidebar activePage="Reviews & Disputes" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reviews & Disputes
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("Reviews")}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "Reviews"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("Disputes")}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "Disputes"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Disputes
          </button>
        </div>

        {/* Pagination Summary and Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-700">
            Showing {startItem}-{endItem} of {totalItems}
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
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                {totalPages > 6 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
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

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === "Reviews" ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedReviews.length === reviews.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Given to
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={(e) =>
                            handleSelectItem(review.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">
                                {review.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {review.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {review.userRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                            <div className="w-full h-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">
                                {review.givenToName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {review.givenToName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {review.givenToRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {renderStars(review.rating)}
                          <div className="text-sm font-medium text-gray-900">
                            {review.reviewTitle}
                          </div>
                          <div className="text-sm text-gray-600 max-w-xs">
                            {review.reviewContent}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => handleActionClick(review.id)}
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
                          {openDropdown === review.id && (
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
                                  View Details
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
                                  Edit Review
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
                                  Remove Review
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
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedDisputes.length === disputes.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      More Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {disputes.map((dispute) => (
                    <tr
                      key={dispute.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDisputes.includes(dispute.id)}
                          onChange={(e) =>
                            handleSelectItem(dispute.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">
                                {dispute.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dispute.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dispute.userRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                            <div className="w-full h-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">
                                {dispute.reportedByName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dispute.reportedByName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dispute.reportedByRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {dispute.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {dispute.moreInfo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => handleActionClick(dispute.id)}
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
                          {openDropdown === dispute.id && (
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
                                  View Details
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
                                  Edit Dispute
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 hover:text-green-900">
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
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Resolve Dispute
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
                                  Remove Dispute
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewsDisputesPage;
