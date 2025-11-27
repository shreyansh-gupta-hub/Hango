# 🔥 Firestore Database Setup - Complete Step-by-Step Guide

## Overview

This guide will walk you through setting up Firestore database for your Cafè Finder project. Follow each step carefully.

**Time Required**: 5-10 minutes  
**Difficulty**: Easy  
**Prerequisites**: Firebase project created (cafehunt-e84a7)

---

## Part 1: Enable Firebase Authentication

### Step 1: Open Firebase Console

1. Go to: **https://console.firebase.google.com/**
2. You should see your project: **cafehunt-e84a7**
3. Click on the project card to open it

**What you'll see**: Firebase project dashboard with various options in the left sidebar

---

### Step 2: Navigate to Authentication

1. Look at the **left sidebar**
2. Find and click on **"Authentication"** (🔐 icon)
3. If you see a "Get Started" button, click it

**What you'll see**: Authentication dashboard (might be empty if first time)

---

### Step 3: Enable Email/Password Authentication

1. Click on the **"Sign-in method"** tab at the top
2. You'll see a list of authentication providers
3. Find **"Email/Password"** in the list
4. Click on it to open the settings

**What you'll see**: A modal/popup with Email/Password settings

---

### Step 4: Enable the Provider

1. In the popup, you'll see a toggle switch for **"Enable"**
2. Click the toggle to turn it **ON** (it should turn blue/green)
3. You'll see two options:
   - ✅ Email/Password (check this)
   - ⬜ Email link (passwordless sign-in) (leave unchecked for now)
4. Click **"Save"** button at the bottom

**What you'll see**: Email/Password should now show as "Enabled" in the providers list

---

## Part 2: Create Firestore Database

### Step 5: Navigate to Firestore

1. Go back to the **left sidebar**
2. Find and click on **"Firestore Database"** (📊 icon)
3. You should see a page with a **"Create database"** button
4. Click **"Create database"**

**What you'll see**: A setup wizard will appear

---

### Step 6: Choose Security Rules Mode

You'll see two options:

**Option 1: Production mode** (Secure, but requires rules setup)
**Option 2: Test mode** (Open access for 30 days) ← **Choose this one**

1. Select **"Start in test mode"**
2. Read the warning (it's okay for development)
3. Click **"Next"**

**Why test mode?**: 
- Easier for development
- We'll add proper security rules later
- Good for testing your app

---

### Step 7: Select Cloud Firestore Location

1. You'll see a dropdown menu for **"Cloud Firestore location"**
2. Choose the region **closest to you** or your users:
   - **US**: `us-central1` (Iowa) or `us-east1` (South Carolina)
   - **Europe**: `europe-west1` (Belgium) or `europe-west2` (London)
   - **Asia**: `asia-south1` (Mumbai) or `asia-southeast1` (Singapore)

3. **Important**: This cannot be changed later!
4. Click **"Enable"**

**What happens next**: Firebase will create your database (takes 30-60 seconds)

---

### Step 8: Wait for Database Creation

You'll see a loading screen that says:
- "Creating your Cloud Firestore database..."
- "This may take a few minutes"

**Wait for it to complete** (usually 30-60 seconds)

**What you'll see**: Once done, you'll see the Firestore Database dashboard with:
- A "Start collection" button
- Empty database (no data yet)
- Tabs: Data, Rules, Indexes, Usage

---

## Part 3: Set Up Security Rules

### Step 9: Navigate to Rules Tab

1. At the top of the Firestore page, you'll see tabs
2. Click on the **"Rules"** tab
3. You'll see a code editor with default rules

**What you'll see**: 
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 23);
    }
  }
}
```

---

### Step 10: Replace with Secure Rules

1. **Select all the text** in the editor (Ctrl+A or Cmd+A)
2. **Delete it**
3. **Copy and paste** the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - Coffee lovers
    match /users/{userId} {
      // Anyone authenticated can read user profiles
      allow read: if request.auth != null;
      // Users can only write their own data
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Owners collection - Café owners
    match /owners/{ownerId} {
      // Anyone authenticated can read owner profiles
      allow read: if request.auth != null;
      // Owners can only write their own data
      allow write: if request.auth != null && request.auth.uid == ownerId;
    }
    
    // Cafes collection - Café listings
    match /cafes/{cafeId} {
      // Anyone can read café listings (public)
      allow read: if true;
      // Only authenticated users can write
      allow write: if request.auth != null;
    }
    
    // Reviews collection (future use)
    match /reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      // Only authenticated users can write reviews
      allow create: if request.auth != null;
      // Users can only update/delete their own reviews
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

---

### Step 11: Publish the Rules

1. Click the **"Publish"** button at the top right
2. You'll see a confirmation message
3. Wait for "Rules published successfully" message

**What you'll see**: 
- Green checkmark ✅
- "Rules published successfully"
- Timestamp of when rules were published

---

## Part 4: Verify Everything Works

### Step 12: Check Authentication Status

1. Go back to **Authentication** in the left sidebar
2. Click on **"Sign-in method"** tab
3. Verify **Email/Password** shows as **"Enabled"**

**Status**: ✅ Should show green/enabled

---

### Step 13: Check Firestore Status

1. Go back to **Firestore Database** in the left sidebar
2. Click on **"Data"** tab
3. You should see an empty database (no collections yet)

**Status**: ✅ Database is ready to receive data

---

### Step 14: Check Rules Status

1. In Firestore, click on **"Rules"** tab
2. Verify your rules are there
3. Check the timestamp shows recent publish time

**Status**: ✅ Rules are active

---

## Part 5: Test Your Setup

### Step 15: Test Authentication

1. Open your project: `Landing-Page/Landing-Page/index.html`
2. Click **"Get Started"** button
3. Choose **"I'm a Coffee Lover"**
4. Fill out the signup form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
5. Click **"Create Account"**

**What should happen**:
- ✅ "Account created! Redirecting..." message
- ✅ Redirect to main website
- ✅ No errors in browser console (F12)

---

### Step 16: Verify User in Firebase

1. Go back to **Firebase Console**
2. Click **Authentication** in sidebar
3. Click **"Users"** tab
4. You should see your test user!

**What you'll see**:
- Email: test@example.com
- User UID: (random string)
- Created: (timestamp)
- Signed In: (timestamp)

---

### Step 17: Verify Data in Firestore

1. Go to **Firestore Database** in sidebar
2. Click **"Data"** tab
3. You should see a **"users"** collection
4. Click on it to expand
5. You should see your user document

**What you'll see**:
```
users/
  └── {userId}/
      ├── name: "Test User"
      ├── email: "test@example.com"
      ├── type: "user"
      ├── createdAt: "2025-11-23..."
      └── savedCafes: []
