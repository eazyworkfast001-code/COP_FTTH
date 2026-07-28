import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { User as UserIcon, Sun, Moon, Key, Lock, RotateCcw, CheckCircle2 } from 'lucide-react';
import { ChangePasswordModal } from '../components/ChangePasswordModal';

interface ParametresProps {
  currentUser: User;
  currentTheme: 'light' | 'dark';
  onThemeToggle: (theme: 'light' | 'dark') => void;
  onUserUpdated: (user: User) => void;
}

export const Parametres: React.FC<ParametresProps> = ({
  currentUser,
  currentTheme,
  onThemeToggle,
  onUserUpdated,
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleResetTestPasswords = () => {
    storageService.resetAllPasswordsForTest();
    const updated = storageService.getCurrentUser();
    if (updated) onUserUpdated(updated);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Paramètres du Compte & Préférences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos informations personnelles, le thème d'affichage et la sécurité de votre accès.
          </p>
        </div>
      </div>

      {resetNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Mot de passe réinitialisé à "Temp1234". Vous pouvez poursuivre vos tests.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Informations Utilisateur
              </h2>
              <span className="text-xs text-slate-400">Profil de session actif</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-bold">ID Personnel :</span>
              <span className="font-mono font-extrabold text-blue-600 dark:text-cyan-400 text-sm">
                {currentUser.personalId}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Nom Complet :</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentUser.prenom} {currentUser.nom}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Rôle Système :</span>
              <span
                className={`px-2.5 py-0.5 rounded-lg font-extrabold text-[11px] ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {currentUser.role}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Statut du Compte :</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[11px]">
                {currentUser.statut}
              </span>
            </div>
          </div>
        </div>

        {/* Display Theme & Security */}
        <div className="space-y-6">
          {/* Theme Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                {currentTheme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Thème d'Affichage
                </h2>
                <span className="text-xs text-slate-400">Personnalisez votre interface</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onThemeToggle('light')}
                className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  currentTheme === 'light'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>☀️ Mode Clair</span>
              </button>

              <button
                onClick={() => onThemeToggle('dark')}
                className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>🌙 Mode Sombre</span>
              </button>
            </div>
          </div>

          {/* Security & Reset Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Sécurité & Réinitialisation
                </h2>
                <span className="text-xs text-slate-400">Gestion des accès</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Changer mon mot de passe</span>
              </button>

              <button
                onClick={handleResetTestPasswords}
                className="w-full py-2.5 px-4 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-xs flex items-center justify-center space-x-2 hover:bg-amber-100 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Réinitialiser les accès à "Temp1234"</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          user={currentUser}
          isForced={false}
          onCancel={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            const updated = storageService.getCurrentUser();
            if (updated) onUserUpdated(updated);
            alert('Votre mot de passe a été mis à jour avec succès.');
          }}
        />
      )}
    </div>
  );
};
