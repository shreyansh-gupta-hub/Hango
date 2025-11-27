# 🔧 Troubleshooting Guide - Cafè Finder

## ✅ Issues Fixed

### 1. "For Owners" Button Removed ✓
**Issue**: "For Owners" button was visible in user portal navigation

**Solution**: Removed from all user portal pages:
- ✓ index.html
- ✓ map.html
- ✓ cafe-details.html
- ✓ user-profile.html
- ✓ getting-started.html

### 2. Published Cafés Not Appearing ✓
**Issue**: Cafés published in owner portal weren't showing in user portal

**Solutions Applied**:
1. **Removed orderBy requirement** - Firestore orderBy requires an index
2. **Added JavaScript sorting** - Sort cafés after fetching
3. **Improved error handling** - Better logging and fallbacks
4. **Fixed query structure** - Simplified Firestore queries

### 3. Image Upload Issues ✓
**Issue**: Problems uploading images when publishing cafés

**Solutions Applied**:
1. **Better validation** - Check file size and type
2. **Improved error handling** - Continue without images if upload fails
3. **Dynamic imports** - Load Firebase modules when needed
4. **Unique filenames** - Prevent naming conflicts
5. **Progress indicators** - Show upload status
6. **Fallback mode** - Save café even if images fail

## 🧪 Testing Steps

### Test 1: Verify "For Owners" Button Removed
```
1. Open index.html
2. Check navigation bar
3. ✓ Should only see: Home, Explore, Profile
```

### Test 2: Publish Café Without Images
```
1. Go to owner-add-cafe-new.html
2. Fill in:
   - Name: "Test Café"
   - Category: "Café"
   - Description: "Test description"
3. Click map to set location
4. Click "Save & Publish Live"
5. ✓ Should see success message
6. Open index.html
7. ✓ Should see "Test Café" in carousel
```

### Test 3: Publish Café With Images
```
1. Go to owner-add-cafe-new.html
2. Fill in all fields
3. Drag & drop 2-3 images
4. ✓ Should see preview grid
5. Click "Save & Publish Live"
6. ✓ Should see "Uploading images..." message
7. ✓ Should see success after upload
8. Open index.html
9. ✓ Should see café with images
```

### Test 4: Real-Time Sync
```
1. Open index.html in one tab
2. Open owner-add-cafe-new.html in another tab
3. Publish a new café
4. Switch to index.html tab
5. ✓ Should see new café appear within 1-2 seconds
```

## 🐛 Common Issues & Solutions

### Issue: Cafés Still Not Appearing

**Check 1: Firebase Connection**
```javascript
// Open browser console (F12)
// Look for these messages:
✓ Firebase initialized! 🔥
✓ Loaded X cafés from Firestore
```

**Check 2: Firestore Rules**
```javascript
// Make sure Firestore rules allow reading:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cafes/{cafeId} {
      allow read: if resource.data.status == 'live';
      allow write: if request.auth != null;
    }
  }
}
```

**Check 3: Café Status**
```javascript
// Cafés must have status: 'live' to appear
// Check in Firebase Console:
// Firestore Database > cafes > [document] > status = 'live'
```

### Issue: Images Not Uploading

**Solution 1: Check File Size**
```
- Max size: 5MB per image
- Supported: JPG, PNG, WebP
- If too large, compress before upload
```

**Solution 2: Check Storage Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cafes/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

**Solution 3: Check Browser Console**
```javascript
// Look for upload progress:
Uploading image 1/3...
✓ Image 1 uploaded successfully
Uploading image 2/3...
✓ Image 2 uploaded successfully
```

### Issue: "orderBy requires an index" Error

**Solution**: Already fixed! We removed orderBy and sort in JavaScript instead.

**If you still see this error:**
```javascript
// The query has been simplified to:
query(collection(db, 'cafes'), where('status', '==', 'live'))

// No orderBy = No index needed!
```

### Issue: Module Import Errors

**Solution**: Make sure you're using a web server, not file:// protocol

**Option 1: VS Code Live Server**
```
1. Install "Live Server" extension
2. Right-click index.html
3. Select "Open with Live Server"
```

