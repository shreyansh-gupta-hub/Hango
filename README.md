# ☕ Cafè Finder - Premium Coffee Experience Platform

A sleek, modern two-portal system for café discovery and management with stunning 3D elements, glassmorphism, and smooth animations.

## 🎨 Design Features

- **Premium Aesthetic**: Warm coffee-themed colors (mocha, cream, caramel, gold)
- **Glassmorphism**: Frosted glass panels with backdrop blur effects
- **3D Elements**: Floating cards, animated coffee icons, 3D map pins
- **Micro-interactions**: Hover reveals, card tilts, button bounces, shimmer effects
- **Smooth Animations**: Parallax scrolling, fade-ins, slide transitions

## 📱 User Portal Pages

### 1. Homepage (`index.html`)
- Hero section with animated 3D coffee cup and steam
- Smart search bar with location access
- 3D carousel of featured cafés
- Top picks grid with hover effects

### 2. Map View (`map.html`)
- Interactive 3D map with animated pins
- Slide-up café info cards
- Filter bar (price, rating, open now, distance)

### 3. Café Details (`cafe-details.html`)
- Parallax header image
- Tabbed interface (Overview, Menu, Reviews)
- 3D menu cards with hover effects
- Save functionality

### 4. User Profile (`user-profile.html`)
- Minimal profile card
- 3D grid of saved cafés
- Local storage integration

## 🏢 Owner Portal Pages

### 1. Login/Signup (`owner-login.html`, `owner-signup.html`)
- Glassmorphic auth cards
- Animated coffee particle background

### 2. Dashboard (`owner-dashboard.html`)
- 3D stats cards with trends
- Recent activity feed
- Quick actions

### 3. Add/Edit Café (`owner-add-cafe.html`)
- Comprehensive form with validation
- 3D map picker for location
- Drag-and-drop image upload
- Menu upload functionality

### 4. Gallery Manager (`owner-gallery.html`)
- Interactive 3D image grid
- Hover zoom effects
- Edit/delete actions

### 5. Analytics (`owner-analytics.html`)
- Animated 3D bar charts
- Location performance metrics
- Time-based filtering

## 🚀 Getting Started

1. Open `index.html` in a modern browser
2. Navigate through the user portal
3. Access owner portal via "For Owners" link
4. Login/signup to access dashboard features

## 💻 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, grid, animations
- **JavaScript**: Vanilla ES6+, localStorage, DOM manipulation
- **Fonts**: Playfair Display (headings), Inter (body)
- **Images**: Unsplash API placeholders

## 🎯 Key Features

### User Features
- Location-based café search
- Save favorite cafés
- View menus and reviews
- Get directions
- Filter by preferences

### Owner Features
- Manage café listings
- Upload images and menus
- View analytics and stats
- Track views and saves
- Manage multiple locations

## 🎨 Color Palette

```css
--mocha: #6F4E37
--dark-mocha: #4A3426
--cream: #F5E6D3
--beige: #E8D5C4
--matte-black: #1A1A1A
--soft-white: #FAFAFA
--caramel: #C68B59
--gold: #D4AF37
```

## 📐 Design Principles

1. **Lightweight & Airy**: Generous whitespace, soft gradients
2. **Futuristic**: 3D transforms, glassmorphism, neon glows
3. **Consistent**: Unified design language across all pages
4. **Accessible**: Semantic HTML, proper contrast ratios
5. **Responsive**: Mobile-first approach, fluid layouts

## 🔧 Customization

### Changing Colors
Edit CSS variables in `styles/main.css`:
```css
:root {
    --mocha: #YourColor;
    --gold: #YourColor;
}
```

### Adding New Cafés
Update the `cafes` object in `scripts/map.js`

### Modifying Animations
Edit keyframes in `styles/animations.css`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎭 Animation Classes

- `.fade-in` - Fade in effect
- `.slide-up` - Slide up animation
- `.hover-lift` - Lift on hover
- `.hover-glow` - Glow effect on hover
- `.card-tilt` - 3D tilt on hover

## 📦 File Structure

```
cafe-finder/
├── index.html
├── map.html
├── cafe-details.html
├── user-profile.html
├── owner-login.html
├── owner-signup.html
├── owner-dashboard.html
├── owner-add-cafe.html
├── owner-gallery.html
├── owner-analytics.html
├── styles/
│   ├── main.css
│   └── animations.css
├── scripts/
│   ├── main.js
│   ├── map.js
│   ├── cafe-details.js
│   ├── profile.js
│   ├── owner.js
│   └── auth.js
└── README.md
```

## 🌟 Future Enhancements

- Real-time café availability
- Booking system
- Social features (reviews, photos)
- Payment integration
- Mobile app version
- Dark/light theme toggle

## 📄 License

This project is open source and available for personal and commercial use.

---

**Built with ☕ and passion for great design**
