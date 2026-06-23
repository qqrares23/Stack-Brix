import { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopBar } from './components/layout/TopBar';
import { useTheme } from './hooks/useTheme';
import { useAdmin } from './hooks/useAdmin';
import HubPage from './pages/HubPage';
import DocsPage from './pages/DocsPage';
import EditorPage from './pages/EditorPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

type AdminState = ReturnType<typeof useAdmin>;

// Shared admin context so EditorPage can enqueue into AdminPage's state.
export const AdminContext = createContext<AdminState | null>(null);
export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminContext must be used inside App');
  return ctx;
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const admin = useAdmin();

  return (
    <BrowserRouter>
      <AdminContext.Provider value={admin}>
        <div
          data-theme={theme}
          style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .25s ease, color .25s ease', WebkitFontSmoothing: 'antialiased' }}
        >
          <TopBar theme={theme} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<HubPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AdminContext.Provider>
    </BrowserRouter>
  );
}
