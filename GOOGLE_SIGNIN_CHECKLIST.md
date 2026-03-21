# Google Sign-In Quick Fix Checklist

## ✅ Step-by-Step Fix Guide

Print this out or keep it handy while fixing Google Sign-In.

---

### 🎯 STEP 1: Test Current Status

- [ ] Open http://localhost:8080/test-google-signin-quick.html
- [ ] Click "Sign in with Google"
- [ ] Note the error message (if any)

**Error received:** _________________________

---

### 🔥 STEP 2: Most Common Fix (Try this first!)

#### Enable Google Sign-In in Firebase Console

- [ ] Go to: https://console.firebase.google.com/project/sutrakala-aa44b/authentication/providers
- [ ] Find "Google" in the sign-in providers list
- [ ] Click on "Google"
- [ ] Toggle "Enable" switch to ON (should turn blue/green)
- [ ] Enter project support email: _________________________
- [ ] Click "Save"
- [ ] Wait 1-2 minutes for changes to propagate
- [ ] Test again (go back to Step 1)

**Did this fix it?** ☐ Yes ☐ No

---

### 🌐 STEP 3: Check Authorized Domains

Only if Step 2 didn't work:

- [ ] Go to: https://console.firebase.google.com/project/sutrakala-aa44b/authentication/settings
- [ ] Scroll to "Authorized domains"
- [ ] Verify these domains are listed:
  - [ ] localhost
  - [ ] 127.0.0.1
  - [ ] sutrakala-aa44b.firebaseapp.com
  - [ ] Your production domain (if applicable): _________________________
- [ ] If any are missing, click "Add domain" and add them
- [ ] Test again

**Did this fix it?** ☐ Yes ☐ No

---

### 🔑 STEP 4: Verify OAuth Configuration

Only if Steps 2 & 3 didn't work:

- [ ] Go to: https://console.cloud.google.com/apis/credentials?project=sutrakala-aa44b
- [ ] Find "Web client (auto created by Google Service)"
- [ ] Click to edit
- [ ] Under "Authorized JavaScript origins", verify these are present:
  - [ ] http://localhost:8080
  - [ ] http://127.0.0.1:8080
  - [ ] https://sutrakala-aa44b.firebaseapp.com
- [ ] Under "Authorized redirect URIs", verify these are present:
  - [ ] http://localhost:8080/__/auth/handler
  - [ ] https://sutrakala-aa44b.firebaseapp.com/__/auth/handler
- [ ] Click "Save"
- [ ] **IMPORTANT:** Wait 5-10 minutes for OAuth changes to propagate
- [ ] Test again

**Did this fix it?** ☐ Yes ☐ No

---

### 🔧 STEP 5: Verify Firebase Configuration

Only if Steps 2, 3 & 4 didn't work:

- [ ] Open file: js/firebase-config.js
- [ ] Verify these values are correct:

```javascript
window.ENV = {
  FIREBASE_API_KEY: 'AIzaSy...',  // Starts with "AIzaSy"
  FIREBASE_AUTH_DOMAIN: 'sutrakala-aa44b.firebaseapp.com',  // Ends with .firebaseapp.com
  FIREBASE_PROJECT_ID: 'sutrakala-aa44b',
  // ... other fields
};
```

- [ ] If any values look wrong, get correct ones from:
      Firebase Console → Project Settings → General → Your apps
- [ ] Update the file and save
- [ ] Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Test again

**Did this fix it?** ☐ Yes ☐ No

---

### 🧹 STEP 6: Clear Browser Cache

Sometimes old cached files cause issues:

- [ ] Open browser settings
- [ ] Clear cached images and files (last 24 hours)
  - **Chrome:** Ctrl+Shift+Delete
  - **Firefox:** Ctrl+Shift+Delete
  - **Safari:** Cmd+Option+E
- [ ] Close all browser tabs
- [ ] Open a new incognito/private window
- [ ] Navigate to http://localhost:8080/test-google-signin-quick.html
- [ ] Test again

**Did this fix it?** ☐ Yes ☐ No

---

### 🔍 STEP 7: Run Full Diagnostics

If nothing above worked, run the diagnostic tool:

- [ ] Open http://localhost:8080/diagnose-google-signin.html
- [ ] Review all diagnostic results
- [ ] Look for any items marked with ❌ or ⚠️
- [ ] Follow the specific instructions for each issue
- [ ] Take a screenshot of the results for reference

---

### 🆘 STEP 8: Get Help

If you're still stuck, gather this information:

- [ ] Error message from test page: _________________________
- [ ] Error code (if shown): _________________________
- [ ] Browser & version: _________________________
- [ ] Operating system: _________________________
- [ ] Screenshot of error
- [ ] Screenshot of diagnostic results
- [ ] Which steps above you completed: _________________________

---

## 🎉 Success Indicators

You'll know it's working when you see:

- ✅ Popup window opens showing Google account selection
- ✅ After selecting account, popup closes automatically
- ✅ Success message: "Google Sign-In is working perfectly!"
- ✅ Your name/email is displayed
- ✅ Console log shows: "Google sign-in successful"

---

## 📞 Quick Reference Links

- **Firebase Auth Providers:** https://console.firebase.google.com/project/sutrakala-aa44b/authentication/providers
- **Firebase Auth Settings:** https://console.firebase.google.com/project/sutrakala-aa44b/authentication/settings
- **Google Cloud OAuth:** https://console.cloud.google.com/apis/credentials?project=sutrakala-aa44b
- **Test Page:** http://localhost:8080/test-google-signin-quick.html
- **Diagnostic Tool:** http://localhost:8080/diagnose-google-signin.html
- **Full Guide:** GOOGLE_SIGNIN_FIX.md

---

## 💡 Common Error Codes

| Error Code | Meaning | Quick Fix |
|------------|---------|-----------|
| `auth/popup-blocked` | Browser blocked popup | Allow popups for this site |
| `auth/popup-closed-by-user` | User closed popup early | Try again, complete the flow |
| `auth/unauthorized-domain` | Domain not authorized | Add domain to Firebase (Step 3) |
| `auth/operation-not-allowed` | Google not enabled | Enable Google in Firebase (Step 2) |
| `auth/invalid-api-key` | Wrong API key | Check firebase-config.js (Step 5) |

---

**Date fixed:** _________________________

**Notes:** 
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
