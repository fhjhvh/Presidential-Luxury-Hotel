import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Single fixed luxury theme — no switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'luxury');
    localStorage.setItem('plhms-theme', 'luxury');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'luxury', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};
