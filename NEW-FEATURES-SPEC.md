# 🚀 New Features Specification

## Feature 1: Smart Café Recommendations
### User Flow
1. User logs in → Redirected to Personalized Match page
2. Fills form with preferences
3. Gets AI-powered café recommendations
4. Real-time sync with owner updates

### Technical Stack
- **Frontend**: HTML5, CSS3 (Blue Theme), Vanilla JS
- **Backend**: Firebase Firestore
- **Real-time**: Firestore onSnapshot listeners
- **Animations**: CSS3 + GSAP (optional)

### Data Structure
```javascript
{
  userId: 'user123',
  preferences: {
    people: 4,
    budget: 2000,
    occasion: 'Birthday celebration',
    location: { lat, lng },
    dietary: ['vegetarian'],
    foodType: ['desserts', 'coffee']
  },
  recommendations: [
    { cafeId, matchScore, reasons: [] }
  ],
  timestamp: Date
}
```

## Feature 2: Social Seating
### User Flow
1. **Host Table**: Create themed table → Set rules → Goes live
2. **Join Table**: Browse tables → Join → Wait for threshold
3. **Confirmation**: Auto-notify café owner → Send invites

### Technical Stack
- **Real-time Updates**: Firestore listeners
- **Notifications**: Firebase Cloud Messaging (optional)
- **State Management**: Local + Firestore sync

### Data Structure
```javascript
{
  tableId: 'table123',
  hostId: 'user123',
  cafeId: 'cafe001',
  niche: 'Anime Fans',
  maxSeats: 10,
  currentSeats: 7,
  participants: [
    { userId, name, avatar, joinedAt }
  ],
  status: 'filling', // filling | confirmed | completed
  scheduledTime: Date,
  entryRules: 'Must love anime',
  createdAt: Date
}
```

## Design System
### Colors (Blue Theme)
- Primary: #00d4ff (Cyan)
- Secondary: #4dd4ff (Light Cyan)
- Background: #1a2332 (Dark Blue)
- Cards: rgba(42, 56, 75, 0.6)
- Glow: rgba(0, 212, 255, 0.3)

### Typography
- Font: Poppins
- Headings: 700 weight
- Body: 400-500 weight

### Effects
- Glassmorphism: backdrop-filter blur
- 3D Depth: box-shadow layers
- Animations: transform, opacity transitions
- Micro-interactions: hover scale, pulse

## File Structure
```
/user-recommendations.html
/social-tables.html
/styles/recommendations.css
/styles/social-tables.css
/scripts/recommendations.js
/scripts/social-tables.js
/scripts/matching-algorithm.js
```

## Implementation Priority
1. ✅ Create HTML pages with blue theme
2. ✅ Build CSS with glassmorphism effects
3. ✅ Implement form interactions
4. ✅ Add Firebase integration
5. ✅ Create real-time sync
6. ✅ Add to owner dashboard
7. ✅ Test end-to-end flow

## Timeline Estimate
- Phase 1: UI/UX (2-3 hours)
- Phase 2: Functionality (3-4 hours)
- Phase 3: Real-time sync (2-3 hours)
- Phase 4: Testing & Polish (2 hours)

**Total**: ~10-12 hours of development

---

**Note**: This is a comprehensive feature set. I'll start with the core pages and functionality, then iterate based on feedback.
