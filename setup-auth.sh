#!/bin/bash

echo "================================"
echo "Firebase Authentication Setup"
echo "================================"
echo ""
echo "Project: sutrakala-aa44b"
echo ""

# Check if we can access Firebase
echo "Checking Firebase CLI access..."
firebase projects:list > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Firebase CLI is authenticated"
else
    echo "❌ Firebase CLI not authenticated. Run: firebase login"
    exit 1
fi

echo ""
echo "To enable authentication, please:"
echo ""
echo "1️⃣  Open Firebase Console:"
echo "   https://console.firebase.google.com/project/sutrakala-aa44b/authentication/providers"
echo ""
echo "2️⃣  Enable Google Sign-In:"
echo "   - Click 'Google'"
echo "   - Toggle 'Enable'"
echo "   - Set project support email to: sutraakala@gmail.com"
echo "   - Click 'Save'"
echo ""
echo "3️⃣  Enable Phone Authentication:"
echo "   - Click 'Phone'"
echo "   - Toggle 'Enable'"
echo "   - Click 'Save'"
echo ""
echo "4️⃣  Verify Authorized Domains:"
echo "   - Go to Settings tab"
echo "   - Under 'Authorized domains', make sure 'localhost' is listed"
echo "   - Add your production domain if deploying"
echo ""
echo "================================"
echo "Your Firebase config has been updated in:"
echo "  js/firebase-config.js"
echo "================================"
