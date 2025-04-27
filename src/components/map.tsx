import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import 'leaflet/dist/leaflet.css';


const Map = ({lat, lng}: { lat: number; lng: number }) => {
    return (
        <MapContainer center={[lat, lng]} zoom={13} style={{height: '400px', width: '100%'}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker
                position={[lat, lng]}
                icon={L.icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
            >
                <Popup>
                    You are here!
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;