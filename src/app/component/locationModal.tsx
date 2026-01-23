'use client';
import L, { LeafletMouseEvent, LatLngTuple } from "leaflet";
import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  setLocation: (loc: string) => void;
}

export default function LocationModal({ isOpen, onClose, location, setLocation }: LocationModalProps) {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  // const defaultCenter: LatLngExpression = [31.5, 34.47];

  const center: LatLngTuple = useMemo(() => [31.5, 34.47], []);
  const MapClickHandler = () => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
        setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-[#592E2E]">Set Your Location</h2>

        <MapContainer
        //   center={[31.5, 34.47]}
          center={center}
          zoom={8}
          className="w-full h-48 rounded-2xl mb-4"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markerPos && <Marker position={markerPos} />}
          <MapClickHandler />
        </MapContainer>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 border border-[#D6B2B2]/30 rounded-full focus:outline-none focus:border-[#733F3F] focus:ring-1 focus:ring-[#733F3F] transition mb-4"
          placeholder="Or type your address manually"
        />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#592E2E] text-white hover:bg-[#733F3F] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

