# SoundWave - Music Discovery PWA

A beautiful, modern Progressive Web App for discovering, previewing, and downloading music from SoundCloud.

## Features

✨ **Modern Light Theme Design**
- Clean, beautiful interface with gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices

🎵 **Music Discovery**
- Search for any song or artist
- Large album artwork display
- Artist names and song titles clearly shown

🎧 **Audio Preview**
- Click any song to preview it
- Full audio controls with play/pause
- Seek bar to scrub through songs
- Time display (current/total)

⬇️ **Smart Downloads**
- Preview before downloading
- Downloads include embedded metadata and artwork
- Progress indicators and error handling

📱 **PWA Features**
- Install on your phone or desktop
- Works offline (cached resources)
- Native app-like experience
- Custom app icon and splash screen

## Installation

### As a PWA (Recommended)
1. Open the app in your browser
2. Look for the "Install App" button in the bottom right
3. Click it and follow the prompts
4. The app will be installed like a native app!

### Manual Setup
1. Download all files to a folder
2. Generate icons using `icons/generate-icons.html`
3. Serve the files from a web server (required for PWA features)

## PWA Files

- `manifest.json` - App metadata and configuration
- `sw.js` - Service worker for offline functionality
- `icons/` - App icons in various sizes
- `song.html` - Main application file

## Browser Support

- Chrome/Edge: Full PWA support
- Firefox: Basic PWA support
- Safari: Limited PWA support (iOS 11.3+)

## Technical Details

- **Offline Support**: Core app files are cached
- **Install Prompt**: Automatic install banner
- **Theme Color**: Matches app design (#4ecdc4)
- **Display Mode**: Standalone (no browser UI)
- **Orientation**: Portrait-primary

## Usage Tips

- Use the 1.5-second delay after search to prevent accidental clicks
- Preview songs before downloading to save bandwidth
- Install as PWA for the best experience
- Works great on mobile devices

Enjoy discovering music with SoundWave! 🎵