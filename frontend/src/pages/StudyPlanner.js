// src/pages/StudyPlanner.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const StudyPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ subject: '', duration: 30, priority: 'medium' });
  const [breakInterval, setBreakInterval] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timetable, setTimetable] = useState([]);
  const [startTime, setStartTime] = useState('09:00');

  useEffect(() => {
    fetchPlanForDate(selectedDate);
  }, [selectedDate]);

  const fetchPlanForDate = async (date) => {
    setLoading(true);
    setCurrentPlan(null);
    setTimetable([]);
    setTasks([]);
    try {
      const res = await API.get(`/studyplans/${date}`);
      setCurrentPlan(res.data);
      setTasks(res.data.tasks);
      generateTimetable(res.data.tasks, res.data.breakInterval, res.data.breakDuration, startTime);
    } catch (err) {
      // 404 means no plan for this date - that's fine
      if (err.response?.status !== 404) setError('Failed to load plan.');
    } finally {
      setLoading(false);
    }
  };

  // Generate visual timetable from tasks
  const generateTimetable = (taskList, bInterval, bDuration, start) => {
    if (!taskList || taskList.length === 0) { setTimetable([]); return; }

    const slots = [];
    let [hours, minutes] = start.split(':').map(Number);
    let minutesSinceBreak = 0;

    taskList.forEach((task, idx) => {
      // If need a break before this task
      if (minutesSinceBreak >= bInterval && idx > 0) {
        const breakStart = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
        minutes += bDuration;
        if (minutes >= 60) { hours += Math.floor(minutes / 60); minutes = minutes % 60; }
        const breakEnd = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
        slots.push({ type: 'break', label: '☕ Break', time: `${breakStart} – ${breakEnd}`, duration: bDuration });
        minutesSinceBreak = 0;
      }

      const taskStart = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
      minutes += task.duration;
      if (minutes >= 60) { hours += Math.floor(minutes / 60); minutes = minutes % 60; }
      const taskEnd = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
      slots.push({ type: 'task', label: task.subject, time: `${taskStart} – ${taskEnd}`, duration: task.duration, priority: task.priority, id: task._id, completed: task.completed });
      minutesSinceBreak += task.duration;
    });

    setTimetable(slots);
  };

  const handleAddTask = () => {
    if (!newTask.subject || !newTask.duration) return;
    const updated = [...tasks, { ...newTask, completed: false, _id: Date.now().toString() }];
    setTasks(updated);
    setNewTask({ subject: '', duration: 30, priority: 'medium' });
    generateTimetable(updated, breakInterval, breakDuration, startTime);
  };

  const removeTask = (idx) => {
    const updated = tasks.filter((_, i) => i !== idx);
    setTasks(updated);
    generateTimetable(updated, breakInterval, breakDuration, startTime);
  };

  const handleSave = async () => {
    if (tasks.length === 0) { setError('Add at least one task.'); return; }
    setError('');
    try {
      const res = await API.post('/studyplans', {
        planDate: selectedDate,
        tasks: tasks.map(t => ({ subject: t.subject, duration: Number(t.duration), priority: t.priority, completed: t.completed || false })),
        breakInterval: Number(breakInterval),
        breakDuration: Number(breakDuration)
      });
      setCurrentPlan(res.data);
      setTasks(res.data.tasks);
      generateTimetable(res.data.tasks, breakInterval, breakDuration, startTime);
      setShowAddForm(false);
      setSuccess('Study plan saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save plan.');
    }
  };

  const toggleTaskComplete = async (planId, taskId) => {
    try {
      const res = await API.put(`/studyplans/${planId}/task/${taskId}`);
      setCurrentPlan(res.data);
      setTasks(res.data.tasks);
      generateTimetable(res.data.tasks, res.data.breakInterval, res.data.breakDuration, startTime);
    } catch (err) { console.error(err); }
  };

  const priorityColor = { high: '#e53e3e', medium: '#d69e2e', low: '#38a169' };

  return (
    <div className="container">
      <h1 className="page-title">📅 Study Planner</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Date Selector */}
      <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: '1', minWidth: '200px' }}>
          <label>Select Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: '1', minWidth: '160px' }}>
          <label>Start Time</label>
          <input type="time" value={startTime} onChange={e => { setStartTime(e.target.value); generateTimetable(tasks, breakInterval, breakDuration, e.target.value); }} />
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)} style={{ alignSelf: 'flex-end' }}>
          {showAddForm ? '✕ Cancel' : '+ Build Plan'}
        </button>
      </div>

      {/* Plan Builder */}
      {showAddForm && (
        <div className="card" style={{ border: '2px solid #4f46e5', marginTop: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: '#4f46e5' }}>Plan for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>

          {/* Break Settings */}
          <div className="grid-2" style={{ marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Study before break (minutes)</label>
              <input type="number" value={breakInterval} min={15} max={120}
                onChange={e => { setBreakInterval(e.target.value); generateTimetable(tasks, e.target.value, breakDuration, startTime); }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Break duration (minutes)</label>
              <input type="number" value={breakDuration} min={5} max={30}
                onChange={e => { setBreakDuration(e.target.value); generateTimetable(tasks, breakInterval, e.target.value, startTime); }} />
            </div>
          </div>

          {/* Add Task Row */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: '160px' }}>
              <label>Subject / Topic</label>
              <input value={newTask.subject} onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
                placeholder="e.g. Physics Chapter 5" onKeyDown={e => e.key === 'Enter' && handleAddTask()} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '100px' }}>
              <label>Duration (min)</label>
              <input type="number" value={newTask.duration} min={5} max={180}
                onChange={e => setNewTask({ ...newTask, duration: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '120px' }}>
              <label>Priority</label>
              <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleAddTask}>+ Add</button>
          </div>

          {/* Task List */}
          {tasks.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              {tasks.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f7fafc', borderRadius: '8px', marginBottom: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: priorityColor[t.priority], flexShrink: 0 }}></span>
                  <span style={{ flex: 1, fontWeight: 600 }}>{t.subject}</span>
                  <span style={{ color: '#718096', fontSize: '13px' }}>{t.duration} min</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeTask(i)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-success" onClick={handleSave} disabled={tasks.length === 0}>
            💾 Save Plan
          </button>
        </div>
      )}

      {/* Timetable View */}
      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : timetable.length > 0 ? (
        <div style={{ marginTop: '24px' }}>
          <div className="section-title">📋 Today's Timetable</div>
          {timetable.map((slot, i) => (
            <div key={i} className={`timetable-row ${slot.type === 'break' ? 'break-row' : ''}`}
              style={{ opacity: slot.completed ? 0.5 : 1 }}>
              <span className="timetable-time">{slot.time}</span>
              <span className="timetable-subject" style={{ textDecoration: slot.completed ? 'line-through' : 'none', fontWeight: slot.type === 'task' ? 600 : 400 }}>
                {slot.type === 'break' ? '☕ Break' : slot.label}
                {slot.type === 'task' && <span style={{ color: '#718096', fontSize: '13px', marginLeft: '8px' }}>({slot.duration} min)</span>}
              </span>
              {slot.type === 'task' && currentPlan && (
                <button
                  className={`btn btn-sm ${slot.completed ? 'btn-secondary' : 'btn-success'}`}
                  onClick={() => toggleTaskComplete(currentPlan._id, slot.id)}
                >
                  {slot.completed ? '↩ Undo' : '✓ Done'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : !showAddForm && (
        <div className="card" style={{ textAlign: 'center', color: '#718096', marginTop: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📅</div>
          <p>No study plan for this date. Click "Build Plan" to create one!</p>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