**Option 2: Python Server**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Option 3: Node.js Server**
```bash
npx http-server -p 8000
```

### Issue: Real-Time Updates Not Working

**Check 1: Internet Connection**
```
- Firestore requires active internet
- Check browser is online
```

**Check 2: Console Logs**
```javascript
// Should see:
🔄 Real-time update: X cafés
```

**Check 3: Listener Active**
```javascript
// In browser console, check:
// Application > IndexedDB > firestore
// Should see active connections
```

## 📊 Debugging Checklist

### Before Publishing Café
- [ ] All required fields filled
- [ ] Location selected on map
- [ ] Images under 5MB each
- [ ] Browser console open (F12)
- [ ] Internet connection active

### During Publishing
- [ ] See "Uploading images..." message
- [ ] See progress in console
- [ ] No red errors in console
- [ ] Success message appears

### After Publishing
- [ ] Check Firebase Console > Firestore
- [ ] Verify document exists in 'cafes' collection
- [ ] Verify status = 'live'
- [ ] Check Firebase Console > Storage
- [ ] Verify images uploaded to 'cafes/' folder

### On User Portal
- [ ] Open index.html
- [ ] Check browser console for logs
- [ ] Look for "Loaded X cafés" message
- [ ] Verify café appears in carousel
- [ ] Check images load correctly

## 🔍 Console Commands for Debugging

### Check Firebase Connection
```javascript
// Paste in browser console:
console.log('Firebase DB:', db);
console.log('Firebase Storage:', storage);
```

### Manually Load Cafés
```javascript
// Paste in browser console:
import { loadCafesFromFirestore } from './scripts/load-cafes.js';
const cafes = await loadCafesFromFirestore();
console.log('Cafés:', cafes);
```

### Check Local Storage
```javascript
// Paste in browser console:
console.log('Owner ID:', localStorage.getItem('ownerId'));
console.log('Owner Email:', localStorage.getItem('ownerEmail'));
```

## 🎯 Expected Behavior

### Publishing Flow
```
1. Owner fills form → ✓ Form validates
2. Owner uploads images → ✓ Preview shows
3. Owner clicks publish → ✓ "Uploading..." appears
4. Images upload → ✓ Progress logs in console
5. Data saves → ✓ "Publishing..." appears
6. Success! → ✓ Success modal shows
7. User portal updates → ✓ New café appears
```

### Timeline
```
0s   - Click "Publish"
1-5s - Upload images
6s   - Save to Firestore
7s   - User portal receives update
8s   - New café visible to users
```

## 🚨 Error Messages Explained

### "Please fill in all required fields"
- **Cause**: Name, category, or description is empty
- **Fix**: Fill in all required fields

### "Image size should be less than 5MB"
- **Cause**: Image file is too large
- **Fix**: Compress image or choose smaller file

### "Image upload failed. Saving café without images."
- **Cause**: Storage upload error
- **Fix**: Café saved successfully, images can be added later

### "Error: Missing or insufficient permissions"
- **Cause**: Firestore rules don't allow write
- **Fix**: Update Firestore rules or login as owner

### "Firebase initialization error"
- **Cause**: Firebase config issue
- **Fix**: Check firebase-config.js has correct credentials

## ✅ Success Indicators

When everything works:
- ✓ No red errors in console
- ✓ Green success messages
- ✓ Progress logs visible
- ✓ Success modal appears
- ✓ Café appears on user portal
- ✓ Images load correctly
- ✓ Real-time updates work

## 📞 Still Having Issues?

### Check These Files
1. **scripts/firebase-config.js** - Firebase credentials
2. **scripts/load-cafes.js** - Café loading logic
3. **scripts/owner-add-cafe.js** - Publishing logic

### Browser Console
- Press F12 to open
- Go to Console tab
- Look for errors (red text)
- Copy error messages for debugging

### Firebase Console
- Go to console.firebase.google.com
- Check Firestore Database
- Check Storage
- Check Authentication

---

**🎉 All Issues Should Be Fixed!**

The platform now works smoothly with proper error handling and fallbacks.
