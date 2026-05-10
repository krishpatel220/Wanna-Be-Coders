import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import OnboardingScreen from './pages/OnboardingScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import HomePage from './pages/HomePage';
import TripDetailScreen from './pages/TripDetailScreen';
import CreateTripScreen from './pages/CreateTripScreen';
import MyTripsScreen from './pages/MyTripsScreen';
import ExploreScreen from './pages/ExploreScreen';
import SavedScreen from './pages/SavedScreen';
import ItineraryBuilderScreen from './pages/ItineraryBuilderScreen';
import ItineraryViewScreen from './pages/ItineraryViewScreen';
import BudgetScreen from './pages/BudgetScreen';
import PackingScreen from './pages/PackingScreen';
import JournalScreen from './pages/JournalScreen';
import ProfileScreen from './pages/ProfileScreen';
import NotificationsScreen from './pages/NotificationsScreen';

export default function App() {
  return (
    <Routes>
      {/* Entry → Onboarding */}
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />

      {/* Welcome */}
      <Route path="/welcome" element={<WelcomeScreen />} />

      {/* Auth (public) */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />

      {/* Protected routes — require auth */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute><TripDetailScreen /></ProtectedRoute>} />
      <Route path="/create-trip" element={<ProtectedRoute><CreateTripScreen /></ProtectedRoute>} />
      <Route path="/my-trips" element={<ProtectedRoute><MyTripsScreen /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><ExploreScreen /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><SavedScreen /></ProtectedRoute>} />
      <Route path="/itinerary-builder" element={<ProtectedRoute><ItineraryBuilderScreen /></ProtectedRoute>} />
      <Route path="/itinerary-view" element={<ProtectedRoute><ItineraryViewScreen /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><BudgetScreen /></ProtectedRoute>} />
      <Route path="/packing" element={<ProtectedRoute><PackingScreen /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><JournalScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}
