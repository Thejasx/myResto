import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './router/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';

// Owner Pages
import OwnerSignupPage from './pages/owner/OwnerSignupPage';
import OwnerLoginPage from './pages/owner/OwnerLoginPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import RestaurantFormPage from './pages/owner/RestaurantFormPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="search-results" element={<SearchResultsPage />} />

        {/* Guest only */}
        <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

        {/* Customer protected */}
        <Route path="my-bookings" element={<ProtectedRoute roles={['customer']}><MyBookingsPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>

      {/* Owner */}
      <Route path="/owner/signup" element={<GuestRoute><OwnerSignupPage /></GuestRoute>} />
      <Route path="/owner/login" element={<GuestRoute><OwnerLoginPage /></GuestRoute>} />
      <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboardPage /></ProtectedRoute>} />
      <Route path="/owner/restaurant/new" element={<ProtectedRoute roles={['owner']}><RestaurantFormPage /></ProtectedRoute>} />
      <Route path="/owner/restaurant/edit/:id" element={<ProtectedRoute roles={['owner']}><RestaurantFormPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/login" element={<GuestRoute><AdminLoginPage /></GuestRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
