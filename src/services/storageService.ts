import { User, Prestataire, ClientProgramme, COPControle, FilterState } from '../types';

const STORAGE_KEYS = {
  USERS: 'cop_ftth_users',
  PRESTATAIRES: 'cop_ftth_prestataires',
  CLIENTS: 'cop_ftth_clients',
  CONTROLES: 'cop_ftth_controles',
  CURRENT_USER: 'cop_ftth_current_user',
  THEME: 'cop_ftth_theme',
  POWER_AUTOMATE_URL: 'cop_ftth_pa_url',
};

// Initial Seed Data (Default password Temp1234 without mandatory change for easy testing)
const DEFAULT_USERS: User[] = [
  {
    id: 'u-1',
    personalId: 'COP0001',
    nom: 'KPOTA',
    prenom: 'Kevin',
    password: 'Temp1234',
    role: 'ADMIN',
    statut: 'ACTIF',
    mustChangePassword: false,
  },
  {
    id: 'u-2',
    personalId: 'COP0002',
    nom: 'SOGLO',
    prenom: 'Marc',
    password: 'Temp1234',
    role: 'TECHNICIEN',
    statut: 'ACTIF',
    mustChangePassword: false,
  },
  {
    id: 'u-3',
    personalId: 'COP0003',
    nom: 'ADANHO',
    prenom: 'Amina',
    password: 'Temp1234',
    role: 'TECHNICIEN',
    statut: 'ACTIF',
    mustChangePassword: false,
  },
];

const DEFAULT_PRESTATAIRES: Prestataire[] = [
  { id: 'p-1', nom: 'CELTIIS', code: 'CEL', contact: '+229 97 00 00 01', statut: 'ACTIF', dateAjout: '2026-01-10' },
  { id: 'p-2', nom: 'SOGETEL', code: 'SOG', contact: '+229 97 00 00 02', statut: 'ACTIF', dateAjout: '2026-01-12' },
  { id: 'p-3', nom: 'SPIE BENIN', code: 'SPIE', contact: '+229 97 00 00 03', statut: 'ACTIF', dateAjout: '2026-01-15' },
  { id: 'p-4', nom: 'ERT TELECOM', code: 'ERT', contact: '+229 97 00 00 04', statut: 'ACTIF', dateAjout: '2026-02-01' },
  { id: 'p-5', nom: 'AFRIQUE FIBRE', code: 'AFIB', contact: '+229 97 00 00 05', statut: 'ACTIF', dateAjout: '2026-02-10' },
];

const DEFAULT_CLIENTS: ClientProgramme[] = [
  { id: 'c-1', numeroDossier: '12345', nomClient: 'Jean Dupont', prestataire: 'CELTIIS', localite: 'Abomey-Calavi', gpsClient: '6.4521, 2.3512', source: 'Liste COP A', dateImport: '2026-07-20' },
  { id: 'c-2', numeroDossier: '12346', nomClient: 'Société SOTRA-BENIN', prestataire: 'SOGETEL', localite: 'Cotonou - Akpakpa', gpsClient: '6.3689, 2.4410', source: 'Liste COP A', dateImport: '2026-07-20' },
  { id: 'c-3', numeroDossier: '12347', nomClient: 'Koffi MENSAH', prestataire: 'CELTIIS', localite: 'Porto-Novo', gpsClient: '6.4969, 2.6289', source: 'Liste COP B', dateImport: '2026-07-21' },
  { id: 'c-4', numeroDossier: '12348', nomClient: 'Clinique Sainte Marie', prestataire: 'SPIE BENIN', localite: 'Cotonou - Haie Vive', gpsClient: '6.3571, 2.3950', source: 'Liste COP B', dateImport: '2026-07-22' },
  { id: 'c-5', numeroDossier: '12349', nomClient: 'Chantal DOSSOU', prestataire: 'ERT TELECOM', localite: 'Godomey', gpsClient: '6.4112, 2.3299', source: 'Liste COP A', dateImport: '2026-07-23' },
  { id: 'c-6', numeroDossier: '12350', nomClient: 'Hôtel Les Cocotiers', prestataire: 'AFRIQUE FIBRE', localite: 'Ouidah', gpsClient: '6.3611, 2.0850', source: 'Liste COP B', dateImport: '2026-07-24' },
];

