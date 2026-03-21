# ✅ Authentication Setup Checklist

## Code Fixes (COMPLETED ✅)

- [x] Add Firebase credentials to `js/firebase-config.js`
- [x] Fix RecaptchaVerifier constructor in `js/core/auth-helpers.js`
- [x] Create test page (`test-auth.html`)
- [x] Create setup documentation
- [x] Start local development server

## Firebase Console Setup (⚠️ YOUR ACTION REQUIRED)

Visit: https://console.firebase.google.com/project/sutrakala-aa44b/authentication/providers

- [ ] **Enable Google Sign-In**
  - [ ] Click on "Google" provider
  - [ ] Toggle "Enable" switch to ON
  - [ ] Set support email to: `sutraakala@gmail.com`
  - [ ] Click "Save"

- [ ] **Enable Phone Authentication**
  - [ ] Click on "Phone" provider
  - [ ] Toggle "Enable" switch to ON
  - [ ] Click "Save"

- [ ] **Verify Authorized Domains** (Optional but recommended)
  - [ ] Go to Settings tab
  - [ ] Check that `localhost` is in authorized domains
  - [ ] Add production domain if deploying

## Testing (Do After Firebase Setup)

- [ ] **Open test page**: http://localhost:3000/test-auth.html
- [ ] **Test Google Sign-In**: Click "Test Google Sign-In" button
  - [ ] Should open Google account selector
  - [ ] Should show success message after selecting account
- [ ] **Test Phone Auth**: Click "Test Phone Auth" button
  - [ ] Should show "reCAPTCHA initialized successfully"
  - [ ] No errors in console

## Final Verification

- [ ] **Test on main site**: http://localhost:3000/index.html
- [ ] Click "Login" button in navbar
- [ ] Try Google sign-in
- [ ] Try Phone OTP sign-in

## Troubleshooting

If authentication still doesn't work:

1. **Check browser console** (F12 → Console tab)
2. **Look for error codes**:
   - `auth/operation-not-allowed` → Provider not enabled
   - `auth/unauthorized-domain` → Domain not authorized
   - `auth/invalid-api-key` → Clear cache and retry

3. **Use test page** for detailed error messages
4. **Read guides**:
   - Quick: `QUICK_START.md`
   - Detailed: `AUTH_SETUP_GUIDE.md`

---

## Estimated Time

- Firebase Console Setup: **3 minutes**
- Testing: **2 minutes**
- **Total: ~5 minutes**

---

## Notes

- Local server is running at: http://localhost:3000
- Stop server: `pkill -f "python3 -m http.server 3000"`
- Restart server: `cd "/Users/biswyaa/Documents/Crochet Site" && python3 -m http.server 3000`

---

**Last Updated**: March 21, 2026
**Project**: sutrakala-aa44b
**Status**: Code fixes complete, awaiting Firebase Console configuration
