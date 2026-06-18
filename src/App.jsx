import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import GISMap from './components/GISMap';
import Gallery from './components/Gallery';
import CrudModal from './components/CrudModal';
import LoginModal from './components/LoginModal';
import { CATEGORIES } from './data/seedData';
import { supabase } from './lib/supabase';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Navigation State
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Data State
  const [data, setData] = useState([]);
  
  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCrudModal, setShowCrudModal] = useState(false);
  const [crudEditingItem, setCrudEditingItem] = useState(null);

  // Fetch from Supabase
  const fetchData = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) return; // Skip if not configured
    const { data: supaData, error } = await supabase
      .from('infrastruktur')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching data:', error);
    } else if (supaData) {
      setData(supaData);
    }
  };

  // Initialize Data & User Session on Mount
  useEffect(() => {
    fetchData();

    // Load user session
    const storedUser = localStorage.getItem('portal_psp_admin');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Calculate statistics for Dashboard
  const getStats = () => {
    const total = data.length;
    const baik = data.filter(item => item.status === 'Baik').length;
    const rusakRingan = data.filter(item => item.status === 'Rusak Ringan').length;
    const rusakBerat = data.filter(item => item.status === 'Rusak Berat').length;
    return { total, baik, rusakRingan, rusakBerat };
  };

  const stats = getStats();

  // Authentication Handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('portal_psp_admin', JSON.stringify(userData));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('portal_psp_admin');
  };

  const handleLandingLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginUsername.trim() === 'admin' && loginPassword === 'admin123') {
      const userData = { username: 'admin' };
      setUser(userData);
      localStorage.setItem('portal_psp_admin', JSON.stringify(userData));
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('Nama pengguna atau kata sandi salah!');
    }
  };

  // CRUD Handlers
  const handleSaveItem = async (itemForm) => {
    if (crudEditingItem) {
      // Edit mode
      const { error } = await supabase
        .from('infrastruktur')
        .update({
          nama: itemForm.nama,
          category: itemForm.category,
          kecamatan: itemForm.kecamatan,
          desa: itemForm.desa,
          status: itemForm.status,
          lat: itemForm.lat,
          lng: itemForm.lng,
          foto: itemForm.foto
        })
        .eq('id', itemForm.id);
      
      if (!error) {
        setData(data.map(item => item.id === itemForm.id ? itemForm : item));
      } else {
        alert("Gagal mengupdate data. Pastikan konfigurasi Supabase benar.");
        console.error(error);
      }
    } else {
      // Add mode
      const { data: newRow, error } = await supabase
        .from('infrastruktur')
        .insert([{
          nama: itemForm.nama,
          category: itemForm.category,
          kecamatan: itemForm.kecamatan,
          desa: itemForm.desa,
          status: itemForm.status,
          lat: itemForm.lat,
          lng: itemForm.lng,
          foto: itemForm.foto
        }])
        .select()
        .single();
      
      if (!error && newRow) {
        setData([newRow, ...data]);
      } else {
        alert("Gagal menambah data. Pastikan konfigurasi Supabase benar.");
        console.error(error);
      }
    }
    setShowCrudModal(false);
    setCrudEditingItem(null);
  };

  const handleDeleteItem = async (itemToDelete) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data "${itemToDelete.nama}"?`)) {
      const { error } = await supabase
        .from('infrastruktur')
        .delete()
        .eq('id', itemToDelete.id);
        
      if (!error) {
        setData(data.filter(item => item.id !== itemToDelete.id));
      } else {
        alert("Gagal menghapus data");
        console.error(error);
      }
    }
  };

  const handleEditClick = (item) => {
    setCrudEditingItem(item);
    setShowCrudModal(true);
  };

  const handleAddClick = () => {
    setCrudEditingItem(null);
    setShowCrudModal(true);
  };

  // Get data filtered by category for active table views
  const getCategoryData = () => {
    return data.filter(item => item.category === activeMenu);
  };

  if (!user && !isGuest) {
    return (
      <div className="landing-container">
        <div className="landing-card">
          <div className="landing-header">
            <img 
              src={`${import.meta.env.BASE_URL}logo-kudus.png`} 
              alt="Logo Kabupaten Kudus" 
              className="landing-logo"
            />
            <h1>PORTAL DATA PSP</h1>
            <h2>Sarana &amp; Prasarana Pertanian</h2>
            <h3>Kabupaten Kudus</h3>
          </div>
          
          <form onSubmit={handleLandingLogin} className="landing-form">
            {loginError && (
              <div className="landing-error">
                {loginError}
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Masukkan username admin"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Masukkan password admin"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem' }}>
              Masuk sebagai Admin
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '0.75rem' }}
              onClick={() => setIsGuest(true)}
            >
              Lihat Data sebagai Pengunjung
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--primary-medium)', margin: 0 }}>Dinas Pertanian dan Pangan Kabupaten Kudus</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Main Panel Content */}
      <main className="main-content">
        {/* Header Section */}
        <Header 
          user={user} 
          onLoginClick={() => setShowLoginModal(true)} 
          onLogout={handleLogout}
          stats={stats}
        />

        {/* Dynamic Views based on active Menu */}
        <div className="view-container">
          
          {/* 1. Dashboard View */}
          {activeMenu === 'dashboard' && (
            <div>
              <div className="view-header">
                <div className="view-title">
                  <h1>Ringkasan Informasi &amp; Peta GIS</h1>
                  <p>Monitoring sebaran sarana dan prasarana pertanian Kabupaten Kudus</p>
                </div>
              </div>

              {/* Status Summary Metrics */}
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <h3>Total Infrastruktur</h3>
                    <div className="stat-val">{stats.total}</div>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <h3>Kondisi Baik</h3>
                    <div className="stat-val" style={{ color: 'var(--success)' }}>{stats.baik}</div>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <h3>Rusak Ringan</h3>
                    <div className="stat-val" style={{ color: 'var(--warning)' }}>{stats.rusakRingan}</div>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <h3>Rusak Berat</h3>
                    <div className="stat-val" style={{ color: 'var(--danger)' }}>{stats.rusakBerat}</div>
                  </div>
                  <div className="stat-icon-wrapper stat-icon-danger">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sebaran per Kategori Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {Object.entries(CATEGORIES).map(([key, label]) => {
                  const catCount = data.filter(item => item.category === key).length;
                  return (
                    <div 
                      key={key} 
                      onClick={() => setActiveMenu(key)}
                      style={{ 
                        background: 'white', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border-color)', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="menu-card-hover"
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep)', marginTop: '0.25rem' }}>{catCount} unit</div>
                    </div>
                  );
                })}
              </div>

              {/* GIS Map */}
              <GISMap data={data} />
            </div>
          )}

          {/* 2. Gallery View */}
          {activeMenu === 'galeri' && (
            <div>
              <div className="view-header">
                <div className="view-title">
                  <h1>Galeri Foto Kegiatan</h1>
                  <p>Dokumentasi fisik sarana prasarana pertanian di lapangan</p>
                </div>
              </div>
              
              <Gallery data={data} />
            </div>
          )}

          {/* 3. CRUD Data Table View */}
          {activeMenu !== 'dashboard' && activeMenu !== 'galeri' && (
            <div>
              <div className="view-header">
                <div className="view-title">
                  <h1>Data {CATEGORIES[activeMenu]}</h1>
                  <p>Daftar sarana prasarana {CATEGORIES[activeMenu].toLowerCase()} di Kabupaten Kudus</p>
                </div>
              </div>

              <DataTable 
                data={getCategoryData()} 
                categoryKey={activeMenu}
                categoryLabel={CATEGORIES[activeMenu]} 
                isAdmin={!!user}
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteItem}
              />
            </div>
          )}

        </div>
      </main>

      {/* Modals Containers */}
      
      {/* Admin Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Add / Edit CRUD Modal */}
      {showCrudModal && (
        <CrudModal
          item={crudEditingItem}
          categoryKey={activeMenu}
          onClose={() => {
            setShowCrudModal(false);
            setCrudEditingItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
