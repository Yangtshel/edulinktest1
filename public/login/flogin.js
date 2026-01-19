import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Lucide icons if applicable
if (window.lucide) {
  lucide.createIcons();
}

let auth;

// 1. FETCH CONFIG FROM BACKEND API & INITIALIZE
async function initFirebase() {
  try {
    const response = await fetch('/api/login');
    const firebaseConfig = await response.json();

    if (firebaseConfig.error) {
      throw new Error(firebaseConfig.error);
    }

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Monitor Authentication State
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/home";
      }
    });
  } catch (err) {
    console.error("Failed to load Firebase config:", err);
  }
}

initFirebase();

// --- UI ELEMENTS ---
const overlay = document.getElementById("loginOverlay");
const closeBtn = document.getElementById("closeOverlayBtn");
const getStartedBtn = document.getElementById("getStartedBtn");
const heroGetStartedBtn = document.getElementById("heroGetStartedBtn");
const toggleAuthBtn = document.getElementById("toggleAuth");
const btnGoogle = document.getElementById("btnGoogle");

// --- FORM ELEMENTS ---
const authTitle = document.getElementById("authTitle");
const btnSubmit = document.getElementById("btnSubmit");
const groupName = document.getElementById("groupName");
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const inputPass = document.getElementById("inputPass");

let isSignup = false;

// --- UI FUNCTIONS ---
function openOverlay() {
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    isSignup = false;
    updateUI();
  }
}

function closeOverlay() {
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

function updateUI() {
  if (!authTitle || !btnSubmit || !toggleAuthBtn) return;
  
  if (isSignup) {
    authTitle.innerText = "Create Account";
    btnSubmit.innerText = "Sign Up";
    toggleAuthBtn.innerHTML = 'Already have an account? <span>Log in</span>';
    if (groupName) groupName.classList.remove("hidden");
  } else {
    authTitle.innerText = "Welcome back";
    btnSubmit.innerText = "Log in";
    toggleAuthBtn.innerHTML = "Don't have an account? <span>Create one</span>";
    if (groupName) groupName.classList.add("hidden");
  }
}

// --- EVENT LISTENERS ---
if (getStartedBtn) getStartedBtn.onclick = openOverlay;
if (heroGetStartedBtn) heroGetStartedBtn.onclick = openOverlay;
if (closeBtn) closeBtn.onclick = closeOverlay;

if (toggleAuthBtn) {
  toggleAuthBtn.onclick = () => {
    isSignup = !isSignup;
    updateUI();
  };
}

// --- GOOGLE SIGN IN ---
if (btnGoogle) {
  btnGoogle.onclick = async () => {
    if (!auth) {
      alert("System is still initializing. Please wait a moment.");
      return;
    }
    
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the redirect
    } catch (error) {
      console.error(error);
      alert("Google Sign-In Error: " + error.message);
    }
  };
}

// --- HANDLE SUBMIT ---
if (btnSubmit) {
  btnSubmit.onclick = async () => {
    // Safety check: ensure Firebase has loaded via the API first
    if (!auth) {
      alert("System is still initializing. Please wait a moment.");
      return;
    }

    const email = inputEmail.value.trim();
    const pass = inputPass.value.trim();
    const name = inputName.value.trim();

    if (!email || !pass) {
      alert("Please fill in email and password");
      return;
    }

    btnSubmit.innerText = "Processing...";
    btnSubmit.disabled = true;

    try {
      if (isSignup) {
        // Sign Up Logic
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, {
          displayName: name,
          photoURL: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=transparent`,
        });
      } else {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, pass);
      }
      
      // Redirect on success (redundant but safe due to onAuthStateChanged)
      window.location.href = "/home";
      
    } catch (err) {
      console.error(err);
      alert("Authentication Error: " + err.message);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText = isSignup ? "Sign Up" : "Log in";
    }
  };
}
