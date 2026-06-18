import React, { useState } from 'react';
import { CATEGORIES } from '../data/seedData';

export default function Gallery({ data }) {
  const [selectedCat, setSelectedCat] = useState('');
  const [activeLightbox, setActiveLightbox] = useState(null);

  // Filter items that have photos
  const photoItems = data.filter(item => item.foto);

  // Filter based on selected category
  const filteredPhotos = selectedCat
    ? photoItems.filter(item => item.category === selectedCat)
    : photoItems;

  return (
    <div>
      {/* Category Filters */}
      <div className="card-content" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-medium)' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Dokumentasi &amp; Foto Kegiatan
          </h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${selectedCat === '' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCat('')}
            >
              Semua Foto
            </button>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                className={`btn btn-sm ${selectedCat === key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCat(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      {filteredPhotos.length === 0 ? (
        <div className="card-content" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Belum ada dokumentasi foto untuk kategori ini.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredPhotos.map(item => (
            <div 
              key={item.id} 
              className="gallery-card"
              onClick={() => setActiveLightbox(item)}
            >
              <div className="gallery-img-wrapper">
                <img 
                  src={item.foto} 
                  alt={item.nama} 
                  className="gallery-img"
                  loading="lazy"
                />
                <span className="gallery-badge">
                  {CATEGORIES[item.category] || item.category}
                </span>
              </div>
              <div className="gallery-card-body">
                <h3>{item.nama}</h3>
                <div className="gallery-card-meta">
                  <span>{item.desa || item.lokasi}, {item.kecamatan}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-medium)' }}>{item.tahun}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="modal-overlay" onClick={() => setActiveLightbox(null)}>
          <div 
            className="modal-content lightbox-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '750px' }}
          >
            <div className="modal-header">
              <h3>Dokumentasi Kegiatan: {activeLightbox.id}</h3>
              <button className="btn-close-modal" onClick={() => setActiveLightbox(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <img 
              src={activeLightbox.foto} 
              alt={activeLightbox.nama} 
              className="lightbox-img"
            />
            
            <div className="lightbox-body">
              <h2>{activeLightbox.nama}</h2>
              <p className="lightbox-desc">{activeLightbox.detail || 'Tidak ada rincian keterangan.'}</p>
              
              <div className="lightbox-meta">
                <div>
                  <strong>Kecamatan:</strong> {activeLightbox.kecamatan}
                </div>
                <div className="lightbox-detail-item">
                  <strong>Desa/Lokasi:</strong> {activeLightbox.desa || activeLightbox.lokasi}
                </div>
                <div>
                  <strong>Kondisi Asset:</strong> <span style={{ 
                    fontWeight: 700,
                    color: activeLightbox.status === 'Baik' ? 'var(--success)' : 
                           activeLightbox.status === 'Rusak Ringan' ? 'var(--warning)' : 'var(--danger)'
                  }}>{activeLightbox.status}</span>
                </div>
                <div>
                  <strong>Tahun Pembangunan:</strong> {activeLightbox.tahun}
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <strong>Koordinat GPS:</strong> Latitude: {activeLightbox.lat} | Longitude: {activeLightbox.lng}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setActiveLightbox(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
