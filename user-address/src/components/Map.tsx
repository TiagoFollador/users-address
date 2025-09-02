// src/components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Contact } from '../lib/types';
import L from 'leaflet';
import { useEffect } from 'react';

// Corrige o ícone padrão do Leaflet que pode quebrar no React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Hook customizado para centralizar o mapa quando o contato selecionado muda
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    // Guard: only set view when map and center are available and valid
    if (!map || !center || center.length !== 2 || center[0] == null || center[1] == null) return;
    try {
      map.setView(center, zoom);
    } catch (err) {
      // swallow harmless leaflet errors during hydration/early mount
      // console.debug('ChangeView setView error', err);
    }
  }, [center, zoom, map]);
  return null;
}

export function Map({ contact }: { contact: Contact | null }) {
  // Avoid rendering Leaflet on the server to prevent hydration mismatch and window-related errors
  if (typeof window === 'undefined') {
    return (
      <div className="leaflet-map bg-gray-50 flex items-center justify-center" style={{ height: '200px' }}>
        <span className="text-sm text-gray-500">Mapa disponível no cliente</span>
      </div>
    );
  }

  const position: [number, number] = contact && contact.latitude != null && contact.longitude != null ? [contact.latitude, contact.longitude] : [-14.235, -51.9253]; // Posição padrão (Brasil)
  const zoom = contact && contact.latitude != null && contact.longitude != null ? 15 : 4;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      className="leaflet-map z-1"
      style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
    >
      <ChangeView center={position} zoom={zoom} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {contact && contact.latitude != null && contact.longitude != null && (
        <Marker position={position}>
          <Popup>{contact.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Map;
