import { Lot, Notification, TimestampEvent } from '../types';

export const MOCK_LOTS: Lot[] = [
  {
    id: 'TOGO-2026-001',
    fullId: 'TOGO-2026-001-ABC123',
    species: 'Trinitario',
    weight: 1500,
    cultureMode: 'Agroforesterie',
    harvestDate: '15 décembre 2025',
    location: { lat: 6.12345, lng: 1.23456 },
    status: 'PROCESSING',
    createdAt: '16 déc. 2025',
    cooperative: 'Coopérative Koffah',
  },
  {
    id: 'TOGO-2026-002',
    fullId: 'TOGO-2026-002-DEF456',
    species: 'Forastero',
    weight: 2200,
    cultureMode: 'Agroforesterie',
    harvestDate: '10 décembre 2025',
    location: { lat: 6.23456, lng: 1.34567 },
    status: 'EXPORTED',
    createdAt: '11 déc. 2025',
    cooperative: 'Coopérative Koffah',
  },
  {
    id: 'TOGO-2026-003',
    fullId: 'TOGO-2026-003-GHI789',
    species: 'Criollo',
    weight: 800,
    cultureMode: 'Monoculture',
    harvestDate: '20 décembre 2025',
    location: { lat: 6.34567, lng: 1.45678 },
    status: 'CREATED',
    createdAt: '20 déc. 2025',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Lot exporté avec succès',
    subtitle: 'TOGO-2026-001 est parti du port de Lomé',
    lotId: 'TOGO-2026-001',
    timestamp: "Aujourd'hui · 08h12",
  },
  {
    id: '2',
    type: 'info',
    title: 'Lot reçu à la coopérative',
    subtitle: 'Jean Claude a confirmé la réception',
    lotId: 'TOGO-2026-002',
    timestamp: 'Hier · 17h45',
  },
  {
    id: '3',
    type: 'info',
    title: 'Certification bio attachée',
    subtitle: 'Ecocert Togo a validé votre lot',
    lotId: 'TOGO-2026-002',
    timestamp: '22 déc. · 11h00',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Action requise',
    subtitle: 'Photo du lot manquante — TOGO-2026-003',
    lotId: 'TOGO-2026-003',
    timestamp: '20 déc. · 09h30',
  },
];

export const MOCK_TIMELINE: TimestampEvent[] = [
  {
    status: 'CREATED',
    label: 'Lot créé',
    date: '16 déc. 2025 · 14h30',
    done: true,
  },
  {
    status: 'RECEIVED',
    label: 'Reçu — Coopérative Koffah',
    date: '17 déc. 2025',
    done: true,
  },
  {
    status: 'PROCESSING',
    label: 'En traitement',
    subtitle: 'Fermentation en cours...',
    date: 'En cours',
    done: false,
  },
  {
    status: 'EXPORTED',
    label: 'Export',
    date: 'À venir',
    done: false,
  },
  {
    status: 'EUDR_STATEMENT',
    label: 'EUDR Statement',
    date: 'À venir',
    done: false,
  },
  {
    status: 'DELIVERED',
    label: 'Livraison UE',
    date: 'À venir',
    done: false,
  },
];