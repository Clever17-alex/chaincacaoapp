export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organisation?: string;
  region?: string;
  phone?: string;

}

export interface Producteur {
  id: string;
  nom: string;
  village: string;
  secteur: string;
  surface: number;
  culture: string;
  telephone: string;
  email?: string;
  kyc: string;
  nbLots: number;
  totalKg: number;
}

export interface Lot {
  id: string;
  producteurId?: string;
  producteurName: string;
  espece: 'Forastero' | 'Trinitario' | 'Criollo';
  poidsRecu: number;
  dateReception: string;
  statut: 'recu' | 'en_transfert' | 'traite' | 'exporte';
  certification?: string;
  region: string;
  blockRef?: string;
  txHash?: string;
  createdAt: string;
}

export interface Transfert {
  id: string;
  lotId: string;
  origine: string;
  destinataire: string;
  typeDestinataire: string;
  responsable: string;
  poidsTransfere: number;
  conditionnement: string;
  statut: 'en_attente' | 'signe' | 'confirme' | 'rejete';
  dateCreation: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  NewLot: { step?: number };
  GPS: { lotData: any };
  Photo: { lotData: any };
  Success: { lot: Lot };
  LotDetail: { lot: Lot };
  Notifications: undefined;
  Profile: undefined;
};