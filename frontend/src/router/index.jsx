import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home/Home';
import FloorsOverview from '../pages/FloorsOverview/FloorsOverview';
import FloorB2 from '../pages/Floors/FloorB2';
import FloorB1 from '../pages/Floors/FloorB1';
import Floor0 from '../pages/Floors/Floor0';
import Floor1 from '../pages/Floors/Floor1';
import Floor2 from '../pages/Floors/Floor2';
import Floor3 from '../pages/Floors/Floor3';
import Floor4 from '../pages/Floors/Floor4';
import Floor5 from '../pages/Floors/Floor5';
import Floor6 from '../pages/Floors/Floor6';
import Floor7 from '../pages/Floors/Floor7';
import Floor8 from '../pages/Floors/Floor8';
import Floor9 from '../pages/Floors/Floor9';
import Floor10 from '../pages/Floors/Floor10';
import Floor11 from '../pages/Floors/Floor11';
import Rooms from '../pages/Rooms/Rooms';
import Suites from '../pages/Suites/Suites';
import SuiteDetail from '../pages/Suites/SuiteDetail';
import Services from '../pages/Services/Services';
import Booking from '../pages/Booking/Booking';
import BookingConfirm from '../pages/Booking/BookingConfirm';
import BookingSuccess from '../pages/Booking/BookingSuccess';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AccessEntry from '../pages/Auth/AccessEntry';
import GuestNewLogin from '../pages/Auth/GuestNewLogin';
import GuestReturningLogin from '../pages/Auth/GuestReturningLogin';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import StaffLogin from '../pages/Auth/StaffLogin';
import StaffRoleSelection from '../pages/Auth/StaffRoleSelection';
import StaffDepartmentLogin from '../pages/Auth/StaffDepartmentLogin';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ServiceDetails from '../pages/ServiceDetails/ServiceDetails';
import RoomDetails from '../pages/RoomDetails/RoomDetails';
import Restaurant from '../pages/Restaurant/Restaurant';
import PremiumServices from '../pages/PremiumServices/PremiumServices';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import FAQs from '../pages/FAQs/FAQs';
import Terms from '../pages/Terms/Terms';
import Privacy from '../pages/Privacy/Privacy';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminAIAnalytics from '../pages/Admin/AdminAIAnalytics';
import Market from '../pages/Market/Market';
import LuxuryVIP from '../pages/LuxuryVIP/LuxuryVIP';

// Service pages
import ServicesIndex from '../pages/Services/ServicesIndex';
import SpaService from '../pages/Services/SpaService';
import GymService from '../pages/Services/GymService';
import PoolService from '../pages/Services/PoolService';
import DriverService from '../pages/Services/DriverService';
import ButlerService from '../pages/Services/ButlerService';

// User profile pages (within MainLayout - not isolated)
import UserProfile from '../pages/User/UserProfile';
import UserBookings from '../pages/User/UserBookings';
import UserOrders from '../pages/User/UserOrders';

const AppRouter = () => {
  return (
    <Routes>
      {/* ADMIN ROUTES - Completely separate from main website, external URL access only */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/ai-analytics" element={<AdminAIAnalytics />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminLogin />} />
      
      {/* AUTH ROUTES — standalone full-page, no navbar */}
      <Route path="/login"                  element={<Login />} />
      <Route path="/register"               element={<Register />} />
      <Route path="/auth/guest/new"         element={<GuestNewLogin />} />
      <Route path="/auth/guest/returning"   element={<GuestReturningLogin />} />
      <Route path="/forgot-password"        element={<ForgotPassword />} />

      {/* STAFF ROUTES - Completely separate from main website, external URL access only */}
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff/role-selection" element={<StaffRoleSelection />} />
      <Route path="/staff/:department" element={<StaffDepartmentLogin />} />
      
      {/* MAIN WEBSITE - Everything accessible to everyone, login just changes navbar state */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="floors" element={<FloorsOverview />} />
        <Route path="floors/b2" element={<FloorB2 />} />
        <Route path="floors/b1" element={<FloorB1 />} />
        <Route path="floors/0" element={<Floor0 />} />
        <Route path="floors/1" element={<Floor1 />} />
        <Route path="floors/2" element={<Floor2 />} />
        <Route path="floors/3" element={<Floor3 />} />
        <Route path="floors/4" element={<Floor4 />} />
        <Route path="floors/5" element={<Floor5 />} />
        <Route path="floors/6" element={<Floor6 />} />
        <Route path="floors/7" element={<Floor7 />} />
        <Route path="floors/8" element={<Floor8 />} />
        <Route path="floors/9" element={<Floor9 />} />
        <Route path="floors/10" element={<Floor10 />} />
        <Route path="floors/11" element={<Floor11 />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="suites" element={<Suites />} />
        <Route path="suites/:suiteId" element={<SuiteDetail />} />
        <Route path="services" element={<ServicesIndex />} />
        <Route path="services/spa" element={<SpaService />} />
        <Route path="services/gym" element={<GymService />} />
        <Route path="services/pool" element={<PoolService />} />
        <Route path="services/driver" element={<DriverService />} />
        <Route path="services/butler" element={<ButlerService />} />
        <Route path="services/:serviceId" element={<ServiceDetails />} />
        <Route path="premium-services" element={<PremiumServices />} />
        <Route path="luxury-vip" element={<LuxuryVIP />} />
        <Route path="rooms/:roomId" element={<RoomDetails />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="market" element={<Market />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking-confirm" element={<BookingConfirm />} />
        <Route path="booking-success" element={<BookingSuccess />} />
        
        {/* Role selection (within MainLayout so navbar is visible) */}
        <Route path="access" element={<AccessEntry />} />
        
        {/* USER PROFILE PAGES - Within MainLayout, NOT isolated */}
        <Route path="profile" element={<UserProfile />} />
        <Route path="my-bookings" element={<UserBookings />} />
        <Route path="my-orders" element={<UserOrders />} />
      </Route>

    </Routes>
  );
};

export default AppRouter;
