"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, X, Navigation, Check, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./LocationMap"), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
) });

export default function LocationPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [coords, setCoords] = useState({ lat: -7.7956, lng: 110.3695 }); // Yogyakarta default
  const [address, setAddress] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const searchTimeout = useRef(null);

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "id" } }
      );
      const data = await res.json();
      const loc = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(loc);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  }, []);

  const handleMapClick = useCallback((lat, lng) => {
    setCoords({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=id`,
        { headers: { "Accept-Language": "id" } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => handleSearch(q), 400);
  };

  const selectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setCoords({ lat, lng });
    setAddress(item.display_name);
    setQuery(item.display_name);
    setSuggestions([]);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  const handleConfirm = () => {
    const short = address.split(",").slice(0, 3).join(",").trim();
    onChange(short || address);
    setOpen(false);
  };

  return (
    <>
      <div className="relative">
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Magelang, Jawa Tengah"
          className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-xl py-3.5 pl-11 pr-12 text-sm outline-none transition-all font-semibold placeholder:font-normal placeholder:text-gray-300 dark:text-dark-text dark:placeholder:text-gray-600"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          title="Pilih dari peta"
        >
          <MapPin size={15} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ height: "560px" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-border">
              <span className="font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Pilih Lokasi
              </span>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-100 dark:border-dark-border relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Cari nama tempat, kota..."
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 dark:text-dark-text"
                />
                {searching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
              </div>
              {suggestions.length > 0 && (
                <ul className="absolute left-5 right-5 top-full mt-1 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl shadow-lg z-10 overflow-hidden">
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      onClick={() => selectSuggestion(s)}
                      className="px-4 py-2.5 text-sm text-gray-700 dark:text-dark-text hover:bg-blue-50 dark:hover:bg-primary/10 cursor-pointer truncate border-b border-gray-50 dark:border-dark-border last:border-0"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              <MapComponent coords={coords} onMapClick={handleMapClick} />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border flex items-center gap-3">
              <button
                onClick={handleGeolocate}
                disabled={geoLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors disabled:opacity-50"
              >
                {geoLoading ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
                Lokasi Saya
              </button>
              <div className="flex-1 text-xs text-gray-500 dark:text-dark-text-muted truncate">{address || "Klik peta untuk pilih lokasi"}</div>
              <button
                onClick={handleConfirm}
                disabled={!address}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-40"
              >
                <Check size={15} /> Pilih
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
