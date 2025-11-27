# 🔒 Firebase Permissions Check

## Quick Fix for "Permission Denied" Errors

If the reset button isn't working, it's likely a Firestore permissions issue.

### Step 1: Check Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **cafehunt-e84a7**
3. Click **Firestore Database** in left menu
4. Click **Rules** tab at the top
5. You should see something like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 2: Update Rules (Temporary for Testing)

Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read cafes
    match /cafes/{cafeId} {
      allow read: if true;
      allow write: if true;  // TEMPORARY - for testing only
    }
    
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated owners to read/write their own data
    match /owners/{ownerId} {
      allow read, write: if request.auth != null && request.auth.uid == ownerId;
    }
  }
}
```

### Step 3: Publish Rules

1. Click **Publish** button
2. Wait for confirmation
3. Try the reset button again

## Alternative: Use Simple Add Script

If you still have issues, use the simpler script:

1. Open `add-cafes-simple.html` in your browser
2. Click "Add Cafés to Database"
3. Watch the log for success/error messages

## Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors like:
   - "Permission denied"
   - "CORS error"
   - "Network error"
   - "Firebase not initialized"

## Common Issues

### Issue 1: CORS Error
**Solution**: Make sure you're accessing via `http://` or `https://`, not `file://`

### Issue 2: Firebase Not Initialized
**Solution**: Check that firebase-config.js exists and has correct credentials

### Issue 3: Network Error
**Solution**: Check your internet connection and Firebase project status

### Issue 4: Module Import Error
**Solution**: Make sure you're using a modern browser (Chrome, Firefox, Edge)

## Production Rules (After Testing)

Once everything works, update to more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for cafes
    match /cafes/{cafeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         get(/databases/$(database)/documents/owners/$(request.auth.uid)).data.role == 'admin');
    }
    
    // User data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Owner data
    match /owners/{ownerId} {
      allow read, write: if request.auth != null && request.auth.uid == ownerId;
    }
  }
}
```

## Verify Data Was Added

After adding cafés:

1. Go to Firebase Console
2. Click Firestore Database
3. Click Data tab
4. Look for "cafes" collection
5. You should see 8 documents (cafe-001 through cafe-008)

## Still Not Working?

Try these steps:

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Use incognito mode**: To rule out extension issues
3. **Try different browser**: Chrome, Firefox, or Edge
4. **Check Firebase project**: Make sure it's active and not suspended
5. **Verify API key**: Check firebase-config.js has correct credentials

---

**Need Help?** Check the browser console for specific error messages.
