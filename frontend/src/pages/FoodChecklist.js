// src/pages/FoodChecklist.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const FoodChecklist = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [log, setLog] = useState({
    breakfast: { eaten: false, notes: '', time: '' },
    lunch: { eaten: false, notes: '', time: '' },
    dinner: { eaten: false, notes: '', time: '' },
    waterGlasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLog(selectedDate);
  }, [selectedDate]);

  const fetchLog = async (date) => {
    setLoading(true);
    try {
      const res = await API.get(`/food/${date}`);
      setLog(res.data);
    } catch {
      setLog({ breakfast: { eaten: false, notes: '', time: '' }, lunch: { eaten: false, notes: '', time: '' }, dinner: { eaten: false, notes: '', time: '' }, waterGlasses: 0 });
    } finally { setLoading(false); }
  };

  const updateMeal = async (meal, field, value) => {
    const updated = {
      ...log,
      [meal]: { ...log[meal], [field]: value }
    };
    setLog(updated);
    setSaving(meal);
    try {
      const res = await API.put(`/food/${selectedDate}`, updated);
      setLog(res.data);
      setSuccess(`${meal} updated!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) { console.error(err); }
    finally { setSaving(''); }
  };

  const updateWater = async (count) => {
    const updated = { ...log, waterGlasses: count };
    setLog(updated);
    try {
      await API.put(`/food/${selectedDate}`, updated);
    } catch (err) { console.error(err); }
  };

  const meals = [
    { key: 'breakfast', icon: '🌅', label: 'Breakfast', color: '#fef3c7', border: '#f59e0b', time: '7:00–9:00 AM' },
    { key: 'lunch', icon: '☀️', label: 'Lunch', color: '#d1fae5', border: '#10b981', time: '12:00–2:00 PM' },
    { key: 'dinner', icon: '🌙', label: 'Dinner', color: '#dbeafe', border: '#3b82f6', time: '7:00–9:00 PM' },
  ];

  const todayLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h1 className="page-title">🍽️ Food Checklist</h1>

      {/* Date Selector */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label style={{ fontSize: '16px' }}>Select Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            style={{ fontSize: '16px' }} max={today} />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#4a5568' }}>{todayLabel}</div>
      </div>

      {success && <div className="alert alert-success" style={{ fontSize: '16px' }}>{success}</div>}

      {/* Meal Cards */}
      {meals.map(meal => {
        const mealData = log[meal.key] || { eaten: false, notes: '', time: '' };
        return (
          <div key={meal.key} className="card" style={{
            background: mealData.eaten ? meal.color : 'white',
            border: `2px solid ${mealData.eaten ? meal.border : '#e2e8f0'}`,
            marginBottom: '16px',
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: mealData.eaten ? '16px' : 0 }}>
              <span style={{ fontSize: '40px' }}>{meal.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>{meal.label}</div>
                <div style={{ fontSize: '14px', color: '#718096' }}>Suggested: {meal.time}</div>
              </div>
              {/* Big checkbox for elders */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '18px', fontWeight: 600, color: mealData.eaten ? '#276749' : '#718096' }}>
                <input
                  type="checkbox"
                  checked={mealData.eaten}
                  onChange={e => updateMeal(meal.key, 'eaten', e.target.checked)}
                  style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                />
                {mealData.eaten ? '✅ Eaten' : 'Mark Eaten'}
              </label>
            </div>

            {mealData.eaten && (
              <div style={{ paddingLeft: '4px' }}>
                <div className="grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '15px' }}>Time eaten</label>
                    <input type="time" value={mealData.time || ''}
                      onChange={e => updateMeal(meal.key, 'time', e.target.value)}
                      style={{ fontSize: '15px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '15px' }}>What did you eat? (optional)</label>
                    <input value={mealData.notes || ''} placeholder="e.g. Rice and dal"
                      onChange={e => updateMeal(meal.key, 'notes', e.target.value)}
                      style={{ fontSize: '15px' }} />
                  </div>
                </div>
                {saving === meal.key && <p style={{ color: '#718096', fontSize: '13px', marginTop: '8px' }}>Saving...</p>}
              </div>
            )}
          </div>
        );
      })}

      {/* Water Tracker */}
      <div className="card" style={{ background: '#e0f2fe', border: '2px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '36px' }}>💧</span>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>Water Intake</div>
            <div style={{ color: '#718096', fontSize: '14px' }}>Recommended: 8 glasses daily</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-lg" style={{ background: '#0284c7', color: 'white', fontSize: '24px', width: '48px', height: '48px', padding: 0, borderRadius: '50%' }}
            onClick={() => updateWater(Math.max(0, (log.waterGlasses || 0) - 1))}
            disabled={(log.waterGlasses || 0) <= 0}>−</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#0284c7', lineHeight: 1 }}>{log.waterGlasses || 0}</div>
            <div style={{ fontSize: '14px', color: '#718096' }}>glasses</div>
          </div>
          <button className="btn btn-lg" style={{ background: '#0284c7', color: 'white', fontSize: '24px', width: '48px', height: '48px', padding: 0, borderRadius: '50%' }}
            onClick={() => updateWater((log.waterGlasses || 0) + 1)}>+</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} style={{ fontSize: '24px', opacity: i < (log.waterGlasses || 0) ? 1 : 0.2 }}>💧</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card" style={{ marginTop: '16px', background: '#f8fafc' }}>
        <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '16px' }}>📊 Today's Summary</div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {meals.map(m => (
            <span key={m.key} style={{ fontSize: '15px' }}>
              {m.icon} {m.label}: {(log[m.key]?.eaten) ? <span style={{ color: '#38a169', fontWeight: 600 }}>✓</span> : <span style={{ color: '#e53e3e' }}>✗</span>}
            </span>
          ))}
          <span style={{ fontSize: '15px' }}>💧 Water: <strong>{log.waterGlasses || 0}/8</strong></span>
        </div>
      </div>
    </div>
  );
};

export default FoodChecklist;
