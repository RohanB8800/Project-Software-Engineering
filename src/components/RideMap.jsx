import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue with bundlers like Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RideMap = ({ routes, height = '400px' }) => {
  if (!routes || routes.length === 0) {
    return <div>Loading map...</div>;
  }

  const allPoints = routes.flat();
  const bounds = allPoints.length > 0 ? L.latLngBounds(allPoints) : null;

  return (
    <MapContainer
      bounds={bounds}
      style={{ height, width: '100%' }}
      className="rounded-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {routes.map((route, index) => (
        <React.Fragment key={index}>
          <Polyline positions={route} color="blue" />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default RideMap;