const DEFAULT_CONTROLES: COPControle[] = [
  {
    id: 'cop-1',
    numeroDossier: '12345',
    nomClient: 'Jean Dupont',
    prestataire: 'CELTIIS',
    localite: 'Abomey-Calavi',
    gpsClient: '',
    dateControle: '2026-07-27',
    technicien: 'Kevin KPOTA',
    conforme: true,
    nonConformites: ['AUCUN'],
    gravite: 'Aucune',
    commentaire: 'Installation parfaitement conforme aux normes FTTH CELTIIS.',
    responsableAction: '',
    cop: 'OK',
    dateCreation: '2026-07-27T10:30:00Z',
  },
  {
    id: 'cop-2',
    numeroDossier: '12346',
    nomClient: 'Société SOTRA-BENIN',
    prestataire: 'SOGETEL',
    localite: 'Cotonou - Akpakpa',
    gpsClient: '',
    dateControle: '2026-07-26',
    technicien: 'Marc SOGLO',
    conforme: false,
    nonConformites: ['MANQUE DE POTEAUX', 'TIRAGE MAL EFFECTUÉ'],
    gravite: 'Majeure',
    commentaire: 'Traversée de rue sans poteau intermédiaire. À corriger sous 48h.',
    responsableAction: '',
    cop: 'NOK',
    dateCreation: '2026-07-26T14:15:00Z',
  },
];

