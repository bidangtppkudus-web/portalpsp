import React from 'react';

export default function Header({ user, onLoginClick, onLogout, stats }) {
  return (
    <header className="app-header">
      <div className="header-branding">
        <img 
          src={`${import.meta.env.BASE_URL}logo-kudus.png`} 
          alt="Logo Kabupaten Kudus" 
          className="header-logo"
        />
        <div className="header-text">
          <h2>Portal Data Sarana &amp; Prasarana Pertanian</h2>
          <p>Dinas Pertanian dan Pangan Kabupaten Kudus</p>
        </div>
      </div>

      <div className="header-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Portal
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>
              Keluar
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Admin
          </button>
        )}
      </div>
    </header>
  );
}
