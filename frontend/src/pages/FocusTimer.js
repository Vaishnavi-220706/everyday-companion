// src/pages/FocusTimer.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

const FocusTimer = () => {
  const [duration, setDuration] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Play beep sound using Web Audio API (no external file needed)
  const playAlertSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const playBeep = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      // Play 3 ascending beeps
      playBeep(523, 0, 0.3);
      playBeep(659, 0.35, 0.3);
      playBeep(784, 0.7, 0.6);
    } catch (e) {
      console.log('Audio not available');
    }
  }, []);

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsFinished(true);
        setSessions(s => s + 1);
        playAlertSound();
        return 0;
      }
      return prev - 1;
    });
  }, [playAlertSound]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const start = () => { setIsFinished(false); setIsRunning(true); };
  const pause = () => setIsRunning(false);
  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration * 60);
  };

  const setPreset = (mins) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  const applyCustom = () => {
    const m = parseInt(customMinutes);
    if (m > 0 && m <= 120) { setPreset(m); setCustomMinutes(''); }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">⏱️ Focus Timer</h1>

      {/* Circular Timer */}
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Background circle */}
            <circle cx="110" cy="110" r="90" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            {/* Progress circle */}
            <circle
              cx="110" cy="110" r="90"
              fill="none"
              stroke={isFinished ? '#38a169' : '#4f46e5'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              transform="rotate(-90 110 110)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div className="timer-display" style={{ fontSize: '42px', margin: 0 }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ color: '#718096', fontSize: '13px' }}>{duration} min session</div>
          </div>
        </div>

        {isFinished && (
          <div className="alert alert-success" style={{ marginBottom: '16px' }}>
            🎉 Session complete! Take a break.
          </div>
        )}

        {/* Controls */}
        <div className="timer-controls" style={{ marginBottom: '20px' }}>
          {!isRunning ? (
            <button className="btn btn-primary btn-lg" onClick={start} disabled={timeLeft === 0}>
              ▶ {timeLeft === duration * 60 ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button className="btn btn-warning btn-lg" onClick={pause}>⏸ Pause</button>
          )}
          <button className="btn btn-secondary btn-lg" onClick={reset}>↺ Reset</button>
        </div>

        {/* Session counter */}
        <div style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>
          🍅 Completed sessions today: <strong>{sessions}</strong>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#4a5568', fontWeight: 600, marginBottom: '10px', fontSize: '14px' }}>Quick Presets</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[15, 25, 30, 45, 60].map(m => (
              <button key={m}
                className={`btn btn-sm ${duration === m ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPreset(m)}
                disabled={isRunning}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        {/* Custom time */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
          <input
            type="number"
            value={customMinutes}
            onChange={e => setCustomMinutes(e.target.value)}
            placeholder="Custom min (1–120)"
            min={1} max={120}
            style={{ width: '170px', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
            disabled={isRunning}
            onKeyDown={e => e.key === 'Enter' && applyCustom()}
          />
          <button className="btn btn-sm btn-outline" onClick={applyCustom} disabled={isRunning || !customMinutes}>Set</button>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '10px', color: '#4a5568' }}>🎯 Pomodoro Tips</div>
        <ul style={{ paddingLeft: '20px', color: '#718096', lineHeight: '1.8', fontSize: '14px' }}>
          <li>Work for 25 minutes, then take a 5 minute break</li>
          <li>After 4 sessions, take a longer 15–30 minute break</li>
          <li>Put your phone on silent during focus sessions</li>
          <li>One task at a time — avoid multitasking</li>
        </ul>
      </div>
    </div>
  );
};

export default FocusTimer;