export const storageService = {
  // Reset all user passwords to Temp1234 for testing
  resetAllPasswordsForTest: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    const curr = storageService.getCurrentUser();
    if (curr) {
      curr.password = 'Temp1234';
      curr.mustChangePassword = false;
      storageService.setCurrentUser(curr);
    }
  },

  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRESTATAIRES)) {
      localStorage.setItem(STORAGE_KEYS.PRESTATAIRES, JSON.stringify(DEFAULT_PRESTATAIRES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(DEFAULT_CLIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTROLES)) {
      localStorage.setItem(STORAGE_KEYS.CONTROLES, JSON.stringify(DEFAULT_CONTROLES));
    }
  },

  getUsers: (): User[] => {
    storageService.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserByPersonalId: (personalId: string): User | undefined => {
    const users = storageService.getUsers();
    return users.find((u) => u.personalId.toLowerCase() === personalId.trim().toLowerCase());
  },

  addUser: (user: Omit<User, 'id'>): User => {
    const users = storageService.getUsers();
    const newUser: User = {
      ...user,
      id: 'u-' + Date.now(),
      mustChangePassword: false,
    };
    users.push(newUser);
    storageService.saveUsers(users);
    return newUser;
  },

  updateUser: (updatedUser: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storageService.saveUsers(users);
    }
  },

  resetUserPassword: (userId: string, newTempPassword = 'Temp1234'): boolean => {
    const users = storageService.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.password = newTempPassword;
      user.mustChangePassword = false;
      storageService.saveUsers(users);
      return true;
    }
    return false;
  },

  changePassword: (userId: string, newPassword: string): boolean => {
    const users = storageService.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.password = newPassword;
      user.mustChangePassword = false;
      storageService.saveUsers(users);

      const currentUser = storageService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.password = newPassword;
        currentUser.mustChangePassword = false;
        storageService.setCurrentUser(currentUser);
      }
      return true;
    }
    return false;
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getPrestataires: (): Prestataire[] => {
    storageService.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESTATAIRES) || '[]');
  },

  savePrestataires: (prestataires: Prestataire[]) => {
    localStorage.setItem(STORAGE_KEYS.PRESTATAIRES, JSON.stringify(prestataires));
  },

  addPrestataire: (nom: string, code: string, contact = ''): Prestataire => {
    const items = storageService.getPrestataires();
    const newItem: Prestataire = {
      id: 'p-' + Date.now(),
      nom: nom.trim(),
      code: code.trim().toUpperCase(),
      contact: contact.trim(),
      statut: 'ACTIF',
      dateAjout: new Date().toISOString().split('T')[0],
    };
    items.push(newItem);
    storageService.savePrestataires(items);
    return newItem;
  },

  updatePrestataire: (item: Prestataire) => {
    const items = storageService.getPrestataires();
    const idx = items.findIndex((p) => p.id === item.id);
    if (idx !== -1) {
      items[idx] = item;
      storageService.savePrestataires(items);
    }
  },

  deletePrestataire: (id: string) => {
    const items = storageService.getPrestataires().filter((p) => p.id !== id);
    storageService.savePrestataires(items);
  },

  getClients: (): ClientProgramme[] => {
    storageService.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]');
  },

  saveClients: (clients: ClientProgramme[]) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  getClientByNumeroDossier: (numeroDossier: string): ClientProgramme | undefined => {
    const clients = storageService.getClients();
    const cleanNum = numeroDossier.trim().toLowerCase();
    return clients.find((c) => c.numeroDossier.toLowerCase() === cleanNum);
  },

  importClientsList: (newClients: Omit<ClientProgramme, 'id' | 'dateImport'>[], source: 'Liste COP A' | 'Liste COP B') => {
    const existing = storageService.getClients();
    const dateImport = new Date().toISOString().split('T')[0];

    const formatted: ClientProgramme[] = newClients.map((c, index) => ({
      ...c,
      id: 'c-imp-' + Date.now() + '-' + index,
      source,
      dateImport,
    }));

    const existingMap = new Map(existing.map((item) => [item.numeroDossier.toLowerCase(), item]));
    formatted.forEach((item) => {
      existingMap.set(item.numeroDossier.toLowerCase(), item);
    });

    const merged = Array.from(existingMap.values());
    storageService.saveClients(merged);
    return formatted.length;
  },

  getControles: (): COPControle[] => {
    storageService.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTROLES) || '[]');
  },

  saveControles: (controles: COPControle[]) => {
    localStorage.setItem(STORAGE_KEYS.CONTROLES, JSON.stringify(controles));
  },

  addControle: (controle: Omit<COPControle, 'id' | 'dateCreation'>): COPControle => {
    const list = storageService.getControles();
    const newItem: COPControle = {
      ...controle,
      id: 'cop-' + Date.now(),
      dateCreation: new Date().toISOString(),
    };
    list.unshift(newItem);
    storageService.saveControles(list);
    return newItem;
  },

  deleteControle: (id: string) => {
    const list = storageService.getControles().filter((c) => c.id !== id);
    storageService.saveControles(list);
  },

  filterControles: (filters: FilterState): COPControle[] => {
    const list = storageService.getControles();
    return list.filter((c) => {
      if (filters.dateDebut && c.dateControle < filters.dateDebut) return false;
      if (filters.dateFin && c.dateControle > filters.dateFin) return false;
      if (filters.prestataire && filters.prestataire !== 'TOUS' && c.prestataire !== filters.prestataire) return false;
      if (filters.conforme === 'OK' && !c.conforme) return false;
      if (filters.conforme === 'NOK' && c.conforme) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.trim().toLowerCase();
        const matchClient = c.nomClient.toLowerCase().includes(q);
        const matchDossier = c.numeroDossier.toLowerCase().includes(q);
        const matchPrestataire = c.prestataire.toLowerCase().includes(q);
        const matchTechnicien = c.technicien.toLowerCase().includes(q);
        const matchLocalite = c.localite.toLowerCase().includes(q);
        if (!matchClient && !matchDossier && !matchPrestataire && !matchTechnicien && !matchLocalite) {
          return false;
        }
      }
      return true;
    });
  },

  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  getPowerAutomateUrl: (): string => {
    return localStorage.getItem(STORAGE_KEYS.POWER_AUTOMATE_URL) || '';
  },

  setPowerAutomateUrl: (url: string) => {
    localStorage.setItem(STORAGE_KEYS.POWER_AUTOMATE_URL, url.trim());
  },
};
