import Modal from "./Modal";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
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
  };
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const handleDone = () => {
    onClose();
  };

  const handleRefundCareSeeker = () => {
    console.log("Refund Care Seeker clicked for transaction:", transaction.id);
  };

  const handleViewProfile = (type: "careSeeker" | "caregiver") => {
    console.log(`View ${type} profile:`, transaction[type].name);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Transaction Overview */}
          <div className="space-y-6 lg:col-span-1">
            {/* Payment Type */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Payment Type
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {transaction.paymentType}
                </span>
              </div>
            </div>

            {/* Care Seeker */}
            <div className="border-b border-gray-200 pb-4">
              <span className="text-sm font-medium text-gray-600 block mb-3">
                Care Seeker
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
                  {transaction.careSeeker.avatar ? (
                    <img
                      src={transaction.careSeeker.avatar}
                      alt={transaction.careSeeker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {transaction.careSeeker.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {transaction.careSeeker.name}
                  </div>
                  <button
                    onClick={() => handleViewProfile("careSeeker")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Caregiver */}
            <div className="border-b border-gray-200 pb-4">
              <span className="text-sm font-medium text-gray-600 block mb-3">
                Caregiver
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                  {transaction.caregiver.avatar ? (
                    <img
                      src={transaction.caregiver.avatar}
                      alt={transaction.caregiver.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">
                        {transaction.caregiver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {transaction.caregiver.name}
                  </div>
                  <button
                    onClick={() => handleViewProfile("caregiver")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Date</span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {transaction.date}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.time}
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Button */}
            <div className="pt-4">
              <button
                onClick={handleRefundCareSeeker}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refund Care Seeker</span>
              </button>
            </div>
          </div>

          {/* Right Section - Service Breakdown and Financial Summary */}
          <div className="space-y-6 lg:col-span-2">
            {/* Service Details Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Service Details
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Care Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Hours Estimated
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Shift Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {transaction.services.map((service, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {service.duration}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {service.careType}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {service.rate}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {service.hoursEstimated}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {service.shiftAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sub Total</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.subTotal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tendaly Fee</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.tendalyFee}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tax</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.totalTax}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {transaction.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleDone}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
