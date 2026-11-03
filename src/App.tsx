import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { SportsSelection } from './pages/SportsSelection';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { Analytics } from './pages/Analytics';
import { InjuryRisk } from './pages/InjuryRisk';
import { SessionHistory } from './pages/SessionHistory';
import { Settings } from './pages/Settings';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'landing':
        return <Landing />;
      case 'dashboard':
        return <Dashboard />;
      case 'sports-selection':
        return <SportsSelection />;
      case 'live-monitoring':
        return <LiveMonitoring />;
      case 'analytics':
        return <Analytics />;
      case 'injury-risk':
        return <InjuryRisk />;
      case 'history':
        return <SessionHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <Login />;
    }
  };

  if (currentPage === 'login' || currentPage === 'landing') {
    return <ErrorBoundary>{renderPage()}</ErrorBoundary>;
  }

  return <MainLayout><ErrorBoundary>{renderPage()}</ErrorBoundary></MainLayout>;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}