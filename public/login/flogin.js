import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Lucide icons
lucide.createIcons();

let auth = null; // Start as null

// 1. FETCH CONFIG FROM BACKEND API
async function initFirebase() {
  try {
    const response = await fetch('/api/login');
    if (!response.ok) throw new Error("Could not fetch config from API");
    
    const firebaseConfig = await response.json();
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // After auth is ready, listen for state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/home";
      }
    });
    console.log("Firebase initialized successfully");
  } catch (err) {
    console.error("Failed to load Firebase config:", err);
    alert("Connection Error: Server config is missing.");
  }
}

initFirebase();

// UI ELEMENTS
const overlay = document.getElementById("loginOverlay");
const btnSubmit = document.getElementById("btnSubmit");
const inputEmail = document.getElementById("inputEmail");
const inputPass = document.getElementById("inputPass");
const inputName = document.getElementById("inputName");
const authTitle = document.getElementById("authTitle");
const toggleAuthBtn = document.getElementById("toggleAuth");
const groupName = document.getElementById("groupName");

let isSignup = false;

// UI TOGGLE LOGIC
if (toggleAuthBtn) {
  toggleAuthBtn.onclick = () => {
    isSignup = !isSignup;
    updateUI();
  };
}

function updateUI() {
  if (isSignup) {
    authTitle.innerText = "Create Account";
    btnSubmit.innerText = "Sign Up";
    groupName.classList.remove("hidden");
  } else {
    authTitle.innerText = "Welcome back";
    btnSubmit.innerText = "Log in";
    groupName.classList.add("hidden");
  }
}

// HANDLE SUBMIT
if (btnSubmit) {
  btnSubmit.onclick = async () => {
    // CRITICAL: Check if auth is loaded from the API first
    if (!auth) {
      alert("System is still connecting... please try again in 2 seconds.");
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
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, {
          displayName: name,
          photoURL: `https://api.dicebear.com/9.x/lorelei/svg?seed=${name}`,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      window.location.href = "/home";
    } catch (err) {
      alert("Auth Error: " + err.message);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText = isSignup ? "Sign Up" : "Log in";
    }
  };
}
