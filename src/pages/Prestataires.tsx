import React, { useState } from 'react';
import { User, Prestataire } from '../types';
import { storageService } from '../services/storageService';
import { Building2, Plus, Edit2, Trash2, ShieldAlert, CheckCircle2, Phone, Tag } from 'lucide-react';

interface PrestatairesProps {
  currentUser: User;
}

export const Prestataires: React.FC<PrestatairesProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'ADMIN';

  const [items, setItems] = useState<Prestataire[]>(storageService.getPrestataires());
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Prestataire | null>(null);

  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [contact, setContact] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setNom('');
    setCode('');
    setContact('');
    setShowModal(true);
  };

  const openEditModal = (item: Prestataire) => {
    setEditingItem(item);
    setNom(item.nom);
    setCode(item.code);
    setContact(item.contact || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !code.trim()) return;

    if (editingItem) {
      storageService.updatePrestataire({
        ...editingItem,
        nom: nom.trim(),
        code: code.trim().toUpperCase(),
        contact: contact.trim(),
      });
    } else {
      storageService.addPrestataire(nom, code, contact);
    }

    setItems(storageService.getPrestataires());
    setShowModal(false);
  };

  const handleDelete = (id: string, nomPrestataire: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le prestataire "${nomPrestataire}" ?`)) {
      storageService.deletePrestataire(id);
      setItems(storageService.getPrestataires());
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-rose-700 dark:text-rose-300">Accès Restreint</h2>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          Seul l'Administrateur peut gérer les prestataires.
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
            PARAMÈTRES SYSTÈME
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Gestion des Prestataires Sous-Traitants
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ajoutez, modifiez ou supprimez des prestataires de manière dynamique sans modifier le code source.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center space-x-2 shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>AJOUTER UN PRESTATAIRE</span>
        </button>
      </div>

      {/* Grid of Prestataires Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{item.nom}</h3>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">
                    CODE: {item.code}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                {item.statut}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact: {item.contact || 'Non spécifié'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Ajouté le: {item.dateAjout}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                title="Modifier"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.nom)}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white text-center">
              <h3 className="text-xl font-extrabold">
                {editingItem ? 'Modifier le Prestataire' : 'Nouveau Prestataire'}
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                {editingItem ? 'Mettez à jour les informations du sous-traitant.' : 'Saisissez les coordonnées de l\'entreprise sous-traitante FTTH.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du Prestataire <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: CELTIIS, SOGETEL, SPIE BENIN"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Code Identifiant Prestataire <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: CEL, SOG, SPIE"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Téléphone / Contact
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Ex: +229 97 00 00 00"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
                  {editingItem ? 'Enregistrer les modifications' : 'Créer le Prestataire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
