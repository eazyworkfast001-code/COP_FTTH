import React, { useState, useEffect } from 'react';
import { User, TypeNonConformite, Gravite, COPControle } from '../types';
import { storageService } from '../services/storageService';
import { powerAutomateService } from '../services/powerAutomateService';
import {
  CheckCircle,
  XCircle,
  Search,
  RotateCcw,
  Send,
  FileCheck,
  Check,
  Building,
  MapPin,
  UserCheck,
  Calendar,
} from 'lucide-react';

interface CopFormProps {
  currentUser: User;
  onSuccessSubmit: () => void;
}

const NON_CONFORMITE_OPTIONS: TypeNonConformite[] = [
  'AUCUN',
  'MANQUE DE POTEAUX',
  'TIRAGE MAL EFFECTUÉ',
  'POTEAUX NON ARMÉ',
  'ONT & PTO MAL FIXÉ',
  'GPS CLIENT ERRONÉ',
  'SURPLUS DE CÂBLE',
  'AUTRE',
];

export const CopForm: React.FC<CopFormProps> = ({ currentUser, onSuccessSubmit }) => {
  const [numeroDossier, setNumeroDossier] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [prestataire, setPrestataire] = useState('');
  const [localite, setLocalite] = useState('');
  const [dateControle] = useState(new Date().toISOString().split('T')[0]);
  const [technicien, setTechnicien] = useState(`${currentUser.prenom} ${currentUser.nom}`);
  const [conforme, setConforme] = useState<boolean>(true);
  const [nonConformites, setNonConformites] = useState<TypeNonConformite[]>(['AUCUN']);
  const [gravite, setGravite] = useState<Gravite>('Aucune');
  const [commentaire, setCommentaire] = useState('');

  const [foundClientNotice, setFoundClientNotice] = useState<string | null>(null);
  const [prestatairesList] = useState(storageService.getPrestataires());
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState(0);
  const [wordCountError, setWordCountError] = useState(false);

  useEffect(() => {
    const trimmed = commentaire.trim();
    const count = trimmed ? trimmed.split(/\s+/).length : 0;
    setWordCount(count);
    setWordCountError(count > 300);
  }, [commentaire]);

  const handleDossierSearch = (dossierNum: string) => {
    setNumeroDossier(dossierNum);
    if (!dossierNum.trim()) {
      setFoundClientNotice(null);
      return;
    }

    const clientData = storageService.getClientByNumeroDossier(dossierNum);
    if (clientData) {
      setNomClient(clientData.nomClient);
      setPrestataire(clientData.prestataire);
      setLocalite(clientData.localite);
      setFoundClientNotice(`Client "${clientData.nomClient}" identifié automatiquement.`);
    } else {
      setFoundClientNotice(null);
    }
  };

  const handleNonConformiteToggle = (item: TypeNonConformite) => {
    if (item === 'AUCUN') {
      setNonConformites(['AUCUN']);
      setConforme(true);
      setGravite('Aucune');
    } else {
      let updated = nonConformites.filter((n) => n !== 'AUCUN');
      if (updated.includes(item)) {
        updated = updated.filter((n) => n !== item);
      } else {
        updated.push(item);
      }

      if (updated.length === 0) {
        setNonConformites(['AUCUN']);
        setConforme(true);
        setGravite('Aucune');
      } else {
        setNonConformites(updated);
        setConforme(false);
        if (gravite === 'Aucune') setGravite('Majeure');
      }
    }
  };

  const handleReset = () => {
    setNumeroDossier('');
    setNomClient('');
    setPrestataire('');
    setLocalite('');
    setTechnicien(`${currentUser.prenom} ${currentUser.nom}`);
    setConforme(true);
    setNonConformites(['AUCUN']);
    setGravite('Aucune');
    setCommentaire('');
    setFoundClientNotice(null);
    setWordCountError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (wordCount > 300) {
      alert('Le commentaire ne peut pas dépasser 300 mots.');
      return;
    }

    if (!prestataire) {
      alert('Veuillez sélectionner un prestataire.');
      return;
    }

    setSubmitting(true);

    const newControle: Omit<COPControle, 'id' | 'dateCreation'> = {
      numeroDossier,
      nomClient,
      prestataire,
      localite,
      gpsClient: '',
      dateControle,
      technicien,
      conforme,
      nonConformites,
      gravite: conforme ? 'Aucune' : gravite,
      commentaire,
      responsableAction: '',
      cop: conforme ? 'OK' : 'NOK',
    };

    const saved = storageService.addControle(newControle);
    const webhookUrl = storageService.getPowerAutomateUrl();
    await powerAutomateService.sendToPowerAutomate(saved, webhookUrl);

    setSubmitting(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    handleReset();
    onSuccessSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider text-cyan-100 backdrop-blur-md">
              CONTRÔLE QUALITÉ FIBRE FTTH
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Saisie d'un Nouveau COP
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 mt-1 max-w-xl">
              Saisissez les résultats du contrôle terrain. La recherche par N° de Dossier est automatique.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <Calendar className="w-5 h-5 text-cyan-200" />
            <div className="text-left">
              <span className="text-[10px] text-cyan-100 uppercase block font-semibold">Date du contrôle</span>
              <span className="text-xs font-extrabold font-mono">{dateControle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 transition-colors">
        {/* Section 1: Dossier Client */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              1. Information Client & Dossier
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                N° Dossier / Ligne <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={numeroDossier}
                  onChange={(e) => handleDossierSearch(e.target.value)}
                  placeholder="Ex: 12345"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
              {foundClientNotice && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{foundClientNotice}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Client <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nomClient}
                onChange={(e) => setNomClient(e.target.value)}
                placeholder="Nom du client"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PRESTATAIRE <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={prestataire}
                  onChange={(e) => setPrestataire(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">-- Sélectionner --</option>
                  {prestatairesList
                    .filter((p) => p.statut === 'ACTIF')
                    .map((p) => (
                      <option key={p.id} value={p.nom}>
                        {p.nom}
                      </option>
                    ))}
                </select>
                <Building className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                LOCALITE <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={localite}
                  onChange={(e) => setLocalite(e.target.value)}
                  placeholder="Localité"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Technicien COP <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={technicien}
                  onChange={(e) => setTechnicien(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Conformité */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                2. Conformité & Non-Conformités
              </h2>
            </div>
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-2 ${
                conforme
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
              }`}
            >
              {conforme ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>COP : {conforme ? 'OK (CONFORME)' : 'NOK (NON CONFORME)'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Type de non-conformité :
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {NON_CONFORMITE_OPTIONS.map((item) => {
                const isSelected = nonConformites.includes(item);
                const isAucun = item === 'AUCUN';

                return (
                  <label
                    key={item}
                    onClick={() => handleNonConformiteToggle(item)}
                    className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? isAucun
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-sm'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold leading-tight">{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Niveau de Gravité :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Aucune', 'Mineure', 'Majeure', 'Critique'] as Gravite[]).map((g) => {
                const isSelected = gravite === g;
                return (
                  <button
                    key={g}
                    type="button"
                    disabled={conforme}
                    onClick={() => setGravite(g)}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      conforme
                        ? g === 'Aucune'
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800/30 border-slate-200 text-slate-400'
                        : isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Commentaire */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Commentaire (Limite: 300 mots)
              </label>
              <span className={`text-xs font-mono font-bold ${wordCountError ? 'text-rose-600' : 'text-slate-500'}`}>
                Mots : {wordCount} / 300
              </span>
            </div>
            <textarea
              rows={3}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Observations du contrôle..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ANNULER</span>
          </button>

          <button
            type="submit"
            disabled={submitting || wordCountError}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'ENREGISTREMENT...' : 'VALIDER LE CONTRÔLE'}</span>
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                <Check className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-xl font-extrabold">Contrôle COP Enregistré !</h3>
              <p className="text-xs text-emerald-100 mt-1">
                Le dossier <strong>#{numeroDossier}</strong> ({nomClient}) a été validé avec succès.
              </p>
            </div>

            <div className="p-6">
              <button
                onClick={handleCloseSuccessModal}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-md"
              >
                Retourner à la liste des contrôles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
