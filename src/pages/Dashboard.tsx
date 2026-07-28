import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { storageService } from '../services/storageService';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Building2,
  TrendingUp,
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const controles = storageService.getControles();
  const prestataires = storageService.getPrestataires();

  // Metrics computation
  const totalCop = controles.length;
  const conformes = controles.filter((c) => c.conforme).length;
  const nonConformes = totalCop - conformes;
  const conformityRate = totalCop > 0 ? ((conformes / totalCop) * 100).toFixed(1) : '100.0';
  const totalPrestataires = prestataires.filter((p) => p.statut === 'ACTIF').length;

  // Prestataire breakdown
  const prestataireStats: Record<string, { total: number; ok: number; nok: number }> = {};
  prestataires.forEach((p) => {
    prestataireStats[p.nom] = { total: 0, ok: 0, nok: 0 };
  });

  controles.forEach((c) => {
    if (!prestataireStats[c.prestataire]) {
      prestataireStats[c.prestataire] = { total: 0, ok: 0, nok: 0 };
    }
    prestataireStats[c.prestataire].total += 1;
    if (c.conforme) {
      prestataireStats[c.prestataire].ok += 1;
    } else {
      prestataireStats[c.prestataire].nok += 1;
    }
  });

  // Non conformities count breakdown
  const nonConformitesCounts: Record<string, number> = {};
  controles.forEach((c) => {
    c.nonConformites.forEach((type) => {
      if (type !== 'AUCUN') {
        nonConformitesCounts[type] = (nonConformitesCounts[type] || 0) + 1;
      }
    });
  });

  const sortedNonConformites = Object.entries(nonConformitesCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tableau de Bord Analytique COP FTTH
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervision en temps réel de la qualité d'installation fibre optique CELTIIS.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/50 px-4 py-2 rounded-2xl border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>Année 2026 • Données Synchronisées</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total COP"
          value={totalCop}
          subtitle="Contrôles réalisés"
          icon={ClipboardList}
          colorScheme="blue"
        />

        <MetricCard
          title="Conformes"
          value={conformes}
          subtitle={`${conformityRate}% du total`}
          icon={CheckCircle}
          colorScheme="emerald"
        />

        <MetricCard
          title="Non Conformes"
          value={nonConformes}
          subtitle="À corriger"
          icon={XCircle}
          colorScheme="rose"
        />

        <MetricCard
          title="Taux Conformité"
          value={`${conformityRate}%`}
          subtitle="Objectif: >= 95%"
          icon={TrendingUp}
          colorScheme="cyan"
        />

        <MetricCard
          title="Prestataires"
          value={totalPrestataires}
          subtitle="Entreprises sous-traitantes"
          icon={Building2}
          colorScheme="amber"
        />
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prestataires Breakdown Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>Contrôles et Conformité par Prestataire</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Volume Total & OK/NOK</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(prestataireStats).map(([name, stats]) => {
              const okPercent = stats.total > 0 ? Math.round((stats.ok / stats.total) * 100) : 100;
              return (
                <div key={name} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{name}</span>
                    <div className="flex items-center space-x-3 font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400">{stats.ok} OK</span>
                      <span className="text-rose-600 dark:text-rose-400">{stats.nok} NOK</span>
                      <span className="text-slate-500">({stats.total} total)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div
                      style={{ width: `${okPercent}%` }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                      title={`${okPercent}% Conformes`}
                    />
                    <div
                      style={{ width: `${100 - okPercent}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                      title={`${100 - okPercent}% Non Conformes`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Non-Conformities Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Types de Non-Conformités</span>
            </h2>
          </div>

          {sortedNonConformites.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p>Aucune non-conformité recensée dans les contrôles actuels !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedNonConformites.map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{type}</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-mono text-xs font-extrabold">
                    {count} occ.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
