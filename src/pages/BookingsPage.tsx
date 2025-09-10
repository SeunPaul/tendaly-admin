import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookingDetailsModal from "../components/BookingDetailsModal";

interface Booking {
  id: number;
  caregiver: {
    name: string;
    avatar?: string;
  };
  careSeeker: {
    name: string;
    avatar?: string;
  };
  careType: string;
  status: "In Progress" | "Completed" | "Cancelled";
  amount: string;
  date: string;
  checkIn: string;
  checkOut: string;
  location: string;
}

const BookingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isBookingDetailsModalOpen, setIsBookingDetailsModalOpen] =
    useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 20;
  const totalBookings = 2209;

  // Mock data for bookings
  const bookings: Booking[] = [
    {
      id: 1,
      caregiver: { name: "Denise Edwards" },
      careSeeker: { name: "James Dean" },
      careType: "Senior",
      status: "In Progress",
      amount: "$35.00 / hr",
      date: "23 July 2025",
      checkIn: "12:00 PM",
      checkOut: "4:00 PM",
      location: "El Paso, Texas",
    },
    {
      id: 2,
      caregiver: { name: "Michael Smith" },
      careSeeker: { name: "Jessica Liu" },
      careType: "Adult",
      status: "Completed",
      amount: "$25.00 / hr",
      date: "22 July 2025",
      checkIn: "9:00 AM",
      checkOut: "1:00 PM",
      location: "Austin, Texas",
    },
    {
      id: 3,
      caregiver: { name: "Sarah Johnson" },
      careSeeker: { name: "Robert Brown" },
      careType: "Pet",
      status: "Cancelled",
      amount: "$30.00 / hr",
      date: "21 July 2025",
      checkIn: "2:00 PM",
      checkOut: "6:00 PM",
      location: "Houston, Texas",
    },
    {
      id: 4,
      caregiver: { name: "Jessica White" },
      careSeeker: { name: "David Wilson" },
      careType: "Wellness Support",
      status: "In Progress",
      amount: "$28.00 / hr",
      date: "24 July 2025",
      checkIn: "10:00 AM",
      checkOut: "2:00 PM",
      location: "Dallas, Texas",
    },
    {
      id: 5,
      caregiver: { name: "Emily Davis" },
      careSeeker: { name: "Lisa Anderson" },
      careType: "Child",
      status: "Completed",
      amount: "$32.00 / hr",
      date: "20 July 2025",
      checkIn: "8:00 AM",
      checkOut: "12:00 PM",
      location: "San Antonio, Texas",
    },
    {
      id: 6,
      caregiver: { name: "Linda Harris" },
      careSeeker: { name: "Thomas Garcia" },
      careType: "Senior",
      status: "In Progress",
      amount: "$27.00 / hr",
      date: "25 July 2025",
      checkIn: "11:00 AM",
      checkOut: "3:00 PM",
      location: "Fort Worth, Texas",
    },
    {
      id: 7,
      caregiver: { name: "Laura Green" },
      careSeeker: { name: "Maria Rodriguez" },
      careType: "Adult",
      status: "Completed",
      amount: "$29.00 / hr",
      date: "19 July 2025",
      checkIn: "3:00 PM",
      checkOut: "7:00 PM",
      location: "Arlington, Texas",
    },
    {
      id: 8,
      caregiver: { name: "Megan Lewis" },
      careSeeker: { name: "Christopher Lee" },
      careType: "Pet",
      status: "Completed",
      amount: "$26.00 / hr",
      date: "18 July 2025",
      checkIn: "1:00 PM",
      checkOut: "5:00 PM",
      location: "Corpus Christi, Texas",
    },
    {
      id: 9,
      caregiver: { name: "Sofia Clark" },
      careSeeker: { name: "Amanda Taylor" },
      careType: "Wellness Support",
      status: "In Progress",
      amount: "$31.00 / hr",
      date: "26 July 2025",
      checkIn: "9:30 AM",
      checkOut: "1:30 PM",
      location: "Plano, Texas",
    },
    {
      id: 10,
      caregiver: { name: "Olivia Young" },
      careSeeker: { name: "Kevin Martinez" },
      careType: "Child",
      status: "Completed",
      amount: "$33.00 / hr",
      date: "17 July 2025",
      checkIn: "10:30 AM",
      checkOut: "2:30 PM",
      location: "Laredo, Texas",
    },
    {
      id: 11,
      caregiver: { name: "Anna Lee" },
      careSeeker: { name: "Rachel Kim" },
      careType: "Senior",
      status: "Cancelled",
      amount: "$34.00 / hr",
      date: "16 July 2025",
      checkIn: "2:30 PM",
      checkOut: "6:30 PM",
      location: "Lubbock, Texas",
    },
  ];

  const totalScheduledBookings = 1100;
  const inProgressBookings = 400;
  const completedBookings = 600;
  const cancelledBookings = 100;

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
      setSelectedBookings(bookings.map((booking) => booking.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (bookingId: number, checked: boolean) => {
    if (checked) {
      setSelectedBookings((prev) => [...prev, bookingId]);
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  const handleActionClick = (bookingId: number) => {
    setOpenDropdown(openDropdown === bookingId ? null : bookingId);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailsModalOpen(true);
    setOpenDropdown(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-orange-600";
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const totalPages = Math.ceil(totalBookings / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalBookings);

  return (
    <div
      className="flex h-screen bg-gray-50 dark:bg-gray-900 font-nunito"
      ref={dropdownRef}
    >
      <Sidebar activePage="Bookings" />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bookings
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Scheduled Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Scheduled Bookings
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {totalScheduledBookings.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +120 more bookings than last week
                </p>
              </div>
            </div>
          </div>

          {/* Booking Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-4">
              Booking Status Breakdown
            </h3>
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (inProgressBookings / totalScheduledBookings) * 100
                    }, 100`}
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (completedBookings / totalScheduledBookings) * 100
                    }, 100`}
                    strokeDashoffset={`-${
                      (inProgressBookings / totalScheduledBookings) * 100
                    }`}
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (cancelledBookings / totalScheduledBookings) * 100
                    }, 100`}
                    strokeDashoffset={`-${
                      ((inProgressBookings + completedBookings) /
                        totalScheduledBookings) *
                      100
                    }`}
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {inProgressBookings} In Progress
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {completedBookings} Completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {cancelledBookings} Cancelled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-700">
            Showing {startItem}-{endItem} of {totalBookings.toLocaleString()}
          </div>
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
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span>Sort</span>
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
        </div>

        {/* Bookings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === bookings.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Caregiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Care Seeker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Care Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={(e) =>
                          handleSelectBooking(booking.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {booking.caregiver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.caregiver.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {booking.careSeeker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.careSeeker.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.careType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() => handleActionClick(booking.id)}
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
                        {openDropdown === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                              >
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
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                Send Message
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
                                Edit Booking
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startItem}-{endItem} of {totalBookings.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={isBookingDetailsModalOpen}
          onClose={() => {
            setIsBookingDetailsModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BookingsPage;
