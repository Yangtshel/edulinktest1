import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Logging in...');

    try {
      // 1. Fetch Config from your Backend API route
      const response = await fetch('/api/login', { method: 'POST' });
      const config = await response.json();

      // 2. Initialize Firebase
      const app = initializeApp(config);
      const auth = getAuth(app);

      // 3. Authenticate
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      localStorage.setItem('userName', userCredential.user.email?.split('@')[0] || 'User');
      window.location.href = "/hi"; // Redirect to your /hi page
    } catch (err) {
      setStatus('Error: Invalid login credentials.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Edulinki Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
        <button type="submit" style={styles.button}>Sign In</button>
        <p>{status}</p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' as const },
  input: { display: 'block', width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' },
  button: { width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};
