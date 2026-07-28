import React from 'react';
import { User } from '../types';
import {
  LayoutDashboard,
  ClipboardPlus,
  History,
  UploadCloud,
  Users as UsersIcon,
  Building2,
  Settings,
  LogOut,
  X,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  isOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isOpen,
  onCloseMobile,
  onLogout,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  // EXACT MENU STRUCTURE REQUESTED BY USER
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, adminOnly: false },
    { id: 'nouveau-cop', label: 'Nouveau COP', icon: ClipboardPlus, adminOnly: false },
    { id: 'historique-cop', label: 'Liste des COP', icon: History, adminOnly: false },
    { id: 'clients-programmes', label: 'Clients programmés', icon: UploadCloud, adminOnly: false },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: UsersIcon, adminOnly: true },
    { id: 'prestataires', label: 'Prestataires', icon: Building2, adminOnly: true },
    { id: 'parametres', label: 'Paramètres', icon: Settings, adminOnly: false },
  ];

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Header Mobile Close */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 lg:hidden">
            <span className="font-extrabold text-xs text-blue-600 dark:text-cyan-400">NAVIGATION</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isRestricted = item.adminOnly && !isAdmin;

              if (isRestricted) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50 text-xs font-semibold"
                    title="Réservé à l'Administrateur"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    <ShieldAlert className="w-3.5 h-3.5 ml-auto text-amber-500" />
                  </div>
                );
              }

              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
