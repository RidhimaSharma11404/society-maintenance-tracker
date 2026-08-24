import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Complaints } from './pages/Complaints';
import { RiskAnalytics } from './pages/RiskAnalytics';
import { AICopilotView } from './pages/AICopilotView';
import { BillingLedger } from './pages/BillingLedger';
import { ContractorDispatch } from './pages/ContractorDispatch';
import { Notices } from './pages/Notices';
import { Settings } from './pages/Settings';
import { OutboxLogs } from './pages/OutboxLogs';
import { GuidedComplaintWizard } from './components/complaints/GuidedComplaintWizard';
import { AssistantDrawer } from './components/assistant/AssistantDrawer';

const AppContent = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [authView, setAuthView] = useState('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [ticketDefaultUnit, setTicketDefaultUnit] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#EEF2F6] flex items-center justify-center text-slate-700 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#16233D] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold font-mono text-[#16233D]">Loading Greenwood Heights Portal...</span>
        </div>
      </div>
    );
  }

  // Explicitly Show Register Page
  if (currentPath === '/register' || authView === 'register') {
    return (
      <Register
        onNavigateToLogin={() => {
          setAuthView('login');
          navigateTo('/login');
        }}
      />
    );
  }

  // Explicitly Show Login Page if not authenticated OR if visiting /login
  if (!isAuthenticated || currentPath === '/login') {
    return (
      <Login
        onNavigateToRegister={() => {
          setAuthView('register');
          navigateTo('/register');
        }}
      />
    );
  }

  const handleOpenCreateTicket = (unit) => {
    setTicketDefaultUnit(unit || user?.unitNumber || 'Tower A - 402');
    setIsWizardOpen(true);
  };

  const handleSelectComplaintFromDash = (id) => {
    setSelectedComplaintId(id);
    setActiveTab('complaints');
  };

  const handleOpenAssistantWithPrompt = (promptText) => {
    setAssistantInitialPrompt(promptText);
    setIsAssistantOpen(true);
  };

  const handleLogoutAndGoToLogin = () => {
    logout();
    navigateTo('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Header */}
      <Navbar
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenCreateTicket={() => handleOpenCreateTicket(user?.unitNumber)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateTab={setActiveTab}
        onLogout={handleLogoutAndGoToLogin}
        onGoToLogin={() => navigateTo('/login')}
      />

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                onNavigateTab={setActiveTab}
                onSelectComplaint={handleSelectComplaintFromDash}
                onOpenCreateTicket={handleOpenCreateTicket}
                onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
              />
            )}
            {activeTab === 'complaints' && (
              <Complaints
                selectedComplaintId={selectedComplaintId}
                setSelectedComplaintId={setSelectedComplaintId}
                onOpenCreateTicket={handleOpenCreateTicket}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'analytics' && (
              <RiskAnalytics onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'copilot' && (
              <AICopilotView onOpenCreateTicket={handleOpenCreateTicket} />
            )}
            {activeTab === 'billing' && <BillingLedger />}
            {activeTab === 'dispatch' && <ContractorDispatch />}
            {activeTab === 'notices' && <Notices />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'outbox' && <OutboxLogs />}
          </div>
        </main>
      </div>

      {/* Guided Complaint Wizard Modal */}
      {isWizardOpen && (
        <GuidedComplaintWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          defaultUnit={ticketDefaultUnit}
          onCreated={() => {
            setIsWizardOpen(false);
          }}
        />
      )}

      {/* Quick AI Assistant Slide-over Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => {
          setIsAssistantOpen(false);
          setAssistantInitialPrompt('');
        }}
        initialPrompt={assistantInitialPrompt}
      />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
