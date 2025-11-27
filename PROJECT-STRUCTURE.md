# 📁 Cafè Finder - Project Structure

## Complete File Tree

```
cafe-finder/
│
├── 📄 index.html                    # Homepage with hero & featured cafés
├── 📄 map.html                      # Interactive map view with filters
├── 📄 cafe-details.html             # Detailed café page with tabs
├── 📄 user-profile.html             # User profile with saved cafés
├── 📄 owner-login.html              # Owner authentication page
├── 📄 owner-signup.html             # Owner registration page
├── 📄 owner-dashboard.html          # Owner dashboard with stats
├── 📄 owner-add-cafe.html           # Add/edit café form
├── 📄 owner-gallery.html            # Gallery management interface
├── 📄 owner-analytics.html          # Analytics and insights
├── 📄 getting-started.html          # User guide and documentation
├── 📄 README.md                     # Project documentation
├── 📄 PROJECT-STRUCTURE.md          # This file
│
├── 📁 styles/
│   ├── 📄 main.css                  # Main stylesheet (1000+ lines)
│   │   ├── Reset & Base Styles
│   │   ├── Navigation & Header
│   │   ├── Hero Section
│   │   ├── Search Components
│   │   ├── Card Layouts (2D & 3D)
│   │   ├── Map Interface
│   │   ├── Café Details
│   │   ├── User Profile
│   │   ├── Auth Pages
│   │   ├── Owner Dashboard
│   │   ├── Forms & Inputs
│   │   ├── Charts & Analytics
│   │   ├── Gallery Grid
│   │   ├── Mobile Menu
│   │   ├── Utility Classes
│   │   ├── Scrollbar Styling
│   │   ├── Toast & Modal
│   │   └── Responsive Breakpoints
│   │
│   └── 📄 animations.css            # Animation library
│       ├── Keyframe Animations
│       ├── Hover Effects
│       ├── Loading States
│       └── Micro-interactions
│
└── 📁 scripts/
    ├── 📄 main.js                   # Core functionality
    │   ├── Smooth Scrolling
    │   ├── Search Logic
    │   ├── Location Services
    │   ├── Carousel Controls
    │   ├── Scroll Animations
    │   ├── Parallax Effects
    │   ├── Mobile Menu
    │   ├── Toast System
    │   └── Loading Overlay
    │
    ├── 📄 map.js                    # Map page logic
    │   ├── Pin Interactions
    │   ├── Café Data Management
    │   ├── Info Card Slide-up
    │   ├── Drag Gestures
    │   └── Filter Controls
    │
    ├── 📄 cafe-details.js           # Café details functionality
    │   ├── Tab Switching
    │   ├── Save/Unsave Logic
    │   ├── Parallax Header
    │   ├── 3D Card Effects
    │   └── Scroll Animations
    │
    ├── 📄 profile.js                # User profile features
    │   ├── Load Saved Cafés
    │   ├── LocalStorage Management
    │   ├── Unsave Functionality
    │   └── 3D Hover Effects
    │
    ├── 📄 owner.js                  # Owner dashboard logic
    │   ├── Authentication Check
    │   ├── File Upload (Drag & Drop)
    │   ├── Form Submission
    │   ├── Stats Animation
    │   ├── Chart Animation
    │   ├── Progress Bars
    │   └── Gallery Interactions
    │
    └── 📄 auth.js                   # Authentication system
        ├── Login Handler
        ├── Signup Handler
        ├── Session Management
        └── Particle Animation
```

## 🎯 Page Breakdown

### User Portal (5 pages)

| Page | File | Purpose | Key Features |
|------|------|---------|--------------|
| Homepage | `index.html` | Landing & discovery | Hero, search, carousel, top picks |
| Map View | `map.html` | Location-based search | Interactive map, filters, info cards |
| Café Details | `cafe-details.html` | Full café information | Tabs, menu, reviews, save button |
| User Profile | `user-profile.html` | Personal dashboard | Saved cafés, profile info |
| Getting Started | `getting-started.html` | Documentation | User guide, tips, links |

### Owner Portal (5 pages)

| Page | File | Purpose | Key Features |
|------|------|---------|--------------|
| Login | `owner-login.html` | Authentication | Glassmorphic form, particles |
| Signup | `owner-signup.html` | Registration | Account creation |
| Dashboard | `owner-dashboard.html` | Overview | Stats cards, activity feed |
| Add Café | `owner-add-cafe.html` | Listing management | Forms, uploads, map picker |
| Gallery | `owner-gallery.html` | Image management | 3D grid, hover zoom |
| Analytics | `owner-analytics.html` | Insights | Charts, metrics, trends |

## 🎨 CSS Architecture

### Main Stylesheet Organization

