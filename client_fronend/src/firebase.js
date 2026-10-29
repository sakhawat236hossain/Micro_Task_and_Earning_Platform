import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Standard Firebase config using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id"
};

let app;
let auth;
let googleProvider;
let isMock = false;

try {
  // Only initialize real firebase if we have a valid key format and aren't using dummy values
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "dummy-key" && !firebaseConfig.apiKey.includes("your-")) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    isMock = true;
  }
} catch (error) {
  console.warn("Firebase initialization failed, falling back to mock authentication:", error);
  isMock = true;
}

// Function to handle Google Login with Firebase or Mock fallback
export const loginWithGoogle = async () => {
  if (!isMock && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };
    } catch (error) {
      console.error("Firebase Google Sign-In error:", error);
      throw error;
    }
  } else {
    // Return a promise that resolves with simulated Google user data
    return new Promise((resolve) => {
      // Simulate a small popup window delay
      const email = prompt("Enter mock Google email:", "google-user@gmail.com") || "google-user@gmail.com";
      const name = email.split('@')[0];
      setTimeout(() => {
        resolve({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email,
          photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        });
      }, 800);
    });
  }
};
