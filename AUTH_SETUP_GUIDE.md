# 🔐 Firebase Authentication Setup Guide

## Current Status

✅ **Firebase Configuration**: Updated with your project credentials  
⚠️ **Authentication Providers**: Need to be enabled in Firebase Console

## What Was Fixed

1. **Firebase Configuration**: Added your actual project credentials to `js/firebase-config.js`
2. **RecaptchaVerifier Bug**: Fixed constructor parameter order in `js/core/auth-helpers.js`
3. **Test Pages**: Created debugging tools to help verify setup

## Required Steps to Complete Setup

### Step 1: Enable Google Sign-In

1. Open Firebase Console:
   ```
   https://console.firebase.google.com/project/sutrakala-aa44b/authentication/providers
   ```

2. Click on **"Google"** in the Sign-in providers list

3. Toggle the **"Enable"** switch to ON

4. Set **"Project support email"** to: `sutraakala@gmail.com`

5. Click **"Save"**

### Step 2: Enable Phone Authentication

1. On the same providers page, click on **"Phone"**

2. Toggle the **"Enable"** switch to ON

3. (Optional) For testing, you can add test phone numbers:
   - Go to "Phone numbers for testing"
   - Add: `+911234567890` with code `123456`

4. Click **"Save"**

### Step 3: Verify Authorized Domains

1. Go to **Settings** tab in Authentication section:
   ```
   https://console.firebase.google.com/project/sutrakala-aa44b/authentication/settings
   ```

2. Under **"Authorized domains"**, verify that `localhost` is listed

3. If deploying to production, add your domain (e.g., `sutrakala.vercel.app`)

## Testing Your Setup

### Option 1: Use the Test Page (Recommended)

1. Open in your browser:
   ```
   http://localhost:3000/test-auth.html
   ```

2. Click **"Test Google Sign-In"** to verify Google authentication

3. Click **"Test Phone Auth"** to verify reCAPTCHA setup

### Option 2: Use the Main Site

1. Open in your browser:
   ```
   http://localhost:3000/index.html
   ```

2. Click the **"Login"** button in the navbar

3. Try both authentication methods

## Troubleshooting

### Error: "This domain is not authorized"

**Solution**: Add your domain to authorized domains in Firebase Console

1. Go to: Authentication > Settings > Authorized domains
2. Click "Add domain"
3. Add: `localhost` (for local testing) or your production domain

### Error: "This operation is not allowed"

**Solution**: Enable the authentication provider

- **For Google**: Enable Google sign-in in Authentication > Sign-in method
- **For Phone**: Enable Phone sign-in in Authentication > Sign-in method

### Error: "Invalid API key"

**Solution**: Verify your Firebase configuration

1. Check `js/firebase-config.js` has correct values
2. Regenerate API key in Firebase Console if needed
3. Make sure API key restrictions allow web requests

### reCAPTCHA Issues

**Solution**: Clear cache and verify domain authorization

1. Clear browser cache and cookies
2. Verify domain is authorized in Firebase Console
3. Check browser console for specific reCAPTCHA errors

### Phone OTP Not Sending

**Solution**: Check Firebase quotas and test numbers

1. Verify Phone authentication is enabled
2. Use test phone numbers for development (add in Firebase Console)
3. Check Firebase quota limits (100 verifications per day on free tier)

## Files Updated

- ✅ `js/firebase-config.js` - Added your Firebase credentials
- ✅ `js/core/auth-helpers.js` - Fixed RecaptchaVerifier constructor
- ✅ `test-auth.html` - New debugging tool
- ✅ `setup-auth.sh` - Setup helper script

## Quick Command Reference

```bash
# Start local server (if not running)
cd "/Users/biswyaa/Documents/Crochet Site"
python3 -m http.server 3000

# Open test page
open http://localhost:3000/test-auth.html

# Open main site
open http://localhost:3000/index.html

# Check Firebase project
firebase projects:list

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## Next Steps

1. ✅ Complete Steps 1-3 above to enable authentication providers
2. ✅ Test authentication using `test-auth.html`
3. ✅ Once working, test on main site `index.html`
4. ✅ Deploy to production when ready

## Support

If you continue to have issues after following this guide:

1. Check the browser console for error messages
2. Use `test-auth.html` to identify specific problems
3. Verify all steps above are completed
4. Check Firebase Console for any configuration issues

## Security Notes

- ✅ Firebase credentials are in `js/firebase-config.js` (client-safe)
- ✅ API key restrictions can be added in Firebase Console
- ✅ Firestore security rules are in `firestore.rules`
- ⚠️ Deploy rules before going live: `firebase deploy --only firestore:rules`
- ⚠️ Never commit sensitive test phone numbers or credentials to Git

---

**Your Firebase Project**: `sutrakala-aa44b`  
**Firebase Console**: https://console.firebase.google.com/project/sutrakala-aa44b
