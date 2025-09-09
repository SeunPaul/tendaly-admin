import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { dashboardService, type DashboardData } from "../services";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await dashboardService.getDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getChangeColor = (changeType: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = (changeType: "positive" | "negative" | "neutral") => {
    if (changeType === "positive") {
      return (
        <svg
          className="w-4 h-4 mr-1"
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
      );
    } else if (changeType === "negative") {
      return (
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      );
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 font-nunito">
        <Sidebar activePage="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 font-nunito">
        <Sidebar activePage="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex h-screen bg-gray-50 font-nunito">
        <Sidebar activePage="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No dashboard data available</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50 font-nunito">
      <Sidebar activePage="Dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Top Row Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Caregivers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Caregivers
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData.totalCaregivers.value.toLocaleString()}
              </p>
              <div
                className={`flex items-center text-sm ${getChangeColor(
                  dashboardData.totalCaregivers.changeType
                )}`}
              >
                {getChangeIcon(dashboardData.totalCaregivers.changeType)}
                {dashboardData.totalCaregivers.change}
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Bookings
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData.bookings.value.toLocaleString()}
              </p>
              <div
                className={`flex items-center text-sm ${getChangeColor(
                  dashboardData.bookings.changeType
                )}`}
              >
                {getChangeIcon(dashboardData.bookings.changeType)}
                {dashboardData.bookings.change}
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(dashboardData.totalRevenue.value)}
              </p>
              <div
                className={`flex items-center text-sm ${getChangeColor(
                  dashboardData.totalRevenue.changeType
                )}`}
              >
                {getChangeIcon(dashboardData.totalRevenue.changeType)}
                {dashboardData.totalRevenue.change}
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - User Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {dashboardData.totalUsers.value.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-sm ${getChangeColor(
                    dashboardData.totalUsers.changeType
                  )}`}
                >
                  {getChangeIcon(dashboardData.totalUsers.changeType)}
                  {dashboardData.totalUsers.change}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Active Users
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {dashboardData.activeUsers.value.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-sm ${getChangeColor(
                    dashboardData.activeUsers.changeType
                  )}`}
                >
                  {getChangeIcon(dashboardData.activeUsers.changeType)}
                  {dashboardData.activeUsers.change}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Deactivated Accounts
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {dashboardData.deactivatedAccounts.value.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-sm ${getChangeColor(
                    dashboardData.deactivatedAccounts.changeType
                  )}`}
                >
                  {getChangeIcon(dashboardData.deactivatedAccounts.changeType)}
                  {dashboardData.deactivatedAccounts.change}
                </div>
              </div>
            </div>

            {/* Right Column - Donut Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                User Type Distribution
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Dynamic Donut Chart */}
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {/* Caregivers segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${
                        (dashboardData.userTypeDistribution.caregivers /
                          dashboardData.userTypeDistribution.totalUsers) *
                        251.2
                      } 251.2`}
                      strokeDashoffset="0"
                    />
                    {/* Care seekers segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="8"
                      strokeDasharray={`${
                        (dashboardData.userTypeDistribution.careseekers /
                          dashboardData.userTypeDistribution.totalUsers) *
                        251.2
                      } 251.2`}
                      strokeDashoffset={`-${
                        (dashboardData.userTypeDistribution.caregivers /
                          dashboardData.userTypeDistribution.totalUsers) *
                        251.2
                      }`}
                    />
                  </svg>
                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {dashboardData.userTypeDistribution.totalUsers.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                  </div>
                  {/* Chart Legend */}
                  <div className="absolute -bottom-16 left-0 right-0">
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {dashboardData.userTypeDistribution.caregivers.toLocaleString()}{" "}
                          Caregivers
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {dashboardData.userTypeDistribution.careseekers.toLocaleString()}{" "}
                          Careseekers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
