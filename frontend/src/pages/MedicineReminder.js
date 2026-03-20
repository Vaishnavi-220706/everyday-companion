// src/pages/MedicineReminder.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const FREQUENCY_LABELS = {
  daily: 'Once Daily',
  twice_daily: 'Twice Daily',
  three_times_daily: 'Three Times Daily',
  weekly: 'Weekly',
  as_needed: 'As Needed'
};

const MedicineReminder = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: '', dosage: '', reminderTime: '08:00',
    frequency: 'daily', sendEmail: false
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicines');
      setMedicines(res.data);
    } catch { setError('Failed to load medicines.'); }
    finally { setLoading(false); }
  };

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/medicines', formData);
      setMedicines(prev => [...prev, res.data]);
      setFormData({ medicineName: '', dosage: '', reminderTime: '08:00', frequency: 'daily', sendEmail: false });
      setShowForm(false);
      setSuccess('Medicine reminder added! You will be notified at ' + formData.reminderTime);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add medicine.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this medicine reminder?')) return;
    try {
      await API.delete(`/medicines/${id}`);
      setMedicines(prev => prev.filter(m => m._id !== id));
    } catch { setError('Failed to delete.'); }
  };

  const toggleActive = async (med) => {
    try {
      const res = await API.put(`/medicines/${med._id}`, { active: !med.active });
      setMedicines(prev => prev.map(m => m._id === med._id ? res.data : m));
    } catch { setError('Failed to update.'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>💊 Medicine Reminders</h1>
        <button className="btn btn-primary btn-lg" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Medicine'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ border: '2px solid #4f46e5', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4f46e5', fontSize: '20px' }}>Add Medicine Reminder</h3>
          <form onSubmit={handleAdd}>
            <div className="grid-2">
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Medicine Name *</label>
                <input name="medicineName" value={formData.medicineName} onChange={handleChange}
                  placeholder="e.g. Metformin" style={{ fontSize: '16px' }} required />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Dosage (optional)</label>
                <input name="dosage" value={formData.dosage} onChange={handleChange}
                  placeholder="e.g. 500mg, 1 tablet" style={{ fontSize: '16px' }} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Reminder Time *</label>
                <input type="time" name="reminderTime" value={formData.reminderTime}
                  onChange={handleChange} style={{ fontSize: '16px' }} required />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Frequency</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange} style={{ fontSize: '16px' }}>
                  {Object.entries(FREQUENCY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="checkbox" name="sendEmail" id="sendEmail"
                checked={formData.sendEmail} onChange={handleChange}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <label htmlFor="sendEmail" style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 500, marginBottom: 0 }}>
                📧 Send email reminder at this time
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Add Reminder</button>
          </form>
        </div>
      )}

      {/* Medicine List */}
      {medicines.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💊</div>
          <p style={{ fontSize: '18px' }}>No medicine reminders yet. Add your first one above!</p>
        </div>
      ) : (
        medicines.map(med => (
          <div key={med._id} className="card" style={{
            borderLeft: `4px solid ${med.active ? '#e53e3e' : '#a0aec0'}`,
            background: med.active ? 'white' : '#f7fafc',
            opacity: med.active ? 1 : 0.7
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>
                  💊 {med.medicineName}
                </div>
                {med.dosage && <div style={{ color: '#4a5568', fontSize: '16px' }}>Dosage: {med.dosage}</div>}
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#4f46e5', fontSize: '16px', fontWeight: 600 }}>
                    ⏰ {med.reminderTime}
                  </span>
                  <span style={{ color: '#718096', fontSize: '15px' }}>
                    📅 {FREQUENCY_LABELS[med.frequency]}
                  </span>
                  {med.sendEmail && <span style={{ color: '#38a169', fontSize: '15px' }}>📧 Email On</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`btn btn-sm ${med.active ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => toggleActive(med)}
                  style={{ fontSize: '14px' }}
                >
                  {med.active ? '⏸ Pause' : '▶ Activate'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(med._id)} style={{ fontSize: '14px' }}>
                  🗑 Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}


    </div>
  );
};

export default MedicineReminder;
