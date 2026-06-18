import React, { useState } from 'react';

export default function DataTable({ 
  data, 
  categoryKey, 
  categoryLabel, 
  isAdmin, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and Search logic
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      (item.desa || item.lokasi || '').toLowerCase().includes(search.toLowerCase()) ||
      item.kecamatan.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === '' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // CSV Exporter for single item
  const exportSingleCSV = (item) => {
    const headers = ['ID', 'Kategori', 'Nama Sarpras', 'Lokasi (Desa)', 'Kecamatan', 'Latitude', 'Longitude', 'Status Kondisi', 'Tahun Perolehan', 'Keterangan/Detail'];
    const row = [
      item.id,
      categoryLabel,
      item.nama,
      item.desa || item.lokasi || '',
      item.kecamatan,
      item.lat,
      item.lng,
      item.status,
      item.tahun,
      item.detail ? item.detail.replace(/"/g, '""') : ''
    ];
    
    // Add BOM for Indonesian / Special characters Excel compatibility
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), row.map(val => `"${val}"`).join(',')].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_${item.id}_${item.nama.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Exporter for whole filtered table
  const exportTableCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['ID', 'Kategori', 'Nama Sarpras', 'Lokasi (Desa)', 'Kecamatan', 'Latitude', 'Longitude', 'Status Kondisi', 'Tahun Perolehan', 'Keterangan/Detail'];
    const rows = filteredData.map(item => [
      item.id,
      categoryLabel,
      item.nama,
      item.desa || item.lokasi || '',
      item.kecamatan,
      item.lat,
      item.lng,
      item.status,
      item.tahun,
      item.detail ? item.detail.replace(/"/g, '""') : ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), rows.map(r => r.map(val => `"${val}"`).join(',')).join('\n')].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Data_${categoryLabel.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card-content">
      {/* Table Top Controls */}
      <div className="table-controls">
        <div className="search-filter-group">
          <input 
            type="text" 
            placeholder="Cari nama, desa, kecamatan..." 
            className="input-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          
          <select 
            className="select-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={exportTableCSV} 
            disabled={filteredData.length === 0}
            title="Download seluruh data yang difilter ke file CSV"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh Excel/CSV
          </button>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={onAddClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Data
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="table-responsive">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>Data tidak ditemukan. Silakan sesuaikan pencarian atau filter Anda.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>No</th>
                <th>Nama Sarpras</th>
                <th>Lokasi</th>
                <th>Kecamatan</th>
                <th>Tahun</th>
                <th>Kondisi</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--primary-deep)' }}>{item.nama}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lat: {item.lat}, Lng: {item.lng}</div>
                  </td>
                  <td>{item.desa || item.lokasi}</td>
                  <td>{item.kecamatan}</td>
                  <td>{item.tahun}</td>
                  <td>
                    <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: 'center' }}>
                      {isAdmin ? (
                        <>
                          <button 
                            className="btn-action btn-action-edit" 
                            title="Edit Data"
                            onClick={() => onEditClick(item)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button 
                            className="btn-action btn-action-delete" 
                            title="Hapus Data"
                            onClick={() => onDeleteClick(item)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginRight: '0.25rem' }}>
                          Terbaca
                        </span>
                      )}
                      
                      <button 
                        className="btn-action btn-action-download" 
                        title="Download Data Row"
                        onClick={() => exportSingleCSV(item)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Menampilkan <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredData.length)}</strong> dari <strong>{filteredData.length}</strong> data
          </div>
          
          <div className="pagination-buttons">
            <button 
              className="btn-pagination"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn-pagination ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              className="btn-pagination"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
