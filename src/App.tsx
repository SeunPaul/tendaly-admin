import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CaregiversPage from "./pages/CaregiversPage";
import CareSeekersPage from "./pages/CareSeekersPage";
import BookingsPage from "./pages/BookingsPage";
import RevenuePage from "./pages/RevenuePage";
import ReviewsDisputesPage from "./pages/ReviewsDisputesPage";
import SettingsPage from "./pages/SettingsPage";
import ManageAdminsPage from "./pages/ManageAdminsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/care-givers"
            element={
              <ProtectedRoute>
                <CaregiversPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/care-seekers"
            element={
              <ProtectedRoute>
                <CareSeekersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue"
            element={
              <ProtectedRoute>
                <RevenuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewsDisputesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-admins"
            element={
              <ProtectedRoute>
                <ManageAdminsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
