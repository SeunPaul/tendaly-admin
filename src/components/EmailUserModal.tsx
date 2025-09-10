import { useState } from "react";
import Modal from "./Modal";
import { emailService } from "../services";

interface EmailUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    email: string;
    profileImage?: string;
  };
  onEmailSent?: () => void;
}

const EmailUserModal: React.FC<EmailUserModalProps> = ({
  isOpen,
  onClose,
  recipient,
  onEmailSent,
}) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      setError("Please fill in both subject and content");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await emailService.sendEmail({
        recipient_email: recipient.email,
        title: subject,
        body: content,
      });

      if (response.success) {
        // Reset form
        setSubject("");
        setContent("");

        // Call callback if provided
        if (onEmailSent) {
          onEmailSent();
        }

        onClose();
      } else {
        setError(response.message || "Failed to send email");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      setError("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSubject("");
    setContent("");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Email User
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <span className="text-sm text-blue-600">({recipient.email})</span>
            </div>
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
            Email Body (HTML)
          </label>

          {/* Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center space-x-1">
            {/* Bold */}
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<strong>${selectedText}</strong>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="p-2 hover:bg-gray-200 rounded font-bold"
              title="Bold"
            >
              B
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<em>${selectedText}</em>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="p-2 hover:bg-gray-200 rounded italic"
              title="Italic"
            >
              I
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<u>${selectedText}</u>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="p-2 hover:bg-gray-200 rounded underline"
              title="Underline"
            >
              U
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Headings */}
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<h1>${selectedText}</h1>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<h2>${selectedText}</h2>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded"
              title="Heading 2"
            >
              H2
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Paragraph */}
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<p>${selectedText}</p>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded"
              title="Paragraph"
            >
              P
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Lists */}
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<ul><li>${selectedText}</li></ul>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="p-2 hover:bg-gray-200 rounded"
              title="Bullet List"
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                const textarea = document.getElementById(
                  "email-body"
                ) as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = content.substring(start, end);
                const newText =
                  content.substring(0, start) +
                  `<ol><li>${selectedText}</li></ol>` +
                  content.substring(end);
                setContent(newText);
              }}
              className="p-2 hover:bg-gray-200 rounded"
              title="Numbered List"
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Link */}
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter URL:");
                if (url) {
                  const textarea = document.getElementById(
                    "email-body"
                  ) as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = content.substring(start, end);
                  const linkText = selectedText || url;
                  const newText =
                    content.substring(0, start) +
                    `<a href="${url}">${linkText}</a>` +
                    content.substring(end);
                  setContent(newText);
                }
              }}
              className="p-2 hover:bg-gray-200 rounded"
              title="Insert Link"
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
          </div>

          {/* Text Area */}
          <textarea
            id="email-body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your email content here. Use the toolbar above to format text with HTML."
            className="w-full h-64 p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
          />

          {/* HTML Preview */}
          {content && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview:
              </label>
              <div
                className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-20"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel & Discard changes
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? "Sending..." : "Send Email"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailUserModal;