```css
/* 1. Reset & Variables */
- CSS Reset
- Color Variables
- Typography Base

/* 2. Layout Components */
- Navigation Bar
- Hero Section
- Footer

/* 3. UI Elements */
- Buttons (Primary, Secondary)
- Forms & Inputs
- Cards (2D, 3D)
- Badges & Tags

/* 4. Page-Specific Styles */
- Map Interface
- Café Details
- User Profile
- Owner Dashboard
- Auth Pages

/* 5. Responsive Design */
- Tablet (1024px)
- Mobile (768px)
- Small Mobile (480px)

/* 6. Utilities */
- Spacing Classes
- Display Helpers
- Scrollbar Styling
- Selection Colors
```

### Animation Library

```css
/* Keyframe Animations */
- float, steam, scroll
- bounce, pulse
- float-particle
- shimmer, fadeIn
- slideUp, slideDown
- rotate3d, glow

/* Utility Classes */
- .fade-in
- .slide-up
- .hover-lift
- .hover-glow
- .card-tilt
```

## 📜 JavaScript Modules

### Core Functions

| Module | File | Responsibilities |
|--------|------|------------------|
| Navigation | `main.js` | Smooth scroll, mobile menu |
| Search | `main.js` | Query handling, location |
| Carousel | `main.js` | Drag scroll, auto-play |
| Animations | `main.js` | Scroll observers, parallax |
| Notifications | `main.js` | Toast system, loading |

### Feature-Specific

| Feature | File | Functions |
|---------|------|-----------|
| Map | `map.js` | Pin clicks, info cards, filters |
| Details | `cafe-details.js` | Tabs, save, 3D effects |
| Profile | `profile.js` | Load saved, unsave, storage |
| Owner | `owner.js` | Auth, uploads, animations |
| Auth | `auth.js` | Login, signup, sessions |

## 🎭 Design System

### Color Palette

```css
Primary Colors:
- Mocha: #6F4E37
- Dark Mocha: #4A3426
- Cream: #F5E6D3
- Beige: #E8D5C4

Accent Colors:
- Gold: #D4AF37
- Caramel: #C68B59

Neutrals:
- Matte Black: #1A1A1A
- Soft White: #FAFAFA
```

### Typography

```css
Headings: 'Playfair Display', serif
Body: 'Inter', sans-serif

Sizes:
- Hero: 4rem
- H1: 3.5rem
- H2: 2.5rem
- H3: 1.8rem
- Body: 1rem
```

### Spacing Scale

```css
0.5rem (8px)  - xs
1rem (16px)   - sm
1.5rem (24px) - md
2rem (32px)   - lg
3rem (48px)   - xl
```

## 🔧 Key Technologies

- **HTML5**: Semantic markup, accessibility
- **CSS3**: Grid, Flexbox, Custom Properties, Animations
- **JavaScript ES6+**: Modules, Arrow Functions, Template Literals
- **LocalStorage**: Client-side data persistence
- **Geolocation API**: Location services
- **Intersection Observer**: Scroll animations

## 📱 Responsive Breakpoints

```css
Desktop:  > 1024px  (Full features)
Tablet:   768-1024px (Adapted layout)
Mobile:   < 768px   (Mobile menu, stacked)
Small:    < 480px   (Compact UI)
```

## 🚀 Performance Features

- Lazy loading images
- CSS animations (GPU accelerated)
- Debounced scroll events
- Optimized selectors
- Minimal dependencies
- LocalStorage caching

## 🎯 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Assets Used

- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Images**: Unsplash API (placeholder images)
- **Icons**: Unicode emoji (☕ 📍 ⭐ etc.)

## 🔐 Data Storage

```javascript
LocalStorage Keys:
- savedCafes: Array of saved café objects
- ownerLoggedIn: Boolean authentication state
- ownerEmail: Owner email address
- cafeName: Owner café name
```

## 🎨 3D Effects Implementation

1. **Card Tilt**: `transform: perspective() rotateX() rotateY()`
2. **Floating**: `animation: float` with translateY
3. **Depth**: `box-shadow` with multiple layers
4. **Glassmorphism**: `backdrop-filter: blur()`
5. **Parallax**: Scroll-based `transform: translateY()`

## 📊 Component Hierarchy

```
App
├── Navigation
│   ├── Logo
│   ├── Nav Links
│   └── Mobile Menu
├── Pages
│   ├── User Portal
│   │   ├── Homepage
│   │   │   ├── Hero
│   │   │   ├── Search
│   │   │   ├── Featured Carousel
│   │   │   └── Top Picks Grid
│   │   ├── Map View
│   │   │   ├── Filters Bar
│   │   │   ├── Map Container
│   │   │   └── Info Card
│   │   ├── Café Details
│   │   │   ├── Header
│   │   │   ├── Tabs
│   │   │   └── Content Sections
│   │   └── Profile
│   │       ├── Profile Card
│   │       └── Saved Grid
│   └── Owner Portal
│       ├── Auth Pages
│       ├── Dashboard
│       │   ├── Stats Cards
│       │   └── Activity Feed
│       ├── Add Café
│       │   ├── Form Sections
│       │   └── Upload Zones
│       ├── Gallery
│       └── Analytics
│           └── Charts
└── Footer
```

---

**Built with ☕ and attention to detail**