```

---

### Step 18: Test Owner Authentication

1. Open: `Landing-Page/Landing-Page/index.html`
2. Click **"Get Started"**
3. Choose **"I'm a Café Owner"**
4. Fill out the form:
   - Café Name: Test Café
   - Owner Name: Test Owner
   - Email: owner@example.com
   - Password: test123456
5. Click **"Create Account"**

**What should happen**:
- ✅ "Account created! Redirecting..." message
- ✅ Redirect to owner dashboard
- ✅ No errors

---

### Step 19: Verify Owner in Firestore

1. Go back to **Firestore Database**
2. You should now see **two collections**:
   - users
   - owners
3. Click on **"owners"** collection
4. You should see your owner document

**What you'll see**:
```
owners/
  └── {ownerId}/
      ├── cafeName: "Test Café"
      ├── ownerName: "Test Owner"
      ├── email: "owner@example.com"
      ├── type: "owner"
      ├── createdAt: "2025-11-23..."
      └── cafes: []
```

---

## ✅ Success Checklist

Go through this checklist to make sure everything is set up:

- [ ] Firebase Console accessible
- [ ] Project "cafehunt-e84a7" visible
- [ ] Authentication enabled
- [ ] Email/Password provider enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Test user account created
- [ ] User data in Firestore "users" collection
- [ ] Test owner account created
- [ ] Owner data in Firestore "owners" collection
- [ ] No errors in browser console
- [ ] Redirects working correctly

---

## 🎉 You're Done!

If all checkboxes above are checked, your Firestore database is fully set up and working!

---

## 🐛 Troubleshooting

### Problem: "Create database" button is grayed out

**Solution**: 
- Make sure you're on the correct project
- Check if database already exists (look for "Data" tab)
- Try refreshing the page

---

### Problem: "Permission denied" error when signing up

**Solution**:
- Check that Email/Password authentication is enabled
- Verify you're using the correct Firebase config
- Check browser console for specific error

---

### Problem: User created but not in Firestore

**Solution**:
- Check Firestore rules are published
- Verify database was created successfully
- Check browser console for Firestore errors
- Make sure you're looking at the right project

---

### Problem: "Firebase: Error (auth/operation-not-allowed)"

**Solution**:
- Go to Authentication → Sign-in method
- Make sure Email/Password is enabled (toggle should be ON)
- Click Save if you just enabled it

---

### Problem: Rules won't publish

**Solution**:
- Check for syntax errors in rules
- Make sure you copied the entire rules block
- Try refreshing the page and pasting again

---

## 📊 Understanding Your Database Structure

### Collections Created:

**1. users/** - Coffee lovers
- Stores user profiles
- Saved cafés
- Preferences

**2. owners/** - Café owners
- Stores owner profiles
- Café listings
- Business info

**3. cafes/** - Café listings (created when owners add cafés)
- Café details
- Menu items
- Images
- Reviews

---

## 🔒 Security Rules Explained

### Users Collection:
```javascript
allow read: if request.auth != null;
```
- Any logged-in user can read user profiles

```javascript
allow write: if request.auth != null && request.auth.uid == userId;
```
- Users can only edit their own profile

### Owners Collection:
- Same rules as users
- Owners can only edit their own data

### Cafes Collection:
```javascript
allow read: if true;
```
- Anyone can view café listings (public)

```javascript
allow write: if request.auth != null;
```
- Only logged-in users can create/edit cafés

---

## 📱 Next Steps

Now that Firestore is set up, you can:

1. ✅ Create user accounts
2. ✅ Create owner accounts
3. ✅ Store user data
4. ✅ Store owner data
5. 🔄 Add café listings (coming soon)
6. 🔄 Add reviews (coming soon)
7. 🔄 Add favorites (coming soon)

---

## 📚 Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

---

## 💡 Tips

1. **Backup your rules**: Copy your security rules to a file
2. **Monitor usage**: Check Firestore usage tab regularly
3. **Test thoroughly**: Always test with different user types
4. **Check console**: Browser console shows helpful error messages
5. **Use test accounts**: Don't use real emails for testing

---

## 🎊 Congratulations!

You've successfully set up Firestore database for Cafè Finder!

Your authentication system is now fully functional with:
- ✅ User authentication
- ✅ Owner authentication
- ✅ Secure data storage
- ✅ Proper security rules

**You're ready to start building! ☕🚀**

---

**Questions?** Check the troubleshooting section or Firebase Console logs.

**Happy coding!** 🎉
