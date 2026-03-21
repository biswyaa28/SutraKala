/**
 * Firebase Configuration
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Firebase project credentials.
 * You can find these in the Firebase Console:
 * Project Settings -> General -> Your apps -> SDK setup and configuration
 */

window.ENV = {
  FIREBASE_API_KEY: 'AIzaSyDGPIjxgSjbXMTppTzjWSbjxlRIwoYt7qQ',
  FIREBASE_AUTH_DOMAIN: 'sutrakala-aa44b.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'sutrakala-aa44b',
  FIREBASE_STORAGE_BUCKET: 'sutrakala-aa44b.firebasestorage.app',
  FIREBASE_MESSAGING_SENDER_ID: '144862752157',
  FIREBASE_APP_ID: '1:144862752157:web:37d086f16bb6429f1f9374',
  FIREBASE_MEASUREMENT_ID: 'G-02MMG0WZVV'
};

// Log warning if values are not set
if (window.ENV.FIREBASE_API_KEY === 'YOUR_API_KEY_HERE') {
  console.warn('%c[Firebase Config] ⚠️ You are using placeholder credentials!', 'color: red; font-weight: bold; font-size: 14px;');
  console.warn('Please update js/firebase-config.js with your actual Firebase credentials.');
}
