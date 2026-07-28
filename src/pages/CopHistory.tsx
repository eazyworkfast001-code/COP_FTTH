import React, { useState, useMemo } from 'react';
import { User, FilterState, COPControle } from '../types';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Building,
  Calendar,
  X,
} from 'lucide-react';

interface CopHistoryProps {
  currentUser: User;
}

export const CopHistory: React.FC<CopHistoryProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === 'ADMIN';

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    dateDebut: '',
    dateFin: '',
    prestataire: 'TOUS',
    conforme: 'TOUS',
    searchQuery: '',
  });

  const [selectedControleModal, setSelectedControleModal] = useState<COPControle | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const prestataires = storageService.getPrestataires();

  // Filtered COP list
  const filteredControles = useMemo(() => {
    return storageService.filterControles(filters);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      dateDebut: '',
      dateFin: '',
      prestataire: 'TOUS',
      conforme: 'TOUS',
      searchQuery: '',
    });
  };

  const handleDelete = (id: string, numeroDossier: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le contrôle COP du dossier ${numeroDossier} ?`)) {
      storageService.deleteControle(id);
      // Trigger re-render by updating dummy filter or force refetch
      setFilters({ ...filters });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Historique & Liste des Contrôles COP
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consultez, filtrez et exportez l'ensemble des contrôles FTTH enregistrés ({filteredControles.length} dossiers affichés).
          </p>
        </div>

        {/* EXPORT BUTTON & DROPDOWN MENU */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORTER LES DONNÉES</span>
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-30 animate-fadeIn"
              onClick={() => setShowExportMenu(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Formats d'Exportation
                </span>
              </div>

              <button
                onClick={() => exportService.exportToExcel(filteredControles)}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Exporter vers Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => exportService.exportToCSV(filteredControles)}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 transition-colors"
              >
                <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Exporter au format CSV (.csv)</span>
              </button>

              <button
                onClick={() => exportService.exportToPDF(filteredControles)}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center space-x-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Générer Rapport PDF (.pdf)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Filtres Avancés & Recherche Multi-critères
            </h2>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Query */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Recherche par Nom, Dossier ou Prestataire
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Ex: KPOTA, 12345, CELTIIS..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none pr-9"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Date Début */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Date Début
            </label>
            <input
              type="date"
              value={filters.dateDebut}
              onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Date Fin */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Date Fin
            </label>
            <input
              type="date"
              value={filters.dateFin}
              onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Prestataire */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Prestataire
            </label>
            <select
              value={filters.prestataire}
              onChange={(e) => setFilters({ ...filters, prestataire: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="TOUS">Tous les prestataires</option>
              {prestataires.map((p) => (
                <option key={p.id} value={p.nom}>
                  {p.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conforme status toggle buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">Statut COP :</span>
          {(['TOUS', 'OK', 'NOK'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilters({ ...filters conforme: st })}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                filters.conforme === st
                  ? st === 'OK'
                    ? 'bg-emerald-600 text-white'
                    : st === 'NOK'
                    ? 'bg-rose-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st === 'TOUS' ? 'Tous' : st === 'OK' ? 'Conformes (OK)' : 'Non Conformes (NOK)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Dossier</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Prestataire</th>
                <th className="py-3.5 px-4 text-center">Conforme ?</th>
                <th className="py-3.5 px-4">Technicien COP</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredControles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Aucun contrôle COP ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredControles.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600 dark:text-slate-300">
                      {item.dateControle}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {item.numeroDossier}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {item.nomClient}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                        {item.prestataire}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-extrabold text-[11px] ${
                          item.conforme
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.conforme ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>OK</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>NOK ({item.gravite})</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.technicien}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedControleModal(item)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Voir le détail du dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id, item.numeroDossier)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Supprimer ce contrôle (Admin)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedControleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded font-bold">
                  DOSSIER #{selectedControleModal.numeroDossier}
                </span>
                <h3 className="text-xl font-extrabold mt-1">{selectedControleModal.nomClient}</h3>
              </div>
              <button
                onClick={() => setSelectedControleModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-semibold">Prestataire</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {selectedControleModal.prestataire}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Localité</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {selectedControleModal.localite}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Coordonnées GPS</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedControleModal.gpsClient}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Technicien COP</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedControleModal.technicien}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-semibold mb-1">Non-conformités recensées :</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedControleModal.nonConformites.map((nc) => (
                    <span
                      key={nc}
                      className={`px-2.5 py-1 rounded-lg font-bold ${
                        nc === 'AUCUN'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {nc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Commentaire :</span>
                <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed italic border border-slate-200 dark:border-slate-700">
                  "{selectedControleModal.commentaire || 'Aucun commentaire'}"
                </p>
              </div>

              {selectedControleModal.responsableAction && (
                <div>
                  <span className="text-slate-400 block font-semibold">Responsable Action :</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {selectedControleModal.responsableAction}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-right">
              <button
                onClick={() => setSelectedControleModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
