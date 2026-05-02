import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Lot {
  id: string;
  fullId: string;
  species: string;
  weight: number;
  cultureMode: string;
  harvestDate: string;
  location: { lat: number; lng: number };
  photoUri?: string;
  status: string;
  createdAt: string;
}

interface LotContextType {
  lots: Lot[];
  addLot: (lot: Lot) => void;
}

const LotContext = createContext<LotContextType>({ lots: [], addLot: () => {} });

export function LotProvider({ children }: { children: ReactNode }) {
  const [lots, setLots] = useState<Lot[]>([]);

  const addLot = (lot: Lot) => {
    setLots((prev) => [lot, ...prev]);
  };

  return (
    <LotContext.Provider value={{ lots, addLot }}>
      {children}
    </LotContext.Provider>
  );
}

export const useLots = () => useContext(LotContext);