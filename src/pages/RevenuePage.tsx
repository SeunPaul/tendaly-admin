import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TransactionDetailsModal from "../components/TransactionDetailsModal";

interface Payment {
  id: number;
  careSeeker: string;
  caregiver: string;
  paymentType: string;
  amount: string;
  date: string;
}

interface TransactionDetails {
  id: number;
  paymentType: string;
  careSeeker: {
    name: string;
    avatar?: string;
  };
  caregiver: {
    name: string;
    avatar?: string;
  };
  date: string;
  time: string;
  services: {
    duration: string;
    careType: string;
    rate: string;
    hoursEstimated: string;
    shiftAmount: string;
  }[];
  subTotal: string;
  tendalyFee: string;
  totalTax: string;
  totalAmount: string;
}

const RevenuePage = () => {
  const [activeTab, setActiveTab] = useState("Payments");
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetails | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 20;
  const totalPayments = 2209;

  const payments: Payment[] = [
    {
      id: 1,
      careSeeker: "Denise Edwards",
      caregiver: "James Dean",
      paymentType: "Part Payment",
      amount: "$3,500.00",
      date: "07 June 2025",
    },
    {
      id: 2,
      careSeeker: "Michael Smith",
      caregiver: "Jessica Liu",
      paymentType: "Part Payment",
      amount: "$7,000.00",
      date: "04 June 2025",
    },
    {
      id: 3,
      careSeeker: "Sarah Johnson",
      caregiver: "Robert Brown",
      paymentType: "Full Payment",
      amount: "$7,000.00",
      date: "04 June 2025",
    },
    {
      id: 4,
      careSeeker: "Emily Davis",
      caregiver: "Michael Smith",
      paymentType: "Full Payment",
      amount: "$25,000.00",
      date: "03 June 2025",
    },
    {
      id: 5,
      careSeeker: "Anna Lee",
      caregiver: "David Wilson",
      paymentType: "Full Payment",
      amount: "$27,000.00",
      date: "28 May 2025",
    },
    {
      id: 6,
      careSeeker: "Laura Green",
      caregiver: "James Taylor",
      paymentType: "Full Payment",
      amount: "$50,000.00",
      date: "28 May 2025",
    },
    {
      id: 7,
      careSeeker: "Jessica White",
      caregiver: "Chris Jones",
      paymentType: "Part Payment",
      amount: "$15,000.00",
      date: "28 May 2025",
    },
    {
      id: 8,
      careSeeker: "Linda Harris",
      caregiver: "Paul Martin",
      paymentType: "Full Payment",
      amount: "$10,000.00",
      date: "25 May 2025",
    },
    {
      id: 9,
      careSeeker: "Sofia Clark",
      caregiver: "Daniel Walker",
      paymentType: "Part Payment",
      amount: "$8,000.00",
      date: "25 May 2025",
    },
    {
      id: 10,
      careSeeker: "Megan Lewis",
      caregiver: "Matthew Hall",
      paymentType: "Full Payment",
      amount: "$26,000.00",
      date: "24 May 2025",
    },
    {
      id: 11,
      careSeeker: "Olivia Young",
      caregiver: "Anthony Allen",
      paymentType: "Full Payment",
      amount: "$27,000.00",
      date: "24 May 2025",
    },
    {
      id: 12,
      careSeeker: "Rachel Moore",
      caregiver: "Kevin Lee",
      paymentType: "Part Payment",
      amount: "$12,000.00",
      date: "23 May 2025",
    },
    {
      id: 13,
      careSeeker: "Amanda Turner",
      caregiver: "Brian Clark",
      paymentType: "Full Payment",
      amount: "$18,000.00",
      date: "22 May 2025",
    },
    {
      id: 14,
      careSeeker: "Jennifer Adams",
      caregiver: "Steven White",
      paymentType: "Part Payment",
      amount: "$9,500.00",
      date: "21 May 2025",
    },
    {
      id: 15,
      careSeeker: "Nicole Garcia",
      caregiver: "Timothy Brown",
      paymentType: "Full Payment",
      amount: "$22,000.00",
      date: "20 May 2025",
    },
    {
      id: 16,
      careSeeker: "Stephanie Martinez",
      caregiver: "Christopher Davis",
      paymentType: "Part Payment",
      amount: "$14,000.00",
      date: "19 May 2025",
    },
    {
      id: 17,
      careSeeker: "Elizabeth Taylor",
      caregiver: "Andrew Wilson",
      paymentType: "Full Payment",
      amount: "$31,000.00",
      date: "18 May 2025",
    },
    {
      id: 18,
      careSeeker: "Michelle Anderson",
      caregiver: "Joshua Johnson",
      paymentType: "Part Payment",
      amount: "$11,500.00",
      date: "17 May 2025",
    },
    {
      id: 19,
      careSeeker: "Kimberly Thomas",
      caregiver: "Ryan Miller",
      paymentType: "Full Payment",
      amount: "$19,000.00",
      date: "16 May 2025",
    },
    {
      id: 20,
      careSeeker: "Ashley Jackson",
      caregiver: "Nathan Garcia",
      paymentType: "Part Payment",
      amount: "$13,000.00",
      date: "15 May 2025",
    },
  ];

  // Transaction details data for the modal
  const getTransactionDetails = (
    paymentId: number
  ): TransactionDetails | null => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    return {
      id: payment.id,
      paymentType: payment.paymentType,
      careSeeker: {
        name: payment.careSeeker,
        avatar: undefined, // Using initials for now
      },
      caregiver: {
        name: payment.caregiver,
        avatar: undefined, // Using initials for now
      },
      date: payment.date,
      time: "11:23:30 am", // Mock time
      services: [
        {
          duration: "3 months",
          careType: "Senior Care",
          rate: "$40 / hour",
          hoursEstimated: "85 hours",
          shiftAmount: "$3,400",
        },
      ],
      subTotal: "$3,400.00",
      tendalyFee: "$50.00",
      totalTax: "$50.00",
      totalAmount: payment.amount,
    };
  };

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
    if (checked) {
      setSelectedPayments(payments.map((payment) => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId: number, checked: boolean) => {
    if (checked) {
      setSelectedPayments((prev) => [...prev, paymentId]);
    } else {
      setSelectedPayments((prev) => prev.filter((id) => id !== paymentId));
    }
  };

  const handleActionClick = (paymentId: number) => {
    setOpenDropdown(openDropdown === paymentId ? null : paymentId);
  };

  const handleViewDetails = (paymentId: number) => {
    const transactionDetails = getTransactionDetails(paymentId);
    if (transactionDetails) {
      setSelectedTransaction(transactionDetails);
      setIsTransactionDetailsModalOpen(true);
      setOpenDropdown(null);
    }
  };

  const totalPages = Math.ceil(totalPayments / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalPayments);

  return (
    <div className="flex h-screen bg-gray-50 font-nunito" ref={dropdownRef}>
      <Sidebar activePage="Revenue" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue this week
                </p>
                <p className="text-2xl font-bold text-gray-900">$950,500.00</p>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
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
                  <span className="text-sm text-green-600">
                    +$1,000 more revenue than last week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Net Profit */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Net Profit this week
                </p>
                <p className="text-2xl font-bold text-gray-900">$10,500.00</p>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
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
                  <span className="text-sm text-red-600">
                    -$100 less revenue than last week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Escrow Funds */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Escrow Funds
                </p>
                <p className="text-2xl font-bold text-gray-900">$100,500.00</p>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
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
                  <span className="text-sm text-green-600">
                    +$5000 more than last week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("Payments")}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "Payments"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab("Withdrawals")}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "Withdrawals"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Withdrawals
            </button>
            <button
              onClick={() => setActiveTab("Escrow")}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "Escrow"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Escrow
            </button>
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
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span>Sort</span>
            </button>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Pagination Summary and Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-700">
            Showing {startItem}-{endItem} of {totalPayments}
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPayments.length === payments.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Care Seeker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Caregiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={(e) =>
                          handleSelectPayment(payment.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.careSeeker}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.caregiver}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {payment.paymentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() => handleActionClick(payment.id)}
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
                        {openDropdown === payment.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(payment.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit Payment
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
                                Send Receipt
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

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          isOpen={isTransactionDetailsModalOpen}
          onClose={() => {
            setIsTransactionDetailsModalOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default RevenuePage;
