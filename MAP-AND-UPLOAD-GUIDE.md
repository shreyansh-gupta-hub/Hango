# 🗺️📸 Map Integration & Image Upload Guide

## ✅ Features Implemented

### 1. 🗺️ **Real Leaflet Maps Integration**

#### User Portal (map.html)
- ✅ Interactive Leaflet map with OpenStreetMap tiles
- ✅ Custom coffee cup markers with animations
- ✅ Real GPS coordinates for café locations
- ✅ Click markers to view café details
- ✅ Smooth map animations and transitions
- ✅ "Get Directions" button (opens Google Maps)
- ✅ Filter functionality
- ✅ Slide-up info card with café details

#### Owner Portal (owner-add-cafe-new.html)
- ✅ Interactive map picker for café location
- ✅ Click to set precise coordinates
- ✅ Real-time lat/lng display
- ✅ Marker placement on click
- ✅ Coordinates saved with café data

### 2. 📸 **Image Upload Functionality**

#### User Profile (user-profile.html)
- ✅ Avatar upload with hover overlay
- ✅ Click to change profile photo
- ✅ Image preview before upload
- ✅ File validation (type & size)
- ✅ Firebase Storage integration
- ✅ LocalStorage fallback
- ✅ Toast notifications

#### Owner Portal (owner-add-cafe-new.html)
- ✅ Drag & drop image upload
- ✅ Multiple image support
- ✅ Image preview grid
- ✅ Remove uploaded images
- ✅ Firebase Storage upload
- ✅ Progress indicators
- ✅ File size validation (max 5MB)
- ✅ Image URLs saved to Firestore

#### Owner Gallery (owner-gallery-new.html)
- ✅ Upload modal with drag & drop
- ✅ Replace existing images
- ✅ Delete images with confirmation
- ✅ Live sync indicators

## 🔧 Technical Implementation

### Map Integration

#### Dependencies
```html
<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

#### User Portal Map (scripts/map.js)
```javascript
// Initialize map
map = L.map('map').setView([40.7580, -73.9855], 14);

// Add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Custom marker
const coffeeIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin">☕</div>',
    iconSize: [40, 40]
});

// Add marker
L.marker([lat, lng], { icon: coffeeIcon })
    .addTo(map)
    .on('click', () => showCafeInfo(cafe));
```

#### Owner Portal Map (scripts/owner-add-cafe.js)
```javascript
// Initialize map picker
map = L.map('map').setView([40.7128, -74.0060], 13);

// Click to set location
map.on('click', function(e) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;
});
```

### Image Upload

#### Firebase Storage Setup
```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } 
    from 'firebase/storage';

const storage = getStorage();
```

#### Upload Flow
1. **User selects image** → File input or drag & drop
2. **Validate file** → Check type and size
3. **Preview locally** → FileReader API
4. **Upload to Firebase** → Storage bucket
5. **Get download URL** → Public URL
6. **Save to Firestore** → Store URL in database
7. **Update UI** → Show success message

#### Code Example
```javascript
// Handle file selection
avatarUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    
    // Validate
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
    }
    
    // Read and preview
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageUrl = e.target.result;
        avatarImg.src = imageUrl;
        
        // Upload to Firebase
        const storageRef = ref(storage, `avatars/${userId}`);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Save URL
        localStorage.setItem('userAvatar', downloadURL);
    };
    reader.readAsDataURL(file);
});
```

## 📁 Files Modified/Created

### New Files
1. ✅ **scripts/firebase-config.js** - Firebase initialization with Storage
2. ✅ **MAP-AND-UPLOAD-GUIDE.md** - This documentation

### Modified Files
1. ✅ **map.html** - Added Leaflet CDN links
2. ✅ **scripts/map.js** - Complete rewrite with Leaflet
3. ✅ **user-profile.html** - Added avatar upload overlay
4. ✅ **scripts/profile.js** - Added image upload handling
5. ✅ **scripts/owner-add-cafe.js** - Added Firebase Storage upload
6. ✅ **styles/main.css** - Added map & upload styles

## 🎨 Custom Styling

### Map Markers
```css
.marker-pin {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #D4AF37, #C68B59);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    animation: marker-bounce 2s ease-in-out infinite;
}
```

### Avatar Upload Overlay
```css
.avatar-upload-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    opacity: 0;
    transition: opacity 0.3s ease;
}

