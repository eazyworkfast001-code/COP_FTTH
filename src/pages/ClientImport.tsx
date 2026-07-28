import React, { useState, useMemo } from 'react';
import { ClientProgramme } from '../types';
import { storageService } from '../services/storageService';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Database, Search, Filter, Layers, Users } from 'lucide-react';

export const ClientImport: React.FC = () => {
  const [clients, setClients] = useState<ClientProgramme[]>(storageService.getClients());
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('TOUS');
  const [prestataireFilter, setPrestataireFilter] = useState<string>('TOUS');

  const prestataires = storageService.getPrestataires();

  // Filtered Clients Confiés
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (sourceFilter !== 'TOUS' && c.source !== sourceFilter) return false;
      if (prestataireFilter !== 'TOUS' && c.prestataire !== prestataireFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = c.nomClient.toLowerCase().includes(q);
        const matchNum = c.numeroDossier.toLowerCase().includes(q);
        const matchPrest = c.prestataire.toLowerCase().includes(q);
        const matchLoc = c.localite.toLowerCase().includes(q);
        if (!matchName && !matchNum && !matchPrest && !matchLoc) return false;
      }
      return true;
    });
  }, [clients, searchQuery, sourceFilter, prestataireFilter]);

  const parseFileContent = async (file: File, source: 'Liste COP A' | 'Liste COP B') => {
    try {
      let parsedItems: Omit<ClientProgramme, 'id' | 'dateImport'>[] = [];

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        if ((window as any).XLSX) {
          const XLSX = (window as any).XLSX;
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawRows: any[] = XLSX.utils.sheet_to_json(firstSheet);

          parsedItems = rawRows.map((row) => ({
            dateControle: row['Date du contrôle'] || row['Date'] || new Date().toISOString().split('T')[0],
            numeroDossier: String(row['N° Dossier / Ligne'] || row['N° Dossier'] || row['Dossier'] || '').trim(),
            nomClient: String(row['Client'] || row['Nom Client'] || '').trim(),
            prestataire: String(row['PRESTATAIRE'] || row['Prestataire'] || '').trim(),
            localite: String(row['LOCALITE'] || row['Localité'] || '').trim(),
            gpsClient: String(row['GPS CLIENTS'] || row['GPS Client'] || row['GPS'] || '').trim(),
            source,
          }));
        } else {
          setImportNotice({
            type: 'error',
            message: 'Bibliothèque XLSX non disponible, utilisez un fichier CSV.',
          });
          return;
        }
      } else {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

        if (lines.length <= 1) {
          setImportNotice({ type: 'error', message: 'Fichier CSV vide.' });
          return;
        }

        const delimiter = text.includes(';') ? ';' : ',';
        const headers = lines[0].split(delimiter).map((h) => h.replace(/"/g, '').trim().toLowerCase());

        const numIdx = headers.findIndex((h) => h.includes('dossier') || h.includes('ligne'));
        const clientIdx = headers.findIndex((h) => h.includes('client'));
        const prestIdx = headers.findIndex((h) => h.includes('prestataire'));
        const locIdx = headers.findIndex((h) => h.includes('localite') || h.includes('localité'));

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(delimiter).map((p) => p.replace(/"/g, '').trim());
          if (parts.length >= 2) {
            parsedItems.push({
              numeroDossier: numIdx !== -1 ? parts[numIdx] : parts[0],
              nomClient: clientIdx !== -1 ? parts[clientIdx] : parts[1] || 'Inconnu',
              prestataire: prestIdx !== -1 ? parts[prestIdx] : parts[2] || 'CELTIIS',
              localite: locIdx !== -1 ? parts[locIdx] : parts[3] || '',
              gpsClient: '',
              source,
            });
          }
        }
      }

      parsedItems = parsedItems.filter((item) => item.numeroDossier !== '');

      if (parsedItems.length === 0) {
        setImportNotice({
          type: 'error',
          message: 'Aucun dossier valide identifié.',
        });
        return;
      }

      const count = storageService.importClientsList(parsedItems, source);
      setClients(storageService.getClients());
      setImportNotice({
        type: 'success',
        message: `${count} clients confiés importés avec succès dans "${source}" !`,
      });
    } catch (err: any) {
      setImportNotice({
        type: 'error',
        message: `Erreur d'importation : ${err.message || 'Format invalide'}`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, source: 'Liste COP A' | 'Liste COP B') => {
    const file = e.target.files?.[0];
    if (file) parseFileContent(file, source);
  };

  const copACount = clients.filter((c) => c.source === 'Liste COP A').length;
  const copBCount = clients.filter((c) => c.source === 'Liste COP B').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Liste des Clients Confiés & Programmés COP
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualisez, recherchez et téléversez les listes de clients confiés pour les contrôles qualité.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
          <Database className="w-4 h-4 text-emerald-500" />
          <span>{clients.length} Clients Confiés Totaux</span>
        </div>
      </div>

      {importNotice && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center space-x-3 ${
            importNotice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {importNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span className="font-semibold">{importNotice.message}</span>
        </div>
      )}

      {/* TWO UPLOAD BUTTONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Liste COP A</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actuellement : <strong className="font-mono text-blue-600 dark:text-cyan-400">{copACount}</strong> clients confiés
            </p>
          </div>

          <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all">
            <UploadCloud className="w-4 h-4" />
            <span>Téléverser Liste COP A</span>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => handleFileUpload(e, 'Liste COP A')}
              className="hidden"
            />
          </label>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-950 rounded-2xl flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Liste COP B</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actuellement : <strong className="font-mono text-cyan-600 dark:text-cyan-400">{copBCount}</strong> clients confiés
            </p>
          </div>

          <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all">
            <UploadCloud className="w-4 h-4" />
            <span>Téléverser Liste COP B</span>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => handleFileUpload(e, 'Liste COP B')}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* VISUALISATION DE LA LISTE DES CLIENTS CONFIÉS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Visualisation des Clients Confiés ({filteredClients.length})
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par Nom, N° Dossier, Localité..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none pr-9"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="TOUS">Toutes les sources (A & B)</option>
            <option value="Liste COP A">Liste COP A</option>
            <option value="Liste COP B">Liste COP B</option>
          </select>

          <select
            value={prestataireFilter}
            onChange={(e) => setPrestataireFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="TOUS">Tous les prestataires</option>
            {prestataires.map((p) => (
              <option key={p.id} value={p.nom}>
                {p.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">N° Dossier / Ligne</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">PRESTATAIRE</th>
                <th className="py-3 px-4">LOCALITE</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Date Import</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Aucun client confié ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredClients.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {item.numeroDossier}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.nomClient}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.prestataire}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.localite}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.source === 'Liste COP A'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                        }`}
                      >
                        {item.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {item.dateImport}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
