import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Workflow, Check, Copy, ExternalLink, Database, Server, Code, FileSpreadsheet } from 'lucide-react';

interface PowerAutomateGuideModalProps {
  onClose: () => void;
}

export const PowerAutomateGuideModal: React.FC<PowerAutomateGuideModalProps> = ({ onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState(storageService.getPowerAutomateUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleJSON = `{
 "numeroDossier":"12345",
 "nomClient":"Jean Dupont",
 "prestataire":"Prestataire A",
 "localite":"Abomey-Calavi",
 "gpsClient":"6.35,2.42",
 "dateControle":"2026-07-27",
 "technicien":"Kevin KPOTA",
 "conforme":true,
 "nonConformites":["AUCUN"],
 "gravite":"Aucune",
 "commentaire":"RAS",
 "responsableAction":"",
 "cop":"OK"
}`;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.setPowerAutomateUrl(webhookUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(sampleJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Workflow className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Guide & Configuration Power Automate / Excel Online
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Connectez vos formulaires COP en temps réel avec Microsoft Power Automate et Excel Online (OneDrive / SharePoint).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800 dark:text-slate-200 text-sm">
          {/* Section 1: URL Webhook Config */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>1. URL du Déclencheur HTTP Power Automate (Webhook)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Collez ici l'URL générée par le déclencheur "Lors de la réception d'une requête HTTP" de votre flux Power Automate.
            </p>

            <form onSubmit={handleSaveUrl} className="mt-3 flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://prod-xx.westeurope.logic.azure.com:443/workflows/..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 shrink-0 transition-colors"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                <span>{savedSuccess ? 'Enregistré !' : 'Enregistrer l\'URL'}</span>
              </button>
            </form>
            <p className="text-[11px] text-slate-400 mt-2">
              * Remarque : Si aucune URL n'est configurée, l'application fonctionne en mode simulation locale sans bloquer la saisie.
            </p>
          </div>

          {/* Section 2: Schema JSON Request */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Code className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>2. Schéma JSON d'envoi du formulaire COP</span>
              </h3>
              <button
                onClick={handleCopyJSON}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              {sampleJSON}
            </pre>
          </div>

          {/* Section 3: Step-by-Step Flow Instructions */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>3. Procédure Pas à Pas de Création du Flux Power Automate</span>
            </h3>

            <ol className="space-y-3 text-xs leading-relaxed">
              <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-1">
                  Étape A : Création du Tableau Excel Online
                </strong>
                Dans votre OneDrive Entreprise ou SharePoint CELTIIS, créez un fichier Excel nommé{' '}
                <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">
                  Base_COP_FTTH.xlsx
                </code>
                . Sélectionnez la plage de données et transformez-la en Tableau nommé{' '}
                <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">
                  TableCOP
                </code>{' '}
                avec les colonnes exactes :
                <br />
                <em className="text-slate-500 font-mono block mt-1">
                  numeroDossier | nomClient | prestataire | localite | gpsClient | dateControle | technicien | conforme | nonConformites | gravite | commentaire | responsableAction | cop
                </em>
              </li>

              <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-1">
                  Étape B : Création du Flux Instantané dans Power Automate
                </strong>
                1. Allez sur <span className="font-semibold text-slate-900 dark:text-white">make.powerautomate.com</span>.<br />
                2. Déclencheur : Choisir <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">Lors de la réception d'une requête HTTP</code>.<br />
                3. Cliquez sur <em>"Utiliser un exemple de charge utile pour générer le schéma"</em> et collez le JSON ci-dessus.<br />
                4. Méthode : Sélectionner <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1">POST</code>.
              </li>

              <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-1">
                  Étape C : Action "Ajouter une ligne dans un tableau" (Excel Online)
                </strong>
                Ajoutez l'action Excel Online (Business) $\rightarrow$ <strong>Ajouter une ligne dans un tableau</strong>.
                Sélectionnez le fichier <code className="font-mono">Base_COP_FTTH.xlsx</code> et la table <code className="font-mono">TableCOP</code>, puis mappez les champs dynamiques issus du déclencheur HTTP.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs"
          >
            Fermer la Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
