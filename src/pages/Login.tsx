import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { Wifi, LogIn, UserCheck, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [personalId, setPersonalId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = storageService.getUserByPersonalId(personalId);

    if (!user) {
      setError('Identifiant Personnel introuvable.');
      return;
    }

    if (user.statut === 'INACTIF') {
      setError('Ce compte utilisateur a été désactivé par l\'Administrateur.');
      return;
    }

    if (user.password && user.password !== password) {
      setError('Mot de passe incorrect.');
      return;
    }

    storageService.setCurrentUser(user);
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Wifi className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              CELTIIS COP FTTH
            </h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              Plateforme de Gestion des Contrôles Qualité
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              ID Personnel Unique
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={personalId}
                onChange={(e) => setPersonalId(e.target.value.toUpperCase())}
                placeholder="Ex: COP0001"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white font-mono font-bold text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
              />
              <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none pr-10 placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>SE CONNECTER</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            Accès sécurisé réservé aux agents et techniciens autorisés CELTIIS.
          </p>
        </div>
      </div>
    </div>
  );
};
