import React, { useEffect, useState } from 'react';

export default function HiPage() {
  const [name, setName] = useState('Guest');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (!savedName) {
      window.location.href = "/"; // Send back to login if not logged in
    } else {
      setName(savedName);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#eef2f3' }}>
      <div style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Hi, <span style={{ color: '#0070f3' }}>{name}</span>! 👋</h1>
        <p style={{ color: '#666' }}>Welcome to your dashboard.</p>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#ff4d4f', color: 'white', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
