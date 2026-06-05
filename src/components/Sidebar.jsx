import React from 'react';
import { CATEGORIES } from '../data/seedData';

export default function Sidebar({ activeMenu, onMenuChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img 
          src="/logo-kudus.png" 
          alt="Logo Kudus" 
          className="sidebar-logo" 
        />
        <div className="sidebar-title">
          PORTAL PSP
          <span>Kabupaten Kudus</span>
        </div>
      </div>

      <nav style={{ flexGrow: 1 }}>
        <ul className="sidebar-menu">
          <li>
            <button 
              className={`menu-item-button ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => onMenuChange('dashboard')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              Peta GIS &amp; Dashboard
            </button>
          </li>
          
          <li style={{ margin: '1rem 0 0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
            Kategori Sarpras
          </li>

          {Object.entries(CATEGORIES).map(([key, label]) => {
            // Choose an icon based on category key
            let iconPath = (
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> // default
            );
            if (key === 'jaringan_irigasi') {
              iconPath = (
                <>
                  <path d="M12 22v-8M5 14h14M19 14c0-3.87-3.13-7-7-7s-7 3.13-7 7M12 2v3M12 7c-1.66 0-3 1.34-3 3v4h6v-4c0-1.66-1.34-3-3-3z" />
                </>
              );
            } else if (key === 'irigasi_perpompaan') {
              iconPath = (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <path d="m12 8-4 4 4 4M16 12H8" />
                </>
              );
            } else if (key === 'irigasi_perpipaan') {
              iconPath = (
                <>
                  <path d="M3 12h18M3 8h18M3 16h18" />
                </>
              );
            } else if (key === 'jalan_usaha_tani') {
              iconPath = (
                <>
                  <path d="M3 22 21 2M6 22 22 6M2 18l16-16" />
                </>
              );
            } else if (key === 'alat_mesin_pertanian') {
              iconPath = (
                <>
                  <circle cx="6" cy="19" r="3" />
                  <circle cx="17" cy="19" r="3" />
                  <path d="M9 19h5M2 19h1M17 16V8h-6V4H7v4H4v8h6v3" />
                </>
              );
            } else if (key === 'bangunan_konvensional') {
              iconPath = (
                <>
                  <path d="M3 21h18M3 10l9-7 9 7v11H3V10z" />
                  <path d="M9 21V12h6v9" />
                </>
              );
            }

            return (
              <li key={key}>
                <button
                  className={`menu-item-button ${activeMenu === key ? 'active' : ''}`}
                  onClick={() => onMenuChange(key)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {iconPath}
                  </svg>
                  {label}
                </button>
              </li>
            );
          })}

          <li style={{ margin: '1rem 0 0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
            Galeri
          </li>
          
          <li>
            <button 
              className={`menu-item-button ${activeMenu === 'galeri' ? 'active' : ''}`}
              onClick={() => onMenuChange('galeri')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Foto Kegiatan
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        &copy; 2026 Pemkab Kudus<br />
        Dinas Pertanian &amp; Pangan
      </div>
    </aside>
  );
}
