import React, { useState, useEffect } from 'react';
import { User } from './types';
import { storageService } from './services/storageService';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CopHistory } from './pages/CopHistory';
import { ClientImport } from './pages/ClientImport';
import { Prestataires } from './pages/Prestataires';
import { Users } from './pages/Users';
import { Parametres } from './pages/Parametres';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CopForm } from './components/CopForm';
import { ChangePasswordModal } from './components/ChangePasswordModal';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(storageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(storageService.getTheme());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    storageService.setTheme(theme);
  }, [theme]);

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    storageService.setTheme(newTheme);
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const isPasswordChangeForced = Boolean(currentUser.mustChangePassword);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setActiveTab('parametres')}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Layout */}
      <div className="flex flex-1 pt-0">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          currentUser={currentUser}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Content View */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'dashboard' && <Dashboard />}

          {activeTab === 'nouveau-cop' && (
            <CopForm
              currentUser={currentUser}
              onSuccessSubmit={() => setActiveTab('historique-cop')}
            />
          )}

          {activeTab === 'historique-cop' && <CopHistory currentUser={currentUser} />}

          {activeTab === 'clients-programmes' && <ClientImport />}

          {activeTab === 'utilisateurs' && <Users currentUser={currentUser} />}

          {activeTab === 'prestataires' && <Prestataires currentUser={currentUser} />}

          {activeTab === 'parametres' && (
            <Parametres
              currentUser={currentUser}
              currentTheme={theme}
              onThemeToggle={handleThemeToggle}
              onUserUpdated={(updated) => setCurrentUser(updated)}
            />
          )}
        </main>
      </div>

      {/* Forced Password Change Modal */}
      {isPasswordChangeForced && (
        <ChangePasswordModal
          user={currentUser}
          isForced={true}
          onSuccess={() => {
            const updated = storageService.getCurrentUser();
            if (updated) setCurrentUser({ ...updated, mustChangePassword: false });
          }}
        />
      )}
    </div>
  );
};

export default App;
