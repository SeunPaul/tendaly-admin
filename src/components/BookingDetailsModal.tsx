import Modal from "./Modal";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
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
    status: string;
    amount: string;
    date: string;
    checkIn: string;
    checkOut: string;
    location: string;
  };
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const handleCollapse = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
        </div>

        {/* User Profiles */}
        <div className="flex items-center justify-between mb-4">
          {/* Caregiver */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
              {booking.caregiver.avatar ? (
                <img
                  src={booking.caregiver.avatar}
                  alt={booking.caregiver.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {booking.caregiver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Caregiver</p>
              <p className="text-xs font-semibold text-gray-900">
                {booking.caregiver.name}
              </p>
            </div>
          </div>

          {/* Care Seeker */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
              {booking.careSeeker.avatar ? (
                <img
                  src={booking.careSeeker.avatar}
                  alt={booking.careSeeker.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">
                    {booking.careSeeker.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Care Seeker</p>
              <p className="text-xs font-semibold text-gray-900">
                {booking.careSeeker.name}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="space-y-2 mb-4">
          {/* Care Type */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Care Type:</span>
            <span className="text-xs font-medium text-gray-900">
              {booking.careType}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-green-600"
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
            </div>
            <span className="text-xs text-gray-600">Status:</span>
            <span className="text-xs font-medium text-green-600">
              {booking.status}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Amount:</span>
            <span className="text-xs font-medium text-gray-900">
              {booking.amount}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Date:</span>
            <span className="text-xs font-medium text-gray-900">
              {booking.date}
            </span>
          </div>

          {/* Check-in */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Check-in:</span>
            <span className="text-xs font-medium text-gray-900">
              {booking.checkIn}
            </span>
          </div>

          {/* Check-out */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Check-out:</span>
            <span className="text-xs font-medium text-gray-900">
              {booking.checkOut}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Location:</span>
            <span className="text-xs font-medium text-gray-900">
              {booking.location}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCollapse}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
          >
            Collapse
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
