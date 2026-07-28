export type Role = 'ADMIN' | 'TECHNICIEN';

export type UserStatus = 'ACTIF' | 'INACTIF';

export interface User {
  id: string;
  personalId: string; // Ex: COP0001
  nom: string;
  prenom: string;
  password?: string;
  role: Role;
  statut: UserStatus;
  mustChangePassword?: boolean;
}

export interface Prestataire {
  id: string;
  nom: string;
  code: string;
  contact?: string;
  statut: 'ACTIF' | 'INACTIF';
  dateAjout: string;
}

export interface ClientProgramme {
  id: string;
  numeroDossier: string;
  nomClient: string;
  prestataire: string;
  localite: string;
  gpsClient: string;
  dateControle?: string;
  source: 'Liste COP A' | 'Liste COP B' | 'Manuelle';
  dateImport: string;
}

export type Gravite = 'Aucune' | 'Mineure' | 'Majeure' | 'Critique';

export type TypeNonConformite =
  | 'AUCUN'
  | 'MANQUE DE POTEAUX'
  | 'TIRAGE MAL EFFECTUÉ'
  | 'POTEAUX NON ARMÉ'
  | 'ONT & PTO MAL FIXÉ'
  | 'GPS CLIENT ERRONÉ'
  | 'SURPLUS DE CÂBLE'
  | 'AUTRE';

export interface COPControle {
  id: string;
  numeroDossier: string;
  nomClient: string;
  prestataire: string;
  localite: string;
  gpsClient: string;
  dateControle: string; // YYYY-MM-DD
  technicien: string;
  conforme: boolean;
  nonConformites: TypeNonConformite[];
  gravite: Gravite;
  commentaire: string;
  responsableAction: string;
  cop: 'OK' | 'NOK';
  dateCreation: string;
}

export interface COPPayloadJSON {
  numeroDossier: string;
  nomClient: string;
  prestataire: string;
  localite: string;
  gpsClient: string;
  dateControle: string;
  technicien: string;
  conforme: boolean;
  nonConformites: string[];
  gravite: string;
  commentaire: string;
  responsableAction: string;
  cop: 'OK' | 'NOK';
}

export interface FilterState {
  dateDebut: string;
  dateFin: string;
  prestataire: string;
  conforme: 'TOUS' | 'OK' | 'NOK';
  searchQuery: string;
}
