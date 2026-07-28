import React, { useState } from 'react';
import { User, Role, UserStatus } from '../types';
import { storageService } from '../services/storageService';
import { Users as UsersIcon, UserPlus, KeyRound, UserCheck, ShieldAlert, Edit2, Power } from 'lucide-react';

interface UsersProps {
  currentUser: User;
}

export const Users: React.FC<UsersProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'ADMIN';

  const [usersList, setUsersList] = useState<User[]>(storageService.getUsers());
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [personalId, setPersonalId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('Temp1234');
  const [role, setRole] = useState<Role>('TECHNICIEN');
  const [notice, setNotice] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingUser(null);
    setPersonalId(`COP000${usersList.length + 1}`);
    setNom('');
    setPrenom('');
    setPassword('Temp1234');
    setRole('TECHNICIEN');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setPersonalId(user.personalId);
    setNom(user.nom);
    setPrenom(user.prenom);
    setRole(user.role);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalId.trim() || !nom.trim() || !prenom.trim()) return;

    if (editingUser) {
      storageService.updateUser({
        ...editingUser,
        personalId: personalId.trim().toUpperCase(),
        nom: nom.trim(),
        prenom: prenom.trim(),
        role,
      });
      setNotice(`Compte utilisateur ${personalId} mis à jour avec succès.`);
    } else {
      // Check duplicate personal ID
      const existing = storageService.getUserByPersonalId(personalId);
      if (existing) {
        alert(`L'ID Personnel "${personalId}" existe déjà. Veuillez en choisir un autre.`);
        return;
      }

      storageService.addUser({
        personalId: personalId.trim().toUpperCase(),
        nom: nom.trim(),
        prenom: prenom.trim(),
        password: password || 'Temp1234',
        role,
        statut: 'ACTIF',
      });
      setNotice(`Nouveau compte ${personalId} créé avec mot de passe temporaire "${password}".`);
    }

    setUsersList(storageService.getUsers());
    setShowModal(false);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleToggleStatus = (user: User) => {
    if (user.id === currentUser.id) {
      alert('Vous ne pouvez pas désactiver votre propre compte administrateur.');
      return;
    }

    const newStatus: UserStatus = user.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF';
    storageService.updateUser({ ...user, statut: newStatus });
    setUsersList(storageService.getUsers());
  };

  const handleResetPassword = (user: User) => {
    if (confirm(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} (${user.personalId}) à "Temp1234" ?`)) {
      storageService.resetUserPassword(user.id, 'Temp1234');
      setUsersList(storageService.getUsers());
      alert(`Le mot de passe de ${user.personalId} a été réinitialisé à "Temp1234". L'utilisateur devra le modifier à sa prochaine connexion.`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-rose-700 dark:text-rose-300">Accès Restreint</h2>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          Seul l'Administrateur peut gérer les comptes utilisateurs et réinitialiser les mots de passe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-cyan-400 tracking-wider">
            ADMINISTRATION SÉCURITÉ
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Gestion des Utilisateurs & Accès
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Créez des comptes, attribuez des rôles, réinitialisez les mots de passe et gérez les accès des techniciens.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center space-x-2 shrink-0 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>CRÉER UN COMPTE</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">ID Personnel</th>
                <th className="py-3.5 px-4">Nom & Prénom</th>
                <th className="py-3.5 px-4">Rôle</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Changement Pass. Requis ?</th>
                <th className="py-3.5 px-4 text-right">Actions Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                    {u.personalId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        u.statut === 'ACTIF'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {u.statut}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {u.mustChangePassword ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">OUI (Obligatoire)</span>
                    ) : (
                      <span className="text-slate-400">NON</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleResetPassword(u)}
                      className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
                      title="Réinitialiser le mot de passe"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                      title="Modifier le compte"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        u.statut === 'ACTIF'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title={u.statut === 'ACTIF' ? 'Désactiver le compte' : 'Activer le compte'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white text-center">
              <h3 className="text-xl font-extrabold">
                {editingUser ? 'Modifier le Compte Utilisateur' : 'Créer un Compte Utilisateur'}
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                L'utilisateur devra changer son mot de passe lors de sa toute première connexion.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ID Personnel Unique <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalId}
                  onChange={(e) => setPersonalId(e.target.value.toUpperCase())}
                  placeholder="Ex: COP0004"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom de famille"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prénom <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mot de passe temporaire
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rôle Système <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="TECHNICIEN">TECHNICIEN (Saisie & Consultation)</option>
                  <option value="ADMIN">ADMIN (Accès Total & Gestion Comptes)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  {editingUser ? 'Enregistrer les modifications' : 'Créer le Compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
