import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Global auth variable
let auth = null;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Select DOM Elements
  const ui = {
    overlay: document.getElementById("loginOverlay"),
    closeBtn: document.getElementById("closeOverlayBtn"),
    getStartedBtn: document.getElementById("getStartedBtn"),
    heroGetStartedBtn: document.getElementById("heroGetStartedBtn"),
    toggleAuthBtn: document.getElementById("toggleAuth"),
    authTitle: document.getElementById("authTitle"),
    btnSubmit: document.getElementById("btnSubmit"),
    groupName: document.getElementById("groupName"),
    inputName: document.getElementById("inputName"),
    inputEmail: document.getElementById("inputEmail"),
    inputPass: document.getElementById("inputPass"),
  };

  // State
  let isSignup = false;

  // 3. Initialize Firebase
  async function initFirebase() {
    // Disable button while loading config
    if (ui.btnSubmit) {
      ui.btnSubmit.disabled = true;
      ui.btnSubmit.innerText = "Loading...";
    }

    try {
      const response = await fetch('/api/login');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const firebaseConfig = await response.json();
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);

      // Re-enable button now that Auth is ready
      if (ui.btnSubmit) {
        ui.btnSubmit.disabled = false;
        updateUI(); // Reset button text
      }

      // Listen for auth state
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Optional: Verify we aren't already on the home page to prevent loops
          if (window.location.pathname !== "/home") {
            window.location.href = "/home";
          }
        }
      });
    } catch (err) {
      console.error("Failed to load Firebase config:", err);
      if (ui.btnSubmit) {
        ui.btnSubmit.innerText = "Error Loading System";
      }
      alert("Could not connect to authentication server. Please refresh.");
    }
  }

  // Start Initialization
  initFirebase();

  // 4. UI Functions
  function openOverlay() {
    if (ui.overlay) {
      ui.overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      isSignup = false;
      updateUI();
    }
  }

  function closeOverlay() {
    if (ui.overlay) {
      ui.overlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  function updateUI() {
    if (!ui.authTitle || !ui.btnSubmit || !ui.toggleAuthBtn) return;
    
    // Ensure we don't overwrite "Loading..." state if auth isn't ready
    if (!auth) return; 

    if (isSignup) {
      ui.authTitle.innerText = "Create Account";
      ui.btnSubmit.innerText = "Sign Up";
      ui.toggleAuthBtn.innerHTML = 'Already have an account? <span>Log in</span>';
      ui.groupName.classList.remove("hidden");
    } else {
      ui.authTitle.innerText = "Welcome back";
      ui.btnSubmit.innerText = "Log in";
      ui.toggleAuthBtn.innerHTML = "Don't have an account? <span>Create one</span>";
      ui.groupName.classList.add("hidden");
    }
  }

  // 5. Event Listeners
  if (ui.getStartedBtn) ui.getStartedBtn.onclick = openOverlay;
  if (ui.heroGetStartedBtn) ui.heroGetStartedBtn.onclick = openOverlay;
  if (ui.closeBtn) ui.closeBtn.onclick = closeOverlay;

  if (ui.toggleAuthBtn) {
    ui.toggleAuthBtn.onclick = () => {
      isSignup = !isSignup;
      updateUI();
    };
  }

  // 6. Handle Submit
  if (ui.btnSubmit) {
    ui.btnSubmit.onclick = async () => {
      if (!auth) return; // Should be handled by disabled state, but double check

      const email = ui.inputEmail.value.trim();
      const pass = ui.inputPass.value.trim();
      const name = ui.inputName.value.trim();

      if (!email || !pass) {
        alert("Please fill in email and password");
        return;
      }

      if (isSignup && !name) {
         alert("Please enter a name for your account");
         return;
      }

      // Lock UI
      ui.btnSubmit.innerText = "Processing...";
      ui.btnSubmit.disabled = true;

      try {
        if (isSignup) {
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          // Set Profile Picture
          await updateProfile(cred.user, {
            displayName: name,
            photoURL: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=transparent`,
          });
        } else {
          await signInWithEmailAndPassword(auth, email, pass);
        }
        
        // Success - Redirect
        window.location.href = "/home";
      } catch (err) {
        console.error(err);
        
        // Better error messages for users
        let msg = err.message;
        if(msg.includes("auth/invalid-credential")) msg = "Incorrect email or password.";
        if(msg.includes("auth/email-already-in-use")) msg = "This email is already registered.";
        if(msg.includes("auth/weak-password")) msg = "Password should be at least 6 characters.";
        
        alert(msg);
        
        // Reset UI
        ui.btnSubmit.disabled = false;
        ui.btnSubmit.innerText = isSignup ? "Sign Up" : "Log in";
      }
    };
  }
});
