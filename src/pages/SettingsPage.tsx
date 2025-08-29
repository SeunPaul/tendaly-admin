import { useState } from "react";
import Sidebar from "../components/Sidebar";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Manage Profile");
  const [profileData, setProfileData] = useState({
    firstName: "James",
    lastName: "Doe",
    email: "johndoe@tendaly.com",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Handle profile save logic
    console.log("Profile saved:", profileData);
  };

  const handleSavePassword = () => {
    // Handle password save logic
    console.log("Password saved:", passwordData);
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "retype":
        setShowRetypePassword(!showRetypePassword);
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-nunito">
      <Sidebar activePage="Settings" />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("Manage Profile")}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "Manage Profile"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Manage Profile
          </button>
          <button
            onClick={() => setActiveTab("Password Settings")}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "Password Settings"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Password Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "Manage Profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - User Information Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Right Column - Profile Picture Management */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Picture
              </h3>

              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-gray-200 mx-auto mb-4">
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </span>
                  </div>
                </div>

                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  Upload new image
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Password Settings" && (
          <div className="max-w-md">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Current password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      placeholder="New password"
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="retypePassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Retype password
                  </label>
                  <div className="relative">
                    <input
                      type={showRetypePassword ? "text" : "password"}
                      id="retypePassword"
                      value={passwordData.retypePassword}
                      onChange={(e) =>
                        handlePasswordChange("retypePassword", e.target.value)
                      }
                      placeholder="Retype password"
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("retype")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showRetypePassword ? (
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSavePassword}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
