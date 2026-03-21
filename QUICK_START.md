# 🚀 Quick Start Guide

## What's Fixed

✅ **Firebase Configuration**: Your actual credentials are now in `js/firebase-config.js`  
✅ **Code Bug Fixed**: RecaptchaVerifier constructor corrected  
✅ **Test Tools**: Created `test-auth.html` for debugging

## ⚡ 3 Steps to Get Authentication Working

### 1️⃣ Enable Google Sign-In (2 minutes)

Open this URL:
```
https://console.firebase.google.com/project/sutrakala-aa44b/authentication/providers
```

- Click **"Google"**
- Toggle **"Enable"** → ON
- Email: `sutraakala@gmail.com`
- Click **"Save"**

### 2️⃣ Enable Phone Authentication (1 minute)

On the same page:

- Click **"Phone"**
- Toggle **"Enable"** → ON
- Click **"Save"**

### 3️⃣ Test It! (1 minute)

Open in browser:
```
http://localhost:3000/test-auth.html
```

Click the test buttons to verify everything works!

---

## That's It!

Once you complete steps 1-2 above, your authentication will work.

**Main site**: http://localhost:3000/index.html

---

## Still Not Working?

### Check Browser Console

Press `F12` → Go to Console tab → Look for error messages

### Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "operation-not-allowed" | You didn't enable the provider in Firebase Console |
| "unauthorized-domain" | Add `localhost` to authorized domains in Firebase Console > Settings |
| "invalid-api-key" | Clear browser cache and refresh |

### Need More Help?

See the full guide: `AUTH_SETUP_GUIDE.md`

---

**Your Firebase Project**: sutrakala-aa44b
**Firebase Console**: https://console.firebase.google.com/project/sutrakala-aa44b/authentication
