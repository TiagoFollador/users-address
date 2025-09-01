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
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function Map({ contact }: { contact: Contact | null }) {
  const position: [number, number] = contact ? [contact.latitude, contact.longitude] : [-14.235, -51.9253]; // Posição padrão (Brasil)
  const zoom = contact ? 15 : 4;

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
      {contact && (
        <Marker position={position}>
          <Popup>{contact.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Map;
