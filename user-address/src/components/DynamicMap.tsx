// src/components/DynamicMap.tsx
import { useState, useEffect } from 'react';
import type { Contact } from '../lib/types';

interface DynamicMapProps {
  contact: Contact | null;
}

export function DynamicMap({ contact }: DynamicMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ contact: Contact | null }> | null>(null);

  useEffect(() => {
    // Importação dinâmica apenas no cliente
    if (typeof window !== 'undefined') {
      import('../components/Map').then((module) => {
        setMapComponent(() => module.Map);
      });
    }
  }, []);

  if (!MapComponent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return <MapComponent contact={contact} />;
}
