# 🗄️ Database Reset Guide

## Quick Fix

The cafés aren't showing because of a data structure mismatch. Here's how to fix it:

### Step 1: Open Browser Console
1. Open `reset-database.html` in your browser
2. Open Developer Tools (F12)
3. Go to the Console tab

### Step 2: Check for Errors
Look for any Firebase errors or authentication issues.

### Step 3: Run the Reset
Click the "Reset Database" button and watch the console for:
- ✅ Success messages
- ❌ Error messages

## Common Issues

### Issue 1: "Permission Denied"
**Solution**: Make sure your Firestore rules allow writes:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cafes/{cafeId} {
      allow read: if true;
      allow write: if true;  // Temporarily allow all writes for testing
    }
  }
}
```

### Issue 2: "Collection not found"
**Solution**: The collection will be created automatically when you add the first café.

### Issue 3: Old cafés still showing
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+Shift+R)
3. Check if the data structure matches

## Data Structure

The cafés should have this structure:
```javascript
{
  id: 'cafe-001',
  name: 'Café Name',
  description: 'Description text',
  address: 'Full address',
  location: {
    lat: 40.7420,
    lng: -74.0064
  },
  rating: '4.8',  // String, not number
  reviews: '342',  // String, not number
  images: ['url1', 'url2'],  // Array of image URLs
  tags: ['WiFi', 'Outdoor'],
  hours: { ... },
  amenities: [...],
  featured: true,
  createdAt: 'ISO date string'
}
```

## Manual Reset via Firebase Console

If the automated reset doesn't work:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `cafehunt-e84a7`
3. Go to Firestore Database
4. Find the `cafes` collection
5. Delete all documents manually
6. Add new documents with the structure above

## Verify Data

After reset, check:
1. Open browser console
2. Run: `await getDocs(collection(db, 'cafes'))`
3. Should see 8 cafés

## Still Not Working?

Check these files:
- `scripts/load-cafes.js` - Should NOT filter by status
- `scripts/main.js` - Should call `initHomepage()`
- `scripts/map.js` - Should call `loadCafesForMap()`

The load-cafes.js has been updated to remove the status filter, so all cafés should now load.
