// src/pages/AppointmentTracker.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const AppointmentTracker = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', doctorName: '', location: '',
    appointmentDate: '', notes: ''
  });

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data);
    } catch { setError('Failed to load appointments.'); }
    finally { setLoading(false); }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/appointments', formData);
      setAppointments(prev => [...prev, res.data].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)));
      setFormData({ title: '', doctorName: '', location: '', appointmentDate: '', notes: '' });
      setShowForm(false);
      setSuccess('Appointment added! You will receive an email reminder the day before.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add appointment.');
    }
  };

  const markComplete = async (id) => {
    try {
      const res = await API.put(`/appointments/${id}`, { completed: true });
      setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
    } catch { setError('Failed to update.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await API.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch { setError('Failed to delete.'); }
  };

  const upcoming = appointments.filter(a => !a.completed && new Date(a.appointmentDate) >= new Date());
  const past = appointments.filter(a => a.completed || new Date(a.appointmentDate) < new Date());

  const getDaysUntil = (date) => {
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getBadge = (date, completed) => {
    if (completed) return <span className="badge badge-green">Completed ✓</span>;
    const days = getDaysUntil(date);
    if (days < 0) return <span className="badge badge-red">Passed</span>;
    if (days === 0) return <span className="badge badge-orange">Today!</span>;
    if (days === 1) return <span className="badge badge-yellow">Tomorrow</span>;
    return <span className="badge badge-blue">In {days} days</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>🏥 Appointments</h1>
        <button className="btn btn-primary btn-lg" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Appointment'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ border: '2px solid #4f46e5', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4f46e5', fontSize: '20px' }}>Add New Appointment</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label style={{ fontSize: '16px' }}>Appointment Title *</label>
              <input name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Blood Pressure Check-up" style={{ fontSize: '16px' }} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Doctor's Name (optional)</label>
                <input name="doctorName" value={formData.doctorName} onChange={handleChange}
                  placeholder="e.g. Dr. Sharma" style={{ fontSize: '16px' }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Hospital / Location (optional)</label>
                <input name="location" value={formData.location} onChange={handleChange}
                  placeholder="e.g. Apollo Hospital" style={{ fontSize: '16px' }} />
              </div>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '16px' }}>Date & Time *</label>
              <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate}
                onChange={handleChange} style={{ fontSize: '16px' }}
                min={new Date().toISOString().slice(0, 16)} required />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '16px' }}>Notes (optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}
                placeholder="e.g. Bring prescription, fasting required" style={{ fontSize: '16px' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Add Appointment</button>
          </form>
        </div>
      )}

      {/* Upcoming */}
      <div className="section-title">Upcoming ({upcoming.length})</div>
      {upcoming.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#718096', padding: '30px', fontSize: '17px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏥</div>
          No upcoming appointments. Add one above!
        </div>
      ) : (
        upcoming.map(a => {
          const days = getDaysUntil(a.appointmentDate);
          return (
            <div key={a._id} className="card" style={{
              borderLeft: `4px solid ${days <= 1 ? '#dd6b20' : '#4f46e5'}`,
              background: days <= 1 ? '#fffaf0' : 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '6px' }}>🏥 {a.title}</div>
                  {a.doctorName && <div style={{ fontSize: '16px', color: '#4a5568', marginBottom: '4px' }}>👨‍⚕️ Dr. {a.doctorName}</div>}
                  {a.location && <div style={{ fontSize: '15px', color: '#718096', marginBottom: '4px' }}>📍 {a.location}</div>}
                  <div style={{ fontSize: '17px', color: '#4f46e5', fontWeight: 600, marginBottom: '4px' }}>
                    📅 {new Date(a.appointmentDate).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {a.notes && <div style={{ fontSize: '14px', color: '#718096', background: '#f7fafc', padding: '8px', borderRadius: '6px', marginTop: '6px' }}>📝 {a.notes}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  {getBadge(a.appointmentDate, false)}
                  <button className="btn btn-sm btn-success" onClick={() => markComplete(a._id)}>✓ Done</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>🗑 Delete</button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Past / Completed */}
      {past.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <div className="section-title">Past / Completed ({past.length})</div>
          {past.slice(0, 5).map(a => (
            <div key={a._id} className="card" style={{ opacity: 0.6, borderLeft: '4px solid #a0aec0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, textDecoration: a.completed ? 'line-through' : 'none', fontSize: '16px' }}>{a.title}</div>
                  <div style={{ color: '#718096', fontSize: '14px' }}>
                    {new Date(a.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {a.doctorName && ` · Dr. ${a.doctorName}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {getBadge(a.appointmentDate, a.completed)}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentTracker;
