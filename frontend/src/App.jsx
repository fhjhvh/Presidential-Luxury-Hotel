import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast/Toast';
import AppRouter from './router';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import './styles/global.css';
import './styles/responsive.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <ToastProvider>
            <AppErrorBoundary>
              <AppRouter />
            </AppErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
