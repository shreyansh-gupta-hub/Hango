#!/bin/bash

# Icon Replacement Script for Cafè Finder
# This script replaces all emoji icons with Font Awesome icons

echo "Starting icon replacement..."

# Function to replace icons in a file
replace_icons() {
    local file=$1
    
    # Add Font Awesome CDN if not present
    if ! grep -q "font-awesome" "$file"; then
        sed -i.bak 's|</head>|    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>|' "$file"
    fi
    
    # Replace emojis with Font Awesome icons
    sed -i.bak 's|☕|<i class="fas fa-mug-hot"></i>|g' "$file"
    sed -i.bak 's|📍|<i class="fas fa-location-dot"></i>|g' "$file"
    sed -i.bak 's|⭐|<i class="fas fa-star"></i>|g' "$file"
    sed -i.bak 's|📊|<i class="fas fa-chart-line"></i>|g' "$file"
    sed -i.bak 's|🏪|<i class="fas fa-store"></i>|g' "$file"
    sed -i.bak 's|➕|<i class="fas fa-plus"></i>|g' "$file"
    sed -i.bak 's|📈|<i class="fas fa-chart-bar"></i>|g' "$file"
    sed -i.bak 's|🖼️|<i class="fas fa-images"></i>|g' "$file"
    sed -i.bak 's|⚙️|<i class="fas fa-cog"></i>|g' "$file"
    sed -i.bak 's|🚪|<i class="fas fa-right-from-bracket"></i>|g' "$file"
    sed -i.bak 's|📸|<i class="fas fa-camera"></i>|g' "$file"
    sed -i.bak 's|📋|<i class="fas fa-clipboard"></i>|g' "$file"
    sed -i.bak 's|🗑️|<i class="fas fa-trash"></i>|g' "$file"
    sed -i.bak 's|🔄|<i class="fas fa-rotate"></i>|g' "$file"
    sed -i.bak 's|💰|<i class="fas fa-dollar-sign"></i>|g' "$file"
    sed -i.bak 's|🕐|<i class="fas fa-clock"></i>|g' "$file"
    sed -i.bak 's|🎯|<i class="fas fa-bullseye"></i>|g' "$file"
    sed -i.bak 's|♡|<i class="far fa-heart"></i>|g' "$file"
    sed -i.bak 's|♥|<i class="fas fa-heart"></i>|g' "$file"
    sed -i.bak 's|📶|<i class="fas fa-wifi"></i>|g' "$file"
    sed -i.bak 's|🔌|<i class="fas fa-plug"></i>|g' "$file"
    sed -i.bak 's|🌿|<i class="fas fa-leaf"></i>|g' "$file"
    sed -i.bak 's|🐕|<i class="fas fa-paw"></i>|g' "$file"
    sed -i.bak 's|📞|<i class="fas fa-phone"></i>|g' "$file"
    sed -i.bak 's|📧|<i class="fas fa-envelope"></i>|g' "$file"
    sed -i.bak 's|✏️|<i class="fas fa-pen"></i>|g' "$file"
    sed -i.bak 's|👁️|<i class="fas fa-eye"></i>|g' "$file"
    sed -i.bak 's|🔔|<i class="fas fa-bell"></i>|g' "$file"
    sed -i.bak 's|🔒|<i class="fas fa-lock"></i>|g' "$file"
    sed -i.bak 's|🔐|<i class="fas fa-shield-halved"></i>|g' "$file"
    sed -i.bak 's|⚠️|<i class="fas fa-triangle-exclamation"></i>|g' "$file"
    sed -i.bak 's|ℹ️|<i class="fas fa-circle-info"></i>|g' "$file"
    sed -i.bak 's|✓|<i class="fas fa-check"></i>|g' "$file"
    sed -i.bak 's|✗|<i class="fas fa-xmark"></i>|g' "$file"
    sed -i.bak 's|🔍|<i class="fas fa-magnifying-glass"></i>|g' "$file"
    sed -i.bak 's|🔥|<i class="fas fa-fire"></i>|g' "$file"
    sed -i.bak 's|💾|<i class="fas fa-floppy-disk"></i>|g' "$file"
    sed -i.bak 's|🚀|<i class="fas fa-rocket"></i>|g' "$file"
    sed -i.bak 's|⏳|<i class="fas fa-hourglass-half"></i>|g' "$file"
    sed -i.bak 's|📡|<i class="fas fa-tower-broadcast"></i>|g' "$file"
    sed -i.bak 's|❤️|<i class="fas fa-heart"></i>|g' "$file"
    sed -i.bak 's|👤|<i class="fas fa-user"></i>|g' "$file"
    sed -i.bak 's|🗺️|<i class="fas fa-map"></i>|g' "$file"
    
    echo "Processed: $file"
}

# Process all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        replace_icons "$file"
    fi
done

# Process owner portal files
for file in owner-*.html; do
    if [ -f "$file" ]; then
        replace_icons "$file"
    fi
done

echo "Icon replacement complete!"
echo "Backup files created with .bak extension"
