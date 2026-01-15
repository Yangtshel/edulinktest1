'use client'; // This must be at the top!

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, X } from 'lucide-react'; // Using lucide-react icons

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/home');
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, {
          displayName: name,
          photoURL: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}`,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/home');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <button 
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-4 text-sm text-gray-600 hover:underline"
        >
          {isSignup ? 'Already have an account? Log in' : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}
