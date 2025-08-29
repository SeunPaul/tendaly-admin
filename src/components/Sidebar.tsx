import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/illustration/logo.png";

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    { name: "Dashboard", icon: "grid", path: "/dashboard" },
    { name: "Care givers", icon: "person", path: "/care-givers" },
    { name: "Care seekers", icon: "person", path: "/care-seekers" },
    { name: "Bookings", icon: "calendar", path: "/bookings" },
    { name: "Revenue", icon: "dollar", path: "/revenue" },
    { name: "Reviews & Disputes", icon: "chat", path: "/reviews" },
  ];

  const adminItems = [
    { name: "Manage Admins", icon: "person", path: "/manage-admins" },
    { name: "Settings", icon: "gear", path: "/settings" },
    {
      name: "Logout",
      icon: "logout",
      action: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "grid":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        );
      case "person":
        return (
          <svg
            className="w-5 h-5"
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
        );
      case "calendar":
        return (
          <svg
            className="w-5 h-5"
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
        );
      case "dollar":
        return (
          <svg
            className="w-5 h-5"
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
        );
      case "chat":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        );
      case "gear":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "logout":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      {/* Logo and Menu */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Tendaly Logo" className="h-8" />
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <svg
              className="w-5 h-5"
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
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activePage === item.name
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {getIcon(item.icon)}
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Section */}
      <div className="mt-8 p-4 border-t border-gray-200">
        <ul className="space-y-2">
          {adminItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activePage === item.name
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {getIcon(item.icon)}
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
