// Global variables
let typingTimer;
const delay = 1000;
const input = document.getElementById("query");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
const modal = document.getElementById("songModal");
const audioPlayer = document.getElementById("audioPlayer");
let selectedIndex = -1;
let currentTrack = null;
let isPlaying = false;
let clickDelayActive = false;

// Search functionality
input.addEventListener("input", () => {
  clearTimeout(typingTimer);
  if (input.value.trim()) {
    typingTimer = setTimeout(search, delay);
  } else {
    showEmptyState();
  }
});

async function search() {
  const q = input.value.trim();
  if (!q) {
    showEmptyState();
    return;
  }

  // Show loading
  results.style.display = "none";
  loading.style.display = "block";

  try {
    const query = q.replace(/\s+/g, "+");
    const url = `https://0.4texasplayz4.workers.dev/s/${query}`;

    const res = await fetch(url);
    const data = await res.json();

    // Hide loading
    loading.style.display = "none";
    results.style.display = "block";

    displayResults(data.results);
    
    // Enable click delay
    enableClickDelay();
    
  } catch (error) {
    console.error("Search failed:", error);
    loading.style.display = "none";
    results.style.display = "block";
    results.innerHTML = `
      <div class="empty-state">
        <h3>😕 Search failed</h3>
        <p>Please try again in a moment</p>
      </div>
    `;
  }
}

function showEmptyState() {
  loading.style.display = "none";
  results.style.display = "block";
  results.innerHTML = `
    <div class="empty-state">
      <h3>🎵 Ready to discover music?</h3>
      <p>Type in the search bar above to find your favorite songs</p>
    </div>
  `;
}

function displayResults(tracks) {
  results.innerHTML = "";
  selectedIndex = -1;

  if (!tracks || tracks.length === 0) {
    results.innerHTML = `
      <div class="empty-state">
        <h3>🔍 No results found</h3>
        <p>Try searching for something else</p>
      </div>
    `;
    return;
  }

  tracks.forEach((track, index) => {
    const div = document.createElement("div");
    div.className = "track";
    div.innerHTML = `
      <img class="track-artwork" src="${track.artwork}" alt="${track.title}">
      <div class="track-info">
        <div class="track-title">${track.title}</div>
        <div class="track-artist">${track.artist}</div>
      </div>
      <div class="track-duration">Preview</div>
    `;
    
    div.onclick = () => {
      if (!clickDelayActive) {
        openSongModal(track);
      }
    };
    
    results.appendChild(div);
  });
}

function enableClickDelay() {
  clickDelayActive = true;
  const tracks = document.querySelectorAll(".track");
  
  tracks.forEach(track => {
    track.classList.add("loading-delay");
  });
  
  setTimeout(() => {
    clickDelayActive = false;
    tracks.forEach(track => {
      track.classList.remove("loading-delay");
      track.classList.add("clickable");
    });
  }, 1500);
}

// Modal functionality
function openSongModal(track) {
  currentTrack = track;
  
  document.getElementById("modalArtwork").src = track.artwork;
  document.getElementById("modalTitle").textContent = track.title;
  document.getElementById("modalArtist").textContent = track.artist;
  
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  
  // Load audio for preview
  loadAudioPreview(track);
}

function closeSongModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  
  // Stop audio
  audioPlayer.pause();
  audioPlayer.src = "";
  isPlaying = false;
  updatePlayButton();
  resetSeekBar();
}

async function loadAudioPreview(track) {
  try {
    const url = new URL(track.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const username = parts[0];
    const slug = parts[1];

    const api = `https://0.4texasplayz4.workers.dev/d/${username}/${slug}`;
    const res = await fetch(api);
    const data = await res.json();

    audioPlayer.src = data.streamUrl;
    audioPlayer.load();
    
    audioPlayer.addEventListener('loadedmetadata', () => {
      document.getElementById("totalTime").textContent = formatTime(audioPlayer.duration);
    });
    
  } catch (error) {
    console.error("Failed to load audio preview:", error);
  }
}

// Audio controls
document.getElementById("playButton").addEventListener("click", togglePlay);
document.getElementById("seekBar").addEventListener("click", seek);
document.getElementById("closeModal").addEventListener("click", closeSongModal);
document.getElementById("downloadButton").addEventListener("click", () => download(currentTrack));

function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause();
  } else {
    audioPlayer.play();
  }
}

