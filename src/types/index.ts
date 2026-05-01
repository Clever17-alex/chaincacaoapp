export type LotStatus = 
  | 'CREATED' 
  | 'RECEIVED' 
  | 'PROCESSING' 
  | 'EXPORTED' 
  | 'EUDR_STATEMENT' 
  | 'DELIVERED';

export type TimestampEvent = {
  status: LotStatus;
  label: string;
  subtitle?: string;
  date: string;
  done: boolean;
};

export interface Lot {
  id: string;
  fullId: string;
  species: string;
  weight: number;
  cultureMode: string;
  harvestDate: string;
  note?: string;
  location: {
    lat: number;
    lng: number;
  };
  photoUri?: string;
  status: LotStatus;
  createdAt: string;
  cooperative?: string;
  qrCode?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'alert';
  title: string;
  subtitle: string;
  lotId: string;
  timestamp: string;
}