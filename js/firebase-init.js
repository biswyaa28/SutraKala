// js/firebase-init.js
// Firebase initialization for SutraKala
// Includes Auth, Firestore, and Performance Monitoring

/**
 * Load environment variables from window (injected via build process)
 * For static sites, we'll use a config object that can be set before this script loads
 */
const getEnvVar = (key, defaultValue = '') => {
  // Check window.ENV object (can be set in HTML or build process)
  if (window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  // Fallback to default
  return defaultValue;
};

// Firebase configuration - uses environment variables or defaults
const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY', 'AIzaSyBvqX7VqXvZ8Z6YqYvZ8Z6YqYvZ8Z6YqYvZ'),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN', 'sutrakala-aa44b.firebaseapp.com'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID', 'sutrakala-aa44b'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET', 'sutrakala-aa44b.appspot.com'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID', '123456789012'),
  appId: getEnvVar('FIREBASE_APP_ID', '1:123456789012:web:abcdef1234567890abcdef'),
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID', 'G-XXXXXXXXXX')
};

// Detect if we're in production
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' &&
                     !window.location.hostname.includes('preview');

let app = null;
let auth = null;
let db = null;
let perf = null;

/**
 * Initialize Firebase App, Auth, Firestore, and Performance Monitoring
 * @returns {Promise<Object>} Firebase services (app, auth, db, perf)
 */
async function initFirebase() {
  // Prevent double initialization
  if (app && auth && db) {
    console.log('[Firebase] Already initialized');
    return { app, auth, db, perf };
  }

  try {
    // Import Firebase modules from CDN
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    console.log('[Firebase] App initialized');
    
    // Initialize Auth
    auth = getAuth(app);
    console.log('[Firebase] Auth initialized');
    
    // Initialize Firestore
    db = getFirestore(app);
    console.log('[Firebase] Firestore initialized');
    
    // Initialize Performance Monitoring (production only)
    if (isProduction) {
      try {
        const { getPerformance } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-performance.js');
        perf = getPerformance(app);
        console.log('[Firebase] Performance monitoring initialized');
      } catch (perfError) {
        console.warn('[Firebase] Performance monitoring failed to initialize:', perfError);
      }
    } else {
      console.log('[Firebase] Performance monitoring disabled in development');
    }
    
    return { app, auth, db, perf };
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error);
    throw error;
  }
}

/**
 * Create a custom trace for performance monitoring
 * @param {string} traceName - Name of the trace
 * @returns {Object|null} Trace object with start() and stop() methods
 */
function createTrace(traceName) {
  if (!perf || !isProduction) {
    return {
      start: () => {},
      stop: () => {},
      putAttribute: () => {},
      putMetric: () => {},
      incrementMetric: () => {}
    };
  }

  try {
    return perf.trace(traceName);
  } catch (error) {
    console.error('[Firebase] Failed to create trace:', error);
    return null;
  }
}

/**
 * Track page load performance
 */
function trackPageLoad() {
  if (!isProduction) return;

  const pageName = document.title.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  const trace = createTrace(`page_load_${pageName}`);
  
  if (trace) {
    trace.start();
    
    // Stop trace when page is fully loaded
    window.addEventListener('load', () => {
      trace.putMetric('dom_content_loaded', performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart);
      trace.putMetric('page_load_time', performance.timing.loadEventEnd - performance.timing.navigationStart);
      trace.stop();
    });
  }
}

/**
 * Track user interaction
 * @param {string} actionName - Name of the action (e.g., 'add_to_cart', 'checkout')
 * @param {Object} metadata - Optional metadata to attach to the trace
 */
function trackUserAction(actionName, metadata = {}) {
  if (!isProduction) return;

  const trace = createTrace(`user_action_${actionName}`);
  
  if (trace) {
    trace.start();
    
    // Add metadata as attributes
    Object.entries(metadata).forEach(([key, value]) => {
      trace.putAttribute(key, String(value));
    });
    
    // Stop trace after a short delay (for quick actions)
    setTimeout(() => {
      trace.stop();
    }, 100);
  }
}

/**
 * Track async operations (like API calls or data loading)
 * @param {string} operationName - Name of the operation
 * @param {Function} operation - Async function to track
 * @returns {Promise} Result of the operation
 */
async function trackAsyncOperation(operationName, operation) {
  if (!isProduction) {
    return operation();
  }

  const trace = createTrace(`async_${operationName}`);
  
  if (!trace) {
    return operation();
  }

  trace.start();
  
  try {
    const result = await operation();
    trace.putAttribute('status', 'success');
    return result;
  } catch (error) {
    trace.putAttribute('status', 'error');
    trace.putAttribute('error_message', error.message);
    throw error;
  } finally {
    trace.stop();
  }
}

/**
 * Get Firebase Auth instance
 * @returns {Object|null} Firebase Auth instance
 */
function getAuthInstance() {
  return auth;
}

/**
 * Get Firestore instance
 * @returns {Object|null} Firestore instance
 */
function getFirestoreInstance() {
  return db;
}

/**
 * Get Firebase App instance
 * @returns {Object|null} Firebase App instance
 */
function getAppInstance() {
  return app;
}

// Export for use in other modules
export { 
  initFirebase,
  getAuthInstance,
  getFirestoreInstance,
  getAppInstance,
  createTrace, 
  trackPageLoad, 
  trackUserAction, 
  trackAsyncOperation,
  isProduction 
};

// Auto-initialize on script load (but don't block - let it run in background)
initFirebase().then(() => {
  console.log('[Firebase] ✅ All services initialized successfully');
  // Track initial page load (if performance monitoring is enabled)
  if (perf) {
    trackPageLoad();
  }
}).catch(error => {
  console.error('[Firebase] ❌ Initialization failed:', error);
});
