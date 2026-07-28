import React, { useState } from 'react';
import { User } from '../types';
import { Settings, LogOut, Menu, Wifi } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenSettings,
  onToggleSidebar,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section: Mobile Toggle + App Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            title="Menu Nav"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-wide block leading-tight">
                CELTIIS COP FTTH
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                Gestion des Contrôles Qualité
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: User Profile & Paramètres Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Paramètres du Compte"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                {currentUser.prenom[0]}
                {currentUser.nom[0]}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentUser.prenom} {currentUser.nom}
                </div>
                <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-mono font-bold">
                    {currentUser.personalId}
                  </span>
                  <span>•</span>
                  <span className={currentUser.role === 'ADMIN' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fadeIn"
                onClick={() => setShowUserMenu(false)}
              >
                <button
                  onClick={onOpenSettings}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span>Paramètres</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
