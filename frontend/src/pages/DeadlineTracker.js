// src/pages/DeadlineTracker.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const DeadlineTracker = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ taskName: '', subject: '', dueDate: '' });

  const fetchDeadlines = async () => {
    try {
      const res = await API.get('/deadlines');
      setDeadlines(res.data);
    } catch (err) {
      setError('Failed to load deadlines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeadlines(); }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/deadlines', formData);
      setDeadlines(prev => [...prev, res.data].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
      setFormData({ taskName: '', subject: '', dueDate: '' });
      setShowForm(false);
      setSuccess('Deadline added! You will receive an email reminder 2 days before.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add deadline.');
    }
  };

  const toggleComplete = async (id, current) => {
    try {
      const res = await API.put(`/deadlines/${id}`, { completed: !current });
      setDeadlines(prev => prev.map(d => d._id === id ? res.data : d));
    } catch (err) {
      setError('Failed to update.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deadline?')) return;
    try {
      await API.delete(`/deadlines/${id}`);
      setDeadlines(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      setError('Failed to delete.');
    }
  };

  const getDaysLeft = (dueDate) => Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  const getUrgencyStyle = (days, completed) => {
    if (completed) return { borderLeft: '4px solid #a0aec0', background: '#f7fafc', opacity: 0.6 };
    if (days < 0) return { borderLeft: '4px solid #e53e3e', background: '#fff5f5' };
    if (days === 0) return { borderLeft: '4px solid #dd6b20', background: '#fffaf0' };
    if (days <= 2) return { borderLeft: '4px solid #d69e2e', background: '#fffff0' };
    return { borderLeft: '4px solid #38a169', background: '#f0fff4' };
  };

  const getUrgencyBadge = (days, completed) => {
    if (completed) return <span className="badge" style={{ background: '#e2e8f0', color: '#718096' }}>Done ✓</span>;
    if (days < 0) return <span className="badge badge-red">Overdue! ({Math.abs(days)}d ago)</span>;
    if (days === 0) return <span className="badge badge-orange">Due Today!</span>;
    if (days <= 2) return <span className="badge badge-yellow">{days} day{days !== 1 ? 's' : ''} left</span>;
    return <span className="badge badge-green">{days} days left</span>;
  };

  const pending = deadlines.filter(d => !d.completed);
  const completed = deadlines.filter(d => d.completed);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading deadlines...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>📚 Deadline Tracker</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Deadline'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add Deadline Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px', border: '2px solid #4f46e5' }}>
          <h3 style={{ marginBottom: '16px', color: '#4f46e5' }}>Add New Deadline</h3>
          <form onSubmit={handleAdd}>
            <div className="grid-2">
              <div className="form-group">
                <label>Task / Assignment Name</label>
                <input name="taskName" value={formData.taskName} onChange={handleChange}
                  placeholder="e.g. Math Assignment 3" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input name="subject" value={formData.subject} onChange={handleChange}
                  placeholder="e.g. Mathematics" required />
              </div>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} required />
            </div>
            <button type="submit" className="btn btn-primary">Add Deadline</button>
          </form>
        </div>
      )}

      {/* Pending Deadlines */}
      <div className="section-title">Pending ({pending.length})</div>
      {pending.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#718096' }}>
          🎉 No pending deadlines! Add one above.
        </div>
      ) : (
        pending.map(d => {
          const days = getDaysLeft(d.dueDate);
          return (
            <div key={d._id} className="card" style={getUrgencyStyle(days, false)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {d.taskName}
                  </div>
                  <div style={{ color: '#718096', fontSize: '13px' }}>
                    📖 {d.subject} &nbsp;|&nbsp; 📅 Due: {new Date(d.dueDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getUrgencyBadge(days, false)}
                  <button className="btn btn-sm btn-success" onClick={() => toggleComplete(d._id, false)}>✓ Done</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d._id)}>🗑</button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Completed Deadlines */}
      {completed.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div className="section-title">Completed ({completed.length})</div>
          {completed.map(d => (
            <div key={d._id} className="card" style={getUrgencyStyle(0, true)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, textDecoration: 'line-through', color: '#718096' }}>{d.taskName}</div>
                  <div style={{ color: '#a0aec0', fontSize: '13px' }}>{d.subject}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge" style={{ background: '#e2e8f0', color: '#718096' }}>Done ✓</span>
                  <button className="btn btn-sm btn-outline" onClick={() => toggleComplete(d._id, true)}>Undo</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d._id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeadlineTracker;
