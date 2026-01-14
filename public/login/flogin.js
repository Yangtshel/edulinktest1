lucide.createIcons();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let auth;

// Fetch keys from your hidden backend API
async function startApp() {
  try {
    const response = await fetch('/api/login');
    const config = await response.json();
    
    const app = initializeApp(config);
    auth = getAuth(app);

    // Watch for login state
    onAuthStateChanged(auth, (user) => {
      if (user) window.location.href = "/home";
    });
  } catch (error) {
    console.error("Configuration failed to load.");
  }
}

startApp();

// UI Elements & Logic (rest of your existing code...)
const btnSubmit = document.getElementById("btnSubmit");
const inputEmail = document.getElementById("inputEmail");
const inputPass = document.getElementById("inputPass");
const inputName = document.getElementById("inputName");

if (btnSubmit) {
  btnSubmit.onclick = async () => {
    if (!auth) return; // Wait for the backend to provide the keys

    const email = inputEmail.value.trim();
    const pass = inputPass.value.trim();
    
    btnSubmit.innerText = "Processing...";
    btnSubmit.disabled = true;

    try {
      if (document.getElementById("authTitle").innerText === "Create Account") {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName: inputName.value.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      window.location.href = "/home";
    } catch (err) {
      alert(err.message);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText = "Submit";
    }
  };
}
