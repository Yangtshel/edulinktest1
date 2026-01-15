// api/login.js
export default function handler(req, res) {
  // These values are pulled from your .env file (locally) 
  // or from Vercel Environment Variables (production)
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

  // Check if keys exist to prevent sending an empty config
  if (!firebaseConfig.apiKey) {
    return res.status(500).json({ error: "Environment variables not set on server" });
  }

  res.status(200).json(firebaseConfig);
}
