import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CATEGORIES } from '../data/seedData';

// Fix Leaflet default icon configuration issues in bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function GISMap({ data }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerGroupRef = useRef(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Kudus coordinate center: Latitude -6.8048, Longitude 110.8407
  const kudusCenter = [-6.8048, 110.8407];

  // Filter data based on selected category on the map
  const filteredData = selectedCategoryFilter 
    ? data.filter(item => item.category === selectedCategoryFilter)
    : data;

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Create map
      mapRef.current = L.map(mapContainerRef.current).setView(kudusCenter, 12);
      
      // Load OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Create a layer group for markers
      markerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Cleanup map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers when filteredData changes
  useEffect(() => {
    if (mapRef.current && markerGroupRef.current) {
      // Clear previous markers
      markerGroupRef.current.clearLayers();

      // Add new markers
      filteredData.forEach(item => {
        if (!item.lat || !item.lng) return;

        // Custom HTML popup markup matching the portal theme
        const popupHtml = `
          <div class="map-popup-card">
            ${item.foto ? `<img src="${item.foto}" class="map-popup-img" alt="${item.nama}" />` : ''}
            <div class="map-popup-body">
              <div class="map-popup-title">${item.nama}</div>
              <div class="map-popup-desc">${item.detail ? item.detail.substring(0, 100) + '...' : ''}</div>
              
              <div class="map-popup-info">
                <div class="map-popup-row">
                  <span class="map-popup-label">Kondisi:</span>
                  <span style="font-weight:700; color: ${
                    item.status === 'Baik' ? 'var(--success)' : 
                    item.status === 'Rusak Ringan' ? 'var(--warning)' : 'var(--danger)'
                  }">${item.status}</span>
                </div>
                <div class="map-popup-row">
                  <span class="map-popup-label">Kecamatan:</span>
                  <span class="map-popup-val">${item.kecamatan}</span>
                </div>
                <div class="map-popup-row">
                  <span class="map-popup-label">Lokasi:</span>
                  <span class="map-popup-val">${item.desa || item.lokasi || ''}</span>
                </div>
                ${item.panjang_terbangun ? `
                <div class="map-popup-row">
                  <span class="map-popup-label">Panjang:</span>
                  <span class="map-popup-val">${item.panjang_terbangun} m</span>
                </div>
                ` : ''}
                <div class="map-popup-row">
                  <span class="map-popup-label">Kategori:</span>
                  <span class="map-popup-val">${CATEGORIES[item.category] || item.category}</span>
                </div>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker([item.lat, item.lng])
          .bindPopup(popupHtml, {
            maxWidth: 280,
            closeButton: true
          });

        markerGroupRef.current.addLayer(marker);
      });

      // Fit bounds if we have markers
      if (filteredData.length > 0) {
        const bounds = L.latLngBounds(filteredData.map(item => [item.lat, item.lng]));
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } else {
        mapRef.current.setView(kudusCenter, 12);
      }
    }
  }, [filteredData]);

  return (
    <div className="map-container-wrapper">
      <div className="map-controls">
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-medium)' }}>
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          Peta Lokasi Sarpras Pertanian Kabupaten Kudus
        </h3>
        
        <div>
          <label htmlFor="map-cat-filter" style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>
            Saring Peta:
          </label>
          <select
            id="map-cat-filter"
            className="select-filter"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            <option value="">Semua Sarana &amp; Prasarana</option>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Target element for Leaflet */}
      <div ref={mapContainerRef} className="map-container" id="gis-map-view"></div>
    </div>
  );
}
