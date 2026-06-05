import React, { useState } from 'react';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Default admin validation: admin / admin123
    if (username.trim() === 'admin' && password === 'admin123') {
      onLoginSuccess({ username: 'admin' });
    } else {
      setError('Nama pengguna atau kata sandi salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src={`${import.meta.env.BASE_URL}logo-kudus.png`} alt="Logo Kudus" style={{ height: '26px', width: 'auto' }} />
            Masuk Administrator
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Silakan masuk menggunakan akun Administrator untuk mengaktifkan fitur Tambah, Edit, dan Hapus data.
              </p>
            </div>

            {error && (
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#fee2e2', 
                color: 'var(--danger)', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '0.8rem', 
                marginBottom: '1rem',
                border: '1px solid #fca5a5',
                fontWeight: 500
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nama Pengguna (Username)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label className="form-label">Kata Sandi (Password)</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
