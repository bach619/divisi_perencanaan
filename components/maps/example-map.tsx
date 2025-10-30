'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function ExampleMap() {
  const position: LatLngExpression = [-3.1425, 120.1797]; // Koordinat Makassar

  return (
    <div className="w-full h-96">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Makassar, Sulawesi Selatan
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
