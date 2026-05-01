import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('myrestoUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('myrestoUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const ownerSignup = (data) => API.post('/auth/owner/signup', data);
export const ownerLogin = (data) => API.post('/auth/owner/login', data);
export const adminLogin = (data) => API.post('/auth/admin/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── Restaurants ────────────────────────────────────────────────────────────
export const getRestaurants = (params) => API.get('/restaurants', { params });
export const searchRestaurants = (params) => API.get('/restaurants/search', { params });
export const getRestaurant = (id) => API.get(`/restaurants/${id}`);
export const getFeaturedRestaurants = () => API.get('/restaurants/featured');
export const getPopularCities = () => API.get('/restaurants/cities');
export const getOwnerRestaurant = () => API.get('/restaurants/owner/mine');
export const createRestaurant = (data) => API.post('/restaurants', data);
export const updateRestaurant = (id, data) => API.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => API.delete(`/restaurants/${id}`);

// ─── Menu ───────────────────────────────────────────────────────────────────
export const getMenu = (restaurantId) => API.get(`/menus/${restaurantId}`);
export const addMenuItem = (data) => API.post('/menus', data);
export const updateMenuItem = (id, data) => API.put(`/menus/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menus/${id}`);

// ─── Bookings ────────────────────────────────────────────────────────────────
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const getRestaurantBookings = () => API.get('/bookings/restaurant');
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status });

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const getAllOwners = () => API.get('/admin/owners');
export const getAllRestaurantsAdmin = (params) => API.get('/admin/restaurants', { params });
export const getAllBookingsAdmin = () => API.get('/admin/bookings');
export const approveRestaurant = (id) => API.put(`/admin/restaurants/${id}/approve`);
export const rejectRestaurant = (id) => API.put(`/admin/restaurants/${id}/reject`);
export const deleteRestaurantAdmin = (id) => API.delete(`/admin/restaurants/${id}`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const deleteOwner = (id) => API.delete(`/admin/owners/${id}`);
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/toggle`);

export default API;
