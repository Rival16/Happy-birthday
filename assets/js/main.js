// ===== Efek typing pesan ucapan =====
const message = "Semoga hidupmu selalu dipenuhi hal-hal indah dan orang-orang baik di sekitarmu. I believe good things take time, and sometimes the best stories are written with patience. Jadi kalau suatu saat nanti jalan kita ketemu di waktu yang pas, semoga kita bisa saling melengkapi dengan versi terbaik kita masing-masing ✨.";
let index = 0;
const typedText = document.getElementById('typed-text');

function typeEffect() {
  if (index < message.length) {
    typedText.innerHTML += message.charAt(index);
    index++;
    setTimeout(typeEffect, 80);
  }
}

// ===== Modal Surprise (biarkan seperti semula) =====
const modal = document.getElementById('giftModal');
const closeBtn = modal.querySelector('.close');

document.getElementById('surpriseBtn').addEventListener('click', () => {
  modal.classList.add('show');
});
closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// ===== Confetti effect =====
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettis = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function Confetti() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height - canvas.height;
  this.size = Math.random() * 8 + 5;
  this.speed = Math.random() * 3 + 2;
  this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
}

let spawnCounter = 0;
let confettiRunning = false;

function updateConfettis() {
  if (!confettiRunning) return;
  spawnCounter++;
  if (confettis.length < 200 && spawnCounter % 5 === 0) {
    confettis.push(new Confetti());
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettis.forEach((c) => {
    c.y += c.speed;
    if (c.y > canvas.height) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.size, c.size);
  });
  animationId = requestAnimationFrame(updateConfettis);
}

function stopConfetti() {
  confettiRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettis = [];
  spawnCounter = 0;
}

function startConfetti() {
  stopConfetti();
  confettiRunning = true;
  updateConfettis();
}

// ===== Musik =====
const music = document.getElementById('bg-music');

// ===== Fungsi reset dan mulai efek surprise =====
function resetAndStartSurprise() {
  // Reset typed text
  typedText.innerHTML = '';
  index = 0;
  
  // Reset confetti
  stopConfetti();
  
  // Mulai efek typing
  typeEffect();
  
  // Mulai confetti setelah jeda 2 detik
  setTimeout(() => {
    startConfetti();
  }, 2000);
  
  // Putar musik
  if (music.paused) {
    music.play().catch(() => {
      // Autoplay blocked, tunggu interaksi user
      const playOnInteraction = () => {
        music.play();
        document.body.removeEventListener('click', playOnInteraction);
        document.body.removeEventListener('touchstart', playOnInteraction);
      };
      document.body.addEventListener('click', playOnInteraction);
      document.body.addEventListener('touchstart', playOnInteraction);
    });
  } else {
    // Jika musik sudah diputar, reset ke awal
    music.currentTime = 0;
  }
}

// ===== Lock screen logic =====
const lockScreen = document.getElementById('lock-screen');
const mainContent = document.getElementById('main-content');
const countdown = document.getElementById('countdown');

// TARGET WAKTU: 6 April 2026, 00:01:00
const targetDate = new Date(2026, 3, 6, 0, 1, 0);

function showMainContent() {
  lockScreen.style.display = 'none';
  mainContent.style.display = 'block';
  resetAndStartSurprise();
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    if (lockScreen.style.display !== 'none') {
      showMainContent();
    }
    clearInterval(countdownInterval);
  } else {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdown.textContent = `Tunggu ya… ${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
  }
}

// Jalankan pertama kali
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

// tombol buka manual
document.getElementById('forceOpen').addEventListener('click', () => {
  const now = new Date();
  if (now >= targetDate) {
    showMainContent();
    clearInterval(countdownInterval);
  } else {
    alert('Belum waktunya sayang🙂');
  }
});

// Jika sudah melewati target saat halaman dimuat, langsung tampilkan
if (new Date() >= targetDate) {
  showMainContent();
  clearInterval(countdownInterval);
}

// Opacity control untuk album foto
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');
const photoStacks = document.querySelectorAll('.photo-stack');

if (opacitySlider) {
  // Set initial opacity
  photoStacks.forEach(photo => {
    photo.style.opacity = opacitySlider.value;
  });
  
  // Update opacity when slider changes
  opacitySlider.addEventListener('input', function() {
    const value = this.value;
    opacityValue.textContent = value;
    photoStacks.forEach(photo => {
      photo.style.opacity = value;
    });
  });
}

// ===== Kamera =====
const video = document.getElementById('camera');
const canvasSnap = document.getElementById('snapshot');
const snapBtn = document.getElementById('snapBtn');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Kamera tidak bisa diakses: ", err);
      video.insertAdjacentHTML('afterend', '<p style="color:red;">⚠️ Kamera tidak tersedia.</p>');
    });
}

snapBtn.addEventListener('click', () => {
  const ctx = canvasSnap.getContext('2d');
  canvasSnap.width = video.videoWidth;
  canvasSnap.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvasSnap.width, canvasSnap.height);

  // tampilkan hasil
  canvasSnap.style.display = 'block';

  // tambahin teks ucapan di atas foto
  ctx.font = "40px Poppins";
  ctx.fillStyle = "hotpink";
  ctx.fillText("🎂 Happy Birthday! 🎉", 20, 50);
});

// Efek animasi untuk gallery photos
const photoImgs = document.querySelectorAll('.photos img');

const photoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.3 });

photoImgs.forEach(img => photoObserver.observe(img));