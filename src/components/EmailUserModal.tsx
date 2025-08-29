import { useState } from "react";
import Modal from "./Modal";

interface EmailUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    email: string;
    profileImage?: string;
  };
}

const EmailUserModal: React.FC<EmailUserModalProps> = ({
  isOpen,
  onClose,
  recipient,
}) => {
  const [subject, setSubject] = useState("Welcome to Tendaly");
  const [content, setContent] = useState("");

  const handleSendEmail = () => {
    console.log("Sending email to:", recipient.email);
    console.log("Subject:", subject);
    console.log("Content:", content);
    onClose();
  };

  const handleCancel = () => {
    setSubject("Welcome to Tendaly");
    setContent("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Email User</h2>
        </div>

        {/* Recipient Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To:
          </label>
          <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {recipient.profileImage ? (
                  <img
                    src={recipient.profileImage}
                    alt={recipient.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  recipient.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-blue-800">
                {recipient.name}
              </span>
              <button className="text-blue-600 hover:text-blue-800">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Type a name or e-mail address"
              className="flex-1 border-none bg-transparent focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Subject Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rich Text
          </label>

          {/* Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center space-x-1">
            {/* Undo/Redo */}
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M21 14h-10a8 8 0 01-8-8v-2M21 14l-6-6m6 6l-6 6"
                />
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Headings */}
            <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">
              H1
            </button>
            <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">
              H2
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Text Styling */}
            <button className="p-2 hover:bg-gray-200 rounded font-bold">
              B
            </button>
            <button className="p-2 hover:bg-gray-200 rounded underline">
              U
            </button>
            <button className="p-2 hover:bg-gray-200 rounded italic">I</button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Text Alignment */}
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M4 6h16M4 12h8M4 18h8"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M4 6h16M4 12h12M4 18h12"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Lists */}
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Media */}
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Text Hint"
            className="w-full h-64 p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel & Discard changes
          </button>
          <button
            onClick={handleSendEmail}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Email
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailUserModal;
