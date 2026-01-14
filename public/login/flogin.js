lucide.createIcons();

// IMPORT FIREBASE
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAJH79UQl0rc96Qug0DKLevO4ZI_sn8Kno",
  authDomain: "edulinki.firebaseapp.com",
  projectId: "edulinki",
  storageBucket: "edulinki.firebasestorage.app",
  messagingSenderId: "248886466474",
  appId: "1:248886466474:web:160043201a6b28bafbbdd3",
  measurementId: "G-MQBH12VL7N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI ELEMENTS
const overlay = document.getElementById("loginOverlay");
const closeBtn = document.getElementById("closeOverlayBtn");
const getStartedBtn = document.getElementById("getStartedBtn");
const heroGetStartedBtn = document.getElementById("heroGetStartedBtn");
const toggleAuthBtn = document.getElementById("toggleAuth");

// FORM ELEMENTS
const authTitle = document.getElementById("authTitle");
const btnSubmit = document.getElementById("btnSubmit");
const groupName = document.getElementById("groupName");
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const inputPass = document.getElementById("inputPass");
const authAvatar = document.getElementById("authAvatar");

let isSignup = false;

function openOverlay() {
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  isSignup = false;
  updateUI();
}

function closeOverlay() {
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

getStartedBtn.onclick = openOverlay;
heroGetStartedBtn.onclick = openOverlay;
closeBtn.onclick = closeOverlay;

// TOGGLE LOGIN / SIGNUP
toggleAuthBtn.onclick = () => {
  isSignup = !isSignup;
  updateUI();
};

function updateUI() {
  if (isSignup) {
    authTitle.innerText = "Create Account";
    btnSubmit.innerText = "Sign Up";
    toggleAuthBtn.innerHTML =
      'Already have an account? <span>Log in</span>';
    groupName.classList.remove("hidden");
    authAvatar.src =
      "https://api.dicebear.com/9.x/lorelei/svg?seed=NewUser&backgroundColor=transparent";
  } else {
    authTitle.innerText = "Welcome back";
    btnSubmit.innerText = "Log in";
    toggleAuthBtn.innerHTML =
      "Don't have an account? <span>Create one</span>";
    groupName.classList.add("hidden");
    authAvatar.src =
      "https://api.dicebear.com/9.x/lorelei/svg?seed=User&backgroundColor=transparent";
  }
}

// DYNAMIC AVATAR
inputName.addEventListener("input", (e) => {
  if (isSignup && e.target.value.length > 1) {
    authAvatar.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${
      e.target.value
    }&backgroundColor=transparent`;
  }
});

// HANDLE SUBMIT
btnSubmit.onclick = async () => {
  const email = inputEmail.value.trim();
  const pass = inputPass.value.trim();
  const name = inputName.value.trim();

  if (!email || !pass) {
    alert("Please fill in email and password");
    return;
  }

  btnSubmit.innerText = "Processing...";
  btnSubmit.style.opacity = "0.7";
  btnSubmit.disabled = true;

  try {
    if (isSignup) {
      if (!name) {
        alert("Please enter your name");
        btnSubmit.innerText = "Sign Up";
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = "1";
        return;
      }
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: `https://api.dicebear.com/9.x/lorelei/svg?seed=${name}&backgroundColor=transparent`,
      });
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
    }

    window.location.href = "home.html";
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  } finally {
    btnSubmit.style.opacity = "1";
    btnSubmit.disabled = false;
    btnSubmit.innerText = isSignup ? "Sign Up" : "Log in";
  }
};

// AUTH LISTENER
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/home/index.html";
  }
});
