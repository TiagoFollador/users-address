import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Contact } from '../lib/types';
import { useEffect } from 'react';
import L from 'leaflet';

// Corrige o problema do ícone padrão do Leaflet no React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Props {
  contact: Contact | null;
}

export function Map({ contact }: Props) {
  const position: [number, number] = contact
    ? [contact.latitude, contact.longitude]
    : [-14.235, -51.9253]; // Posição padrão (centro do Brasil)

  const zoom = contact ? 15 : 4;

  // O componente MapContainer não reage bem a mudanças de 'center'.
  // Esta é uma forma de forçar a re-renderização quando o contato muda.
  const mapKey = contact ? contact.id : 'default';

  return (
    <MapContainer
      key={mapKey}
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {contact && (
        <Marker position={position}>
          <Popup>{contact.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Map;