function updatePlayButton() {
  const playButton = document.getElementById("playButton");
  playButton.textContent = isPlaying ? "⏸" : "▶";
}

function seek(e) {
  const seekBar = document.getElementById("seekBar");
  const rect = seekBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = percent * audioPlayer.duration;
}

function updateSeekBar() {
  if (audioPlayer.duration) {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById("seekProgress").style.width = percent + "%";
    document.getElementById("currentTime").textContent = formatTime(audioPlayer.currentTime);
  }
}

function resetSeekBar() {
  document.getElementById("seekProgress").style.width = "0%";
  document.getElementById("currentTime").textContent = "0:00";
  document.getElementById("totalTime").textContent = "0:00";
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Audio event listeners
audioPlayer.addEventListener('play', () => {
  isPlaying = true;
  updatePlayButton();
});

audioPlayer.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayButton();
});

audioPlayer.addEventListener('timeupdate', updateSeekBar);

audioPlayer.addEventListener('ended', () => {
  isPlaying = false;
  updatePlayButton();
  resetSeekBar();
});

// Download functionality
async function download(track) {
  const downloadButton = document.getElementById("downloadButton");
  const originalText = downloadButton.textContent;
  
  try {
    downloadButton.textContent = "⏳ Downloading...";
    downloadButton.disabled = true;
    
    const url = new URL(track.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const username = parts[0];
    const slug = parts[1];

    const api = `https://0.4texasplayz4.workers.dev/d/${username}/${slug}`;
    const res = await fetch(api);
    const data = await res.json();

    const mp3Res = await fetch(data.streamUrl);
    const arrayBuffer = await mp3Res.arrayBuffer();

    const imgRes = await fetch(track.artwork);
    const imgBuffer = await imgRes.arrayBuffer();

    const writer = new ID3Writer(arrayBuffer);
    writer
      .setFrame("TIT2", track.title)
      .setFrame("TPE1", [track.artist])
      .setFrame("TALB", track.artist)
      .setFrame("APIC", { type: 3, data: imgBuffer, description: "Cover" });
    writer.addTag();

    const taggedBlob = new Blob([writer.arrayBuffer], { type: "audio/mpeg" });
    const filename = track.title.replace(/[^a-z0-9\- ]/gi,"").trim().replace(/\s+/g,"-") + ".mp3";

    const a = document.createElement("a");
    a.href = URL.createObjectURL(taggedBlob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    downloadButton.textContent = "✅ Downloaded!";
    setTimeout(() => {
      downloadButton.textContent = originalText;
      downloadButton.disabled = false;
    }, 2000);
    
  } catch(error) {
    console.error("Download failed:", error);
    downloadButton.textContent = "❌ Failed";
    setTimeout(() => {
      downloadButton.textContent = originalText;
      downloadButton.disabled = false;
    }, 2000);
  }
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "block") {
    if (e.key === "Escape") {
      closeSongModal();
    } else if (e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
    return;
  }
  
  const tracks = document.querySelectorAll(".track.clickable");
  if (!tracks.length) return;

  if (e.key === "Enter") {
    if (selectedIndex >= 0 && selectedIndex < tracks.length) {
      tracks[selectedIndex].click();
    }
  }
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeSongModal();
  }
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.createElement('button');
installButton.textContent = '📱 Install App';
installButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.3);
  display: none;
  z-index: 1000;
  transition: all 0.3s ease;
`;

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
    installButton.style.display = 'none';
  }
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.body.appendChild(installButton);
  installButton.style.display = 'block';
});

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  installButton.style.display = 'none';
});