#avatar-container:hover .avatar-upload-overlay {
    opacity: 1;
}
```

## 🚀 Usage Guide

### For Users

#### Exploring Cafés on Map
1. Go to **map.html**
2. See café markers on the map
3. Click any marker to view details
4. Click "Get Directions" for navigation
5. Use filters to refine results

#### Uploading Profile Photo
1. Go to **user-profile.html**
2. Hover over profile avatar
3. Click "Change Photo"
4. Select image (max 5MB)
5. Photo uploads automatically

### For Owners

#### Adding Café Location
1. Go to **owner-add-cafe-new.html**
2. Scroll to Location section
3. Click on map to set location
4. See coordinates update
5. Location saved with café

#### Uploading Café Images
1. In Add Café form
2. Drag & drop images or click to browse
3. See preview grid
4. Remove unwanted images
5. Click "Save & Publish"
6. Images upload to Firebase Storage

#### Managing Gallery
1. Go to **owner-gallery-new.html**
2. Click "Upload Images"
3. Select multiple images
4. Click "Upload & Sync"
5. Images appear in gallery
6. Replace or delete as needed

## 🔐 Firebase Storage Rules

Recommended security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars
    match /avatars/{userId} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024;
    }
    
    // Café images
    match /cafes/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

## 📊 Features Summary

### Map Features
| Feature | User Portal | Owner Portal |
|---------|-------------|--------------|
| Interactive Map | ✅ | ✅ |
| Custom Markers | ✅ | ✅ |
| Click to Select | ❌ | ✅ |
| Café Info Cards | ✅ | ❌ |
| Get Directions | ✅ | ❌ |
| Filters | ✅ | ❌ |
| Coordinates Display | ❌ | ✅ |

### Upload Features
| Feature | User Profile | Owner Portal |
|---------|--------------|--------------|
| Single Image | ✅ | ❌ |
| Multiple Images | ❌ | ✅ |
| Drag & Drop | ❌ | ✅ |
| Preview | ✅ | ✅ |
| Firebase Storage | ✅ | ✅ |
| LocalStorage Fallback | ✅ | ✅ |
| File Validation | ✅ | ✅ |
| Progress Indicator | ✅ | ✅ |

## 🧪 Testing Checklist

### Map Testing
- [ ] Map loads correctly
- [ ] Markers appear at correct locations
- [ ] Click marker shows café info
- [ ] Get Directions opens Google Maps
- [ ] Filters work correctly
- [ ] Map is responsive on mobile

### Upload Testing
- [ ] File input opens on click
- [ ] Drag & drop works
- [ ] Image preview displays
- [ ] File validation works (type & size)
- [ ] Upload progress shows
- [ ] Success message appears
- [ ] Image persists after refresh
- [ ] Firebase Storage receives files

## 🐛 Troubleshooting

### Map Not Loading
- Check Leaflet CDN links
- Verify map container has height
- Check browser console for errors
- Ensure coordinates are valid

### Upload Not Working
- Check Firebase Storage is enabled
- Verify storage rules allow writes
- Check file size < 5MB
- Verify file type is image/*
- Check browser console for errors

### Images Not Persisting
- Check Firebase Storage connection
- Verify Firestore rules
- Check localStorage quota
- Verify download URLs are saved

## 🎯 Next Steps

Potential enhancements:
- [ ] Image compression before upload
- [ ] Multiple file format support
- [ ] Crop/edit images before upload
- [ ] Batch upload progress
- [ ] Map clustering for many cafés
- [ ] Custom map styles
- [ ] Offline map support
- [ ] Image optimization

---

**🎉 Maps and Image Uploads Fully Integrated!**

Both portals now have complete map functionality and image upload capabilities with Firebase Storage integration.
