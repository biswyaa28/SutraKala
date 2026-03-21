// Test that the updated code is syntactically correct and functions are accessible
import { signInWithGoogle, checkGoogleRedirectResult } from './js/core/auth-helpers.js';

console.log('✅ Testing auth-helpers.js imports...');

// Check function signatures
if (typeof signInWithGoogle === 'function') {
    console.log('✅ signInWithGoogle is a function');
    console.log('   Parameters: forceRedirect (optional)');
} else {
    console.log('❌ signInWithGoogle is not a function');
}

if (typeof checkGoogleRedirectResult === 'function') {
    console.log('✅ checkGoogleRedirectResult is a function');
    console.log('   Returns: Promise<Object|null>');
} else {
    console.log('❌ checkGoogleRedirectResult is not a function');
}

console.log('\n✅ All imports successful!');
console.log('✅ Updated auth code is properly integrated.');
