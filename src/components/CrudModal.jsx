import React, { useState, useEffect } from 'react';
import { KECAMATAN_KUDUS } from '../data/seedData';

export default function CrudModal({ item, categoryKey, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    kecamatan: KECAMATAN_KUDUS[0],
    lat: '',
    lng: '',
    status: 'Baik',
    tahun: new Date().getFullYear(),
    detail: '',
    foto: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form if we are editing an existing item
  useEffect(() => {
    if (item) {
      setFormData({
        nama: item.nama || '',
        lokasi: item.desa || item.lokasi || '',
        kecamatan: item.kecamatan || KECAMATAN_KUDUS[0],
        lat: item.lat || '',
        lng: item.lng || '',
        status: item.status || 'Baik',
        tahun: item.tahun || new Date().getFullYear(),
        detail: item.detail || '',
        foto: item.foto || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lat' || name === 'lng' || name === 'tahun' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, foto: 'Ukuran foto terlalu besar. Maksimal 2MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        foto: reader.result
      }));
      setErrors(prev => ({ ...prev, foto: null }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.nama.trim()) tempErrors.nama = 'Nama sarana prasarana wajib diisi';
    if (!formData.lokasi.trim()) tempErrors.lokasi = 'Lokasi/Desa wajib diisi';
    if (!formData.kecamatan) tempErrors.kecamatan = 'Kecamatan wajib dipilih';
    
    // Coordinates checks for Kudus range approx lat [-7.0 to -6.5], lng [110.6 to 111.0]
    if (formData.lat === '') {
      tempErrors.lat = 'Latitude wajib diisi';
    } else if (formData.lat > -6.0 || formData.lat < -7.5) {
      tempErrors.lat = 'Latitude tidak valid untuk wilayah Kudus (rentang -6.5 s/d -7.0)';
    }

    if (formData.lng === '') {
      tempErrors.lng = 'Longitude wajib diisi';
    } else if (formData.lng < 110.5 || formData.lng > 111.2) {
      tempErrors.lng = 'Longitude tidak valid untuk wilayah Kudus (rentang 110.7 s/d 111.0)';
    }

    if (!formData.tahun) {
      tempErrors.tahun = 'Tahun pembangunan wajib diisi';
    } else if (formData.tahun < 1980 || formData.tahun > new Date().getFullYear()) {
      tempErrors.tahun = `Tahun tidak valid (1980 - ${new Date().getFullYear()})`;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Apply a default agricultural placeholder photo if none is provided
    let finalFoto = formData.foto.trim();
    if (!finalFoto) {
      finalFoto = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
    }

    onSave({
      ...formData,
      foto: finalFoto,
      category: item ? item.category : categoryKey,
      id: item ? item.id : `${categoryKey.substring(0, 4)}-${Date.now()}`
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Data Sarpras' : 'Tambah Data Sarpras Baru'}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nama Sarana &amp; Prasarana *</label>
              <input 
                type="text" 
                name="nama" 
                className="form-control" 
                placeholder="Contoh: Pintu Air Irigasi Blok A"
                value={formData.nama}
                onChange={handleChange}
              />
              {errors.nama && <span className="form-error">{errors.nama}</span>}
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Lokasi (Dusun/Desa) *</label>
                <input 
                  type="text" 
                  name="lokasi" 
                  className="form-control" 
                  placeholder="Contoh: Desa Loram Wetan"
                  value={formData.lokasi}
                  onChange={handleChange}
                />
                {errors.lokasi && <span className="form-error">{errors.lokasi}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Kecamatan *</label>
                <select 
                  name="kecamatan" 
                  className="form-control"
                  value={formData.kecamatan}
                  onChange={handleChange}
                >
                  {KECAMATAN_KUDUS.map(kec => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
                {errors.kecamatan && <span className="form-error">{errors.kecamatan}</span>}
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Latitude (GPS) *</label>
                <input 
                  type="number" 
                  step="0.000001"
                  name="lat" 
                  className="form-control" 
                  placeholder="Contoh: -6.8239"
                  value={formData.lat}
                  onChange={handleChange}
                />
                {errors.lat && <span className="form-error">{errors.lat}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Longitude (GPS) *</label>
                <input 
                  type="number" 
                  step="0.000001"
                  name="lng" 
                  className="form-control" 
                  placeholder="Contoh: 110.8407"
                  value={formData.lng}
                  onChange={handleChange}
                />
                {errors.lng && <span className="form-error">{errors.lng}</span>}
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Tahun Pembangunan *</label>
                <input 
                  type="number" 
                  name="tahun" 
                  className="form-control" 
                  placeholder="Contoh: 2022"
                  value={formData.tahun}
                  onChange={handleChange}
                />
                {errors.tahun && <span className="form-error">{errors.tahun}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Kondisi Asset *</label>
                <select 
                  name="status" 
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan / Deskripsi Kegiatan</label>
              <textarea 
                name="detail" 
                className="form-control" 
                placeholder="Rincian informasi sarana prasarana..."
                value={formData.detail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unggah Foto Kegiatan (Opsional)</label>
              
              {formData.foto ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img 
                      src={formData.foto} 
                      alt="Preview Unggahan" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, foto: '' }))}
                      style={{ 
                        position: 'absolute', 
                        top: '0.5rem', 
                        right: '0.5rem', 
                        backgroundColor: 'rgba(239, 68, 68, 0.9)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '30px', 
                        height: '30px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'background-color 0.2s'
                      }}
                      title="Hapus foto"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  style={{ 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '1.5rem', 
                    textAlign: 'center',
                    backgroundColor: '#fafbfc',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-deep)', margin: 0 }}>
                    Pilih File Gambar
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>
                    Format PNG, JPG, JPEG (Maks. 2MB)
                  </p>
                </div>
              )}
              {errors.foto && <span className="form-error">{errors.foto}</span>}
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
