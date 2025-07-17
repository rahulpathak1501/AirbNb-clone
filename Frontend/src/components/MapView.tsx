import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Property } from "../types/Property";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

interface MapViewProps {
  properties: Property[];
}

const MapView: React.FC<MapViewProps> = ({ properties }) => {
  const center: LatLngExpression = [48.8566, 2.3522]; // Default center (Paris)

  return (
    <MapContainer
      center={center}
      zoom={2}
      className="w-full h-[500px] rounded-xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[
            Math.random() * 140 - 70, // Replace with property.latitude
            Math.random() * 360 - 180, // Replace with property.longitude
          ]}
        >
          <Popup>
            <strong>{property.title}</strong>
            <br />
            {property.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
