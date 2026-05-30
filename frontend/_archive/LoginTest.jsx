import React from 'react';
import { Link } from 'react-router-dom';
import './LoginTest.css';

const LoginTest = () => {
  const routes = [
    { path: '/login', name: 'Role Selection (AccessEntry)', description: 'Main login page with 4 role cards' },
    { path: '/auth/guest/new', name: 'First-Time Guest', description: 'New guest registration with 20% discount' },
    { path: '/auth/guest/returning', name: 'Returning Guest', description: 'Returning guest login with 10% loyalty' },
    { path: '/auth/staff/login', name: 'Staff (Redirect)', description: 'Auto-redirects to role selection' },
    { path: '/auth/staff/role-selection', name: 'Staff Role Selection', description: '6 department choices' },
    { path: '/auth/staff/cleaning', name: 'Cleaning Staff Login', description: 'Housekeeping login' },
    { path: '/auth/staff/maintenance', name: 'Maintenance Staff Login', description: 'Technical services login' },
    { path: '/auth/staff/kitchen', name: 'Kitchen Staff Login', description: 'Culinary login' },
    { path: '/auth/staff/club', name: 'Club Staff Login', description: 'Recreation login' },
    { path: '/auth/staff/security', name: 'Security Staff Login', description: 'Security login' },
    { path: '/auth/staff/nurse', name: 'Medical Nurse Login', description: 'Medical login' },
    { path: '/auth/admin/login', name: 'Admin Login', description: 'Administrator control panel' },
    { path: '/dashboard/guest', name: 'Guest Dashboard', description: 'Personalized guest dashboard' },
    { path: '/dashboard/staff/cleaning', name: 'Cleaning Staff Dashboard', description: 'Work schedule for housekeeping' },
    { path: '/dashboard/staff/maintenance', name: 'Maintenance Dashboard', description: 'Work schedule for maintenance' },
    { path: '/dashboard/admin', name: 'Admin Dashboard', description: 'Administrative control panel' },
    { path: '/dashboard/profile', name: 'Profile Page', description: 'User profile management' }
  ];

  return (
    <div className="login-test">
      <div className="login-test__header">
        <h1>🧪 Login System Test Page</h1>
        <p>Test all authentication routes and flows</p>
      </div>

      <div className="login-test__grid">
        {routes.map((route, idx) => (
          <Link key={idx} to={route.path} className="test-card">
            <div className="test-card__number">{idx + 1}</div>
            <h3 className="test-card__name">{route.name}</h3>
            <p className="test-card__description">{route.description}</p>
            <div className="test-card__path">{route.path}</div>
            <div className="test-card__arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="login-test__instructions">
        <h2>Testing Instructions</h2>
        <ol>
          <li><strong>Test Role Selection:</strong> Click "Role Selection" above</li>
          <li><strong>Test Guest Login:</strong> Fill any form with test data (e.g., name: "Test", email: "test@test.com", password: "test123")</li>
          <li><strong>Test Staff Login:</strong> Use any Staff ID and PIN (e.g., ID: "STAFF001", PIN: "1234")</li>
          <li><strong>Test Admin Login:</strong> Use any username/password (e.g., username: "admin", password: "admin123")</li>
          <li><strong>Verify Success Modal:</strong> Check that popup appears after login</li>
          <li><strong>Verify Redirect:</strong> Check that you're redirected to the correct dashboard</li>
          <li><strong>Test Profile:</strong> Click profile link to verify user data is saved</li>
        </ol>
      </div>
    </div>
  );
};

export default LoginTest;
