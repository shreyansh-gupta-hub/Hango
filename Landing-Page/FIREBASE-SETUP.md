# Firebase Setup Guide for Cafè Finder

## Overview

The authentication system uses Firebase Authentication and Firestore to manage users and café owners separately.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "Cafe-Finder" (or your choice)
4. Follow the setup wizard
5. Create the project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your region
5. Click "Enable"

## Step 4: Set Up Firestore Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Owners collection
    match /owners/{ownerId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == ownerId;
    }
    
    // Cafes collection (public read, owner write)
    match /cafes/{cafeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click "Publish"

## Step 5: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** → **Project settings**
2. Scroll down to "Your apps"
3. Click the **Web icon** (</>)
4. Register your app with a nickname: "Cafe-Finder-Web"
5. Copy the `firebaseConfig` object

It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 6: Update Configuration Files

Replace the Firebase config in these files:

### 1. `user-auth.html`
Find this section (around line 200):
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Replace with your actual config.

### 2. `owner-auth.html`
Find the same section and replace with your config.

## Step 7: Test the Authentication

1. Open `Landing-Page/Landing-Page/index.html`
2. Click "Get Started"
3. Choose "I'm a Coffee Lover" or "I'm a Café Owner"
4. Try creating an account
5. Check Firebase Console → Authentication to see the new user

## Firestore Data Structure

### Users Collection
```javascript
users/{userId}
  - name: string
  - email: string
  - type: "user"
  - createdAt: timestamp
  - savedCafes: array
```

### Owners Collection
```javascript
owners/{ownerId}
  - cafeName: string
  - ownerName: string
  - email: string
  - type: "owner"
  - createdAt: timestamp
  - cafes: array
```

### Cafes Collection (Future)
```javascript
cafes/{cafeId}
  - name: string
  - ownerId: string
  - location: object
  - menu: array
  - images: array
  - rating: number
  - reviews: array
```

## Authentication Flow

### For Users:
1. User clicks "Get Started" on landing page
2. Chooses "I'm a Coffee Lover"
3. Signs up or logs in
4. Redirected to `../../index.html` (main website)
5. User data stored in localStorage:
   - `userType`: "user"
   - `userId`: Firebase UID
   - `userEmail`: User email
   - `userName`: User name

### For Owners:
1. Owner clicks "Get Started" on landing page
2. Chooses "I'm a Café Owner"
3. Signs up or logs in
4. Redirected to `../../owner-dashboard.html`
5. Owner data stored in localStorage:
   - `userType`: "owner"
   - `ownerId`: Firebase UID
   - `ownerEmail`: Owner email
   - `cafeName`: Café name
   - `ownerLoggedIn`: "true"

## Security Notes

⚠️ **Important**: The current setup uses test mode for Firestore. Before going to production:

1. Update Firestore rules to be more restrictive
2. Enable Firebase App Check
3. Set up proper authentication flows
4. Add email verification
5. Implement password reset functionality

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check that you've replaced `YOUR_API_KEY` with your actual API key

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console

### Users not appearing in Firestore
- Check Firestore rules
- Make sure the database is created
- Check browser console for errors

### Redirect not working
- Check the file paths in the redirect URLs
- Make sure `index.html` and `owner-dashboard.html` exist in the correct locations

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Enable authentication
3. ✅ Create Firestore database
4. ✅ Update configuration files
5. ✅ Test authentication flow
6. 🔄 Add email verification (optional)
7. 🔄 Add password reset (optional)
8. 🔄 Add social login (Google, Facebook) (optional)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration is correct
3. Check Firebase Console for authentication logs
4. Review Firestore rules

---

**Your authentication system is now ready!** 🎉

Users and café owners can sign up, log in, and be redirected to their respective portals with their profile information stored securely.
