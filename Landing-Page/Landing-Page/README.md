# ☕ Cafè Finder - Landing Page & Authentication

## 🎯 Overview

This is the landing page and authentication system for Cafè Finder. It includes:
- Beautiful landing page with animations
- Separate authentication for users and café owners
- Firebase integration for secure authentication
- Automatic redirects to appropriate portals

## 📁 File Structure

```
Landing-Page/Landing-Page/
├── index.html              ← Main landing page
├── auth-choice.html        ← Choose account type (User/Owner)
├── user-auth.html          ← User login/signup
├── owner-auth.html         ← Owner login/signup
├── firebase-config.js      ← Firebase configuration
├── .env                    ← Environment variables
├── .gitignore             ← Git ignore rules
├── SETUP-GUIDE.md         ← Complete setup instructions
└── README.md              ← This file
```

## 🚀 Quick Start

### 1. Firebase Setup (One-time, 5 minutes)

Follow the instructions in `SETUP-GUIDE.md`:
1. Enable Email/Password authentication in Firebase Console
2. Create Firestore database
3. Set Firestore security rules

### 2. Test the System

1. Open `index.html` in your browser
2. Click "Get Started"
3. Choose account type
4. Create a test account
5. Verify redirect works

## 🔑 Firebase Configuration

Your Firebase config is already set up in `firebase-config.js`:

```javascript
Project: cafehunt-e84a7
API Key: AIzaSyCR6fyqMDC-cBuARdXhD8KYn7Y3jqiXCVM
Auth Domain: cafehunt-e84a7.firebaseapp.com
```

## 🎨 Features

### Landing Page
- ✅ Animated hero section
- ✅ 3D coffee cup animation
- ✅ Feature cards
- ✅ Smooth transitions
- ✅ Responsive design
- ✅ "Get Started" button

### Authentication
- ✅ Separate user and owner portals
- ✅ Email/password authentication
- ✅ Firebase integration
- ✅ Firestore data storage
- ✅ Automatic redirects
- ✅ Error handling
- ✅ Success messages

## 🔄 User Flow

```
Landing Page
    ↓
Click "Get Started"
    ↓
Choose Account Type
    ↓
    ├─→ Coffee Lover → Login/Signup → Main Website
    └─→ Café Owner → Login/Signup → Owner Dashboard
```

## 💾 Data Storage

### LocalStorage (User)
```javascript
{
  userType: "user",
  userId: "firebase-uid",
  userEmail: "user@email.com",
  userName: "John Doe"
}
```

### LocalStorage (Owner)
```javascript
{
  userType: "owner",
  ownerId: "firebase-uid",
  ownerEmail: "owner@email.com",
  cafeName: "My Café",
  ownerLoggedIn: "true"
}
```

### Firestore Collections

**users/{userId}**
```javascript
{
  name: string,
  email: string,
  type: "user",
  createdAt: timestamp,
  savedCafes: array
}
```

**owners/{ownerId}**
```javascript
{
  cafeName: string,
  ownerName: string,
  email: string,
  type: "owner",
  createdAt: timestamp,
  cafes: array
}
```

## 🔒 Security

- ✅ Firebase Authentication (secure password handling)
- ✅ Firestore security rules
- ✅ Separate user/owner collections
- ✅ Session management via localStorage
- ✅ .gitignore protects sensitive files

## 🎨 Design

- **Colors**: Mocha, cream, caramel, gold
- **Fonts**: Playfair Display (headings), Inter (body)
- **Effects**: Glassmorphism, 3D transforms, animations
- **Responsive**: Mobile, tablet, desktop

## 📝 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `auth-choice.html` | Account type selection |
| `user-auth.html` | User authentication |
| `owner-auth.html` | Owner authentication |
| `firebase-config.js` | Firebase configuration |
| `SETUP-GUIDE.md` | Complete setup instructions |

## 🔧 Customization

### Change Colors
Edit the CSS in each HTML file:
```css
background: linear-gradient(135deg, #1A1A1A 0%, #2D2416 100%);
```

### Change Redirects
Edit the redirect URLs in auth files:
```javascript
window.location.href = '../../index.html'; // Change this
```

### Add Features
- Email verification
- Password reset
- Social login (Google, Facebook)
- Profile pictures
- Two-factor authentication

## 🐛 Common Issues

### Authentication not working
- Check Firebase Console → Authentication is enabled
- Verify Email/Password is enabled
- Check browser console for errors

### Redirect not working
- Verify file paths are correct
- Check that target files exist
- Look for console errors

### Firestore errors
- Ensure database is created
- Check security rules are published
- Verify rules syntax is correct

## 📚 Documentation

- `SETUP-GUIDE.md` - Complete setup instructions
- `../FIREBASE-SETUP.md` - Detailed Firebase guide
- `../AUTH-SYSTEM-SUMMARY.md` - System overview

## 🎉 You're Ready!

Everything is configured and ready to use. Just:
1. Follow SETUP-GUIDE.md for Firebase setup
2. Test the authentication flow
3. Start building your café finder!

---

**Questions?** Check the documentation files or Firebase Console logs.

**Happy coding! ☕🚀**
