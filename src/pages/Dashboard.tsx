import Sidebar from "../components/Sidebar";

const Dashboard = () => {
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
                JD
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
              <p className="text-3xl font-bold text-gray-900 mb-2">3,000</p>
              <div className="flex items-center text-green-600 text-sm">
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
                +120 New Caregivers this week
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Bookings
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">540</p>
              <div className="flex items-center text-red-600 text-sm">
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
                -50 New Bookings this week
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                $18,599.00
              </p>
              <div className="flex items-center text-green-600 text-sm">
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
                +$110 Increase in revenue this week
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
                <p className="text-3xl font-bold text-gray-900 mb-2">4,500</p>
                <div className="flex items-center text-green-600 text-sm">
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
                  +150 new users
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Active Users
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">2,450</p>
                <div className="flex items-center text-red-600 text-sm">
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
                  -25 Less active users
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Deactivated Accounts
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">50</p>
                <div className="flex items-center text-gray-600 text-sm">
                  +0 Deactivated accounts
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
                  {/* Donut Chart Placeholder */}
                  <div className="w-full h-full rounded-full border-8 border-blue-500 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        4,500
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
                          2,500 Caregivers
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          2,000 Careseekers
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
