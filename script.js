const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const albumArt = document.getElementById('album-art');

let isPlaying = false;
let raf = null;

// SVGs para play y pause (rosa)
const playIcon = `
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" >
    <circle cx="32" cy="32" r="30" fill="#ff69b4" />
    <polygon points="26,20 46,32 26,44" fill="white"/>
  </svg>`;
const pauseIcon = `
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" >
    <circle cx="32" cy="32" r="30" fill="#ff69b4" />
    <rect x="22" y="20" width="8" height="24" fill="white"/>
    <rect x="34" y="20" width="8" height="24" fill="white"/>
  </svg>`;

playPauseBtn.innerHTML = playIcon;

function togglePlay() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

audio.addEventListener('play', () => {
  isPlaying = true;
  playPauseBtn.innerHTML = pauseIcon;
  requestAnimationFrame(updateProgress);
  playPauseBtn.setAttribute('aria-label', 'Pausar');
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  playPauseBtn.innerHTML = playIcon;
  cancelAnimationFrame(raf);
  playPauseBtn.setAttribute('aria-label', 'Reproducir');
});

// Actualizar progreso visual y tiempo
function updateProgress() {
  const current = audio.currentTime;
  const duration = audio.duration || 0;
  const percent = (current / duration) * 100;
  progress.style.width = `${percent}%`;

  currentTimeEl.textContent = formatTime(current);
  durationEl.textContent = formatTime(duration);

  raf = requestAnimationFrame(updateProgress);
}

// Formatear segundos a mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Barra clickeable y arrastrable
function setProgress(e) {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX || e.touches[0].clientX;
  const width = rect.width;
  const offsetX = clickX - rect.left;
  const newTime = (offsetX / width) * audio.duration;
  audio.currentTime = newTime;
}

let isDragging = false;

progressBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  setProgress(e);
});

progressBar.addEventListener('touchstart', (e) => {
  isDragging = true;
  setProgress(e);
});

window.addEventListener('mouseup', () => {
  if (isDragging) isDragging = false;
});

window.addEventListener('touchend', () => {
  if (isDragging) isDragging = false;
});

progressBar.addEventListener('mousemove', (e) => {
  if (isDragging) setProgress(e);
});

progressBar.addEventListener('touchmove', (e) => {
  if (isDragging) setProgress(e);
});

playPauseBtn.addEventListener('click', () => {
  // Agrega clase bounce para animación
  playPauseBtn.classList.add('bounce');
  
  // Quita la clase después de la animación para que pueda repetirse
  setTimeout(() => {
    playPauseBtn.classList.remove('bounce');
  }, 300);
  
  // Ejecuta toggle play/pause
  togglePlay();
});


// --- CORAZONES ANIMADOS ---

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = '💖';
  
  heart.style.left = Math.random() * window.innerWidth + 'px';
  
  const duration = 3000 + Math.random() * 2000; // 3-5 segundos
  heart.style.animationDuration = duration + 'ms';
  
  const size = 16 + Math.random() * 24;
  heart.style.fontSize = size + 'px';
  
  const particles = document.getElementById('particles');
  particles.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, duration);
}

// Crear corazones cada 400ms
setInterval(createHeart, 400);
