import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', { method: 'POST' });
    const config = await res.json();
    
    const app = initializeApp(config);
    const auth = getAuth(app);
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    
    localStorage.setItem('userName', userCred.user.email?.split('@')[0] || 'User');
    window.location.href = "/hi";
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Edulinki Login</h1>
      <form onSubmit={login}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  input: { display: 'block', margin: '10px auto', padding: '10px', width: '250px' },
  button: { padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }
};
