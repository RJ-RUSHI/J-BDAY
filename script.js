/**
 * JAYA'S BIRTHDAY SURPRISE - INTERACTIVE JAVASCRIPT ENGINE
 * Pure Vanilla JavaScript: 60fps Ambient & Celebration Canvases,
 * Web Audio Synthesizer, Interactive Cake, Lightbox, Typewriter, Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. AMBIENT BACKGROUND CANVAS (Floating Hearts, Stars, Petals, Bokeh)
  // =========================================================================
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ambCtx = ambientCanvas ? ambientCanvas.getContext('2d') : null;

  let width = (ambientCanvas.width = window.innerWidth);
  let height = (ambientCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (!ambientCanvas) return;
    width = ambientCanvas.width = window.innerWidth;
    height = ambientCanvas.height = window.innerHeight;
  });

  const ambientIcons = ['❤️', '💖', '✨', '🌸', '🦋', '⭐', '🎈'];
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 24 : 45;

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 16 + 10;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.icon = ambientIcons[Math.floor(Math.random() * ambientIcons.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.icon, 0, 0);
      ctx.restore();
    }
  }

  if (ambCtx) {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new AmbientParticle());
    }

    function animateAmbient() {
      ambCtx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.update();
        p.draw(ambCtx);
      }
      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();
  }

  // =========================================================================
  // 2. CELEBRATION CANVAS (Confetti, Fireworks, Sparkles)
  // =========================================================================
  const celebrationCanvas = document.getElementById('celebrationCanvas');
  const celCtx = celebrationCanvas ? celebrationCanvas.getContext('2d') : null;

  if (celebrationCanvas) {
    celebrationCanvas.width = window.innerWidth;
    celebrationCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      celebrationCanvas.width = window.innerWidth;
      celebrationCanvas.height = window.innerHeight;
    });
  }

  let celebrationParticles = [];

  const confettiColors = ['#ff2a6d', '#ff4d8d', '#9d4edd', '#c77dff', '#ffbe0b', '#ffd166', '#ffffff', '#00f5d4'];

  class ConfettiParticle {
    constructor(x, y, isBurst = false) {
      this.x = x ?? window.innerWidth / 2;
      this.y = y ?? window.innerHeight / 2;
      const angle = Math.random() * Math.PI * 2;
      const velocity = isBurst ? Math.random() * 16 + 6 : Math.random() * 8 + 2;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - (isBurst ? 4 : 0);
      this.gravity = 0.25;
      this.friction = 0.96;
      this.size = Math.random() * 10 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.opacity -= this.decay;
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function fireConfetti(originX, originY, count = 90) {
    playChimeEffect();
    const x = originX ?? window.innerWidth / 2;
    const y = originY ?? window.innerHeight / 3;
    for (let i = 0; i < count; i++) {
      celebrationParticles.push(new ConfettiParticle(x, y, true));
    }
  }

  function animateCelebration() {
    if (!celCtx) return;
    celCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

    for (let i = celebrationParticles.length - 1; i >= 0; i--) {
      const p = celebrationParticles[i];
      p.update();
      p.draw(celCtx);
      if (p.opacity <= 0 || p.y > celebrationCanvas.height + 50) {
        celebrationParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCelebration);
  }
  animateCelebration();

  // =========================================================================
  // 3. AUDIO PLAYER & WEB AUDIO SYNTHESIZER
  // =========================================================================
  const bgAudio = document.getElementById('bgAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicStatusText = document.getElementById('musicStatusText');
  const musicEqualizer = document.getElementById('musicEqualizer');
  const musicIcon = document.getElementById('musicIcon');

  let isMusicPlaying = false;
  let audioContext = null;

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Soft romantic chime sound effect generator
  function playChimeEffect() {
    try {
      initAudioContext();
      if (!audioContext) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(audioContext.currentTime + idx * 0.08);
        osc.stop(audioContext.currentTime + idx * 0.08 + 0.65);
      });
    } catch (e) {
      console.log('Chime sound played', e);
    }
  }

  if (musicToggleBtn && bgAudio) {
    musicToggleBtn.addEventListener('click', () => {
      initAudioContext();
      if (isMusicPlaying) {
        bgAudio.pause();
        isMusicPlaying = false;
        musicToggleBtn.classList.remove('playing');
        musicStatusText.textContent = 'Play Music';
        musicIcon.textContent = '🔇';
      } else {
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isMusicPlaying = true;
              musicToggleBtn.classList.add('playing');
              musicStatusText.textContent = 'Mute Music';
              musicIcon.textContent = '🎵';
            })
            .catch(() => {
              // Fallback synthesizer if mp3 can't load in local context
              isMusicPlaying = true;
              musicToggleBtn.classList.add('playing');
              musicStatusText.textContent = 'Mute Music';
              musicIcon.textContent = '🎵';
              playSynthMelodyLoop();
            });
        }
      }
    });
  }

  // Backup synthetic sweet melody loop if audio file isn't available
  let synthLoopActive = false;
  function playSynthMelodyLoop() {
    if (synthLoopActive) return;
    synthLoopActive = true;
    const score = [
      { f: 293.66, d: 0.75 }, { f: 293.66, d: 0.25 }, { f: 329.63, d: 1.0 }, { f: 293.66, d: 1.0 },
      { f: 392.00, d: 1.0 }, { f: 369.99, d: 2.0 },
      { f: 293.66, d: 0.75 }, { f: 293.66, d: 0.25 }, { f: 329.63, d: 1.0 }, { f: 293.66, d: 1.0 },
      { f: 440.00, d: 1.0 }, { f: 392.00, d: 2.0 }
    ];

    let noteIdx = 0;
    function nextNote() {
      if (!isMusicPlaying) {
        synthLoopActive = false;
        return;
      }
      const item = score[noteIdx % score.length];
      if (audioContext) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, audioContext.currentTime);
        gain.gain.setValueAtTime(0.12, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + item.d * 0.55);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + item.d * 0.6);
      }
      noteIdx++;
      setTimeout(nextNote, item.d * 550);
    }
    nextNote();
  }

  // =========================================================================
  // 4. NAVIGATION SCROLL & ACTIVE STATE
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. HERO OPEN SURPRISE BUTTON
  // =========================================================================
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', e => {
      e.preventDefault();
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 120);
      const revealSection = document.getElementById('reveal');
      if (revealSection) {
        revealSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================================
  // 7. TYPEWRITER EFFECT FOR SPECIAL BIRTHDAY MESSAGE
  // =========================================================================
  const typewriterTarget = document.getElementById('typewriterTarget');
  const replayTypewriterBtn = document.getElementById('replayTypewriterBtn');

  const messageParagraphs = [
    'Today is your special day, and I hope you know just how wonderful you are.',
    'May your life always be filled with happiness, beautiful moments, genuine smiles and people who truly care about you.',
    'May every dream you have slowly turn into reality.',
    'Keep smiling, keep shining and always stay the amazing person you are.',
    'Wishing you a very Happy Birthday, Jaya! 🎂❤️✨',
    'May this year bring you countless reasons to smile. 💖'
  ];

  let typewriterRunning = false;

  function runTypewriter() {
    if (!typewriterTarget || typewriterRunning) return;
    typewriterRunning = true;
    typewriterTarget.innerHTML = '';

    let pIndex = 0;

    function typeParagraph() {
      if (pIndex >= messageParagraphs.length) {
        typewriterRunning = false;
        return;
      }

      const pText = messageParagraphs[pIndex];
      const pElem = document.createElement('p');
      pElem.className = 'letter-paragraph';
      if (pIndex === 4) {
        pElem.classList.add('letter-highlight');
      }
      typewriterTarget.appendChild(pElem);

      let charIndex = 0;
      function typeChar() {
        if (charIndex < pText.length) {
          pElem.textContent += pText.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 25);
        } else {
          pIndex++;
          setTimeout(typeParagraph, 250);
        }
      }
      typeChar();
    }

    typeParagraph();
  }

  // Trigger typewriter once the message section scrolls into view
  const messageSection = document.getElementById('message');
  if (messageSection) {
    let triggered = false;
    const msgObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            runTypewriter();
          }
        });
      },
      { threshold: 0.3 }
    );
    msgObserver.observe(messageSection);
  }

  if (replayTypewriterBtn) {
    replayTypewriterBtn.addEventListener('click', () => {
      runTypewriter();
      playChimeEffect();
    });
  }

  // =========================================================================
  // 8. INTERACTIVE BIRTHDAY CAKE & MAKE A WISH
  // =========================================================================
  const cakeElement = document.getElementById('cakeElement');
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const relightCandleBtn = document.getElementById('relightCandleBtn');
  const wishSentBanner = document.getElementById('wishSentBanner');

  let isCandleLit = true;

  function blowOutCandle() {
    if (!isCandleLit) return;
    isCandleLit = false;

    if (flame) flame.classList.add('blown-out');
    if (smoke) {
      smoke.classList.remove('active');
      void smoke.offsetWidth; // trigger reflow
      smoke.classList.add('active');
    }

    // Launch multi-layer celebration
    const rect = cakeElement.getBoundingClientRect();
    const cakeCenterX = rect.left + rect.width / 2;
    const cakeCenterY = rect.top + 40;

    fireConfetti(cakeCenterX, cakeCenterY, 140);
    setTimeout(() => fireConfetti(cakeCenterX - 150, cakeCenterY - 50, 80), 200);
    setTimeout(() => fireConfetti(cakeCenterX + 150, cakeCenterY - 50, 80), 400);

    if (blowCandleBtn) blowCandleBtn.classList.add('hidden');
    if (relightCandleBtn) relightCandleBtn.classList.remove('hidden');
    if (wishSentBanner) wishSentBanner.classList.remove('hidden');
  }

  function relightCandle() {
    isCandleLit = true;
    if (flame) flame.classList.remove('blown-out');
    if (smoke) smoke.classList.remove('active');
    if (blowCandleBtn) blowCandleBtn.classList.remove('hidden');
    if (relightCandleBtn) relightCandleBtn.classList.add('hidden');
    if (wishSentBanner) wishSentBanner.classList.add('hidden');
    playChimeEffect();
  }

  if (cakeElement) {
    cakeElement.addEventListener('click', () => {
      if (isCandleLit) blowOutCandle();
      else relightCandle();
    });
  }

  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', blowOutCandle);
  }

  if (relightCandleBtn) {
    relightCandleBtn.addEventListener('click', relightCandle);
  }

  // =========================================================================
  // 9. FULLSCREEN LIGHTBOX (Gallery + Memory Wall)
  // =========================================================================
  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxHeartBtn = document.getElementById('lightboxHeartBtn');
  const lightboxHeartCount = document.getElementById('lightboxHeartCount');

  // Gather photos
  const photoItems = [
    { src: 'assets/images/jaya1.jpg', caption: 'Simply Beautiful ❤️', title: 'Jaya - Radiant Smile' },
    { src: 'assets/images/jaya2.jpg', caption: 'That Smile ✨', title: 'Birthday Cupcake Joy' },
    { src: 'assets/images/jaya3.jpg', caption: 'Pure Happiness 💖', title: 'Garden Rose Elegance' },
    { src: 'assets/images/jaya4.jpg', caption: 'Beautiful Moment 🌸', title: 'Cozy Cafe Smiles' },
    { src: 'assets/images/jaya5.jpg', caption: 'Golden Radiance 🌅', title: 'Sunset Golden Hour Glow' },
    { src: 'assets/images/jaya6.jpg', caption: 'Always Special ❤️', title: 'Sparkler Night Magic' },
    { src: 'assets/images/jaya7.jpg', caption: 'Grace & Tradition 🌸', title: 'Celebration Saree Grace' },
    { src: 'assets/images/jaya8.jpg', caption: 'Pure Joy & Celebration 🎈', title: 'Pastel Balloons Dreams' },
    { src: 'assets/images/jaya9.jpg', caption: 'Just Jaya ✨', title: 'Grand Birthday Elegance' }
  ];

  let currentPhotoIndex = 0;

  function openLightbox(index) {
    currentPhotoIndex = (index + photoItems.length) % photoItems.length;
    const item = photoItems[currentPhotoIndex];
    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoItems.length}`;
    if (photoLightbox) {
      photoLightbox.classList.add('active');
      photoLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (photoLightbox) {
      photoLightbox.classList.remove('active');
      photoLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function nextPhoto() {
    openLightbox(currentPhotoIndex + 1);
  }

  function prevPhoto() {
    openLightbox(currentPhotoIndex - 1);
  }

  // Attach triggers to gallery polaroids
  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.card-heart-btn')) return; // Ignore if clicked like button
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  // Attach triggers to memory wall tiles
  document.querySelectorAll('.memory-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const idx = parseInt(tile.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextPhoto);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevPhoto);

  if (lightboxHeartBtn) {
    lightboxHeartBtn.addEventListener('click', () => {
      fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
      lightboxHeartCount.textContent = 'Loved! ❤️';
      setTimeout(() => {
        lightboxHeartCount.textContent = 'Love';
      }, 2000);
    });
  }

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', e => {
    if (!photoLightbox || !photoLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // Heart buttons on cards
  document.querySelectorAll('.card-heart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const countSpan = btn.querySelector('.like-count');
      if (countSpan) {
        let count = parseInt(countSpan.textContent || '0', 10);
        countSpan.textContent = count + 1;
      }
      btn.style.transform = 'scale(1.25)';
      setTimeout(() => (btn.style.transform = ''), 300);
      playChimeEffect();
    });
  });

  // =========================================================================
  // 10. SECRET SURPRISE MODAL
  // =========================================================================
  const openSecretBtn = document.getElementById('openSecretBtn');
  const secretModal = document.getElementById('secretModal');
  const secretModalBackdrop = document.getElementById('secretModalBackdrop');
  const closeSecretBtn = document.getElementById('closeSecretBtn');
  const closeSecretBtn2 = document.getElementById('closeSecretBtn2');

  function openSecretModal() {
    fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 90);
    if (secretModal) {
      secretModal.classList.add('active');
      secretModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSecretModal() {
    if (secretModal) {
      secretModal.classList.remove('active');
      secretModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openSecretBtn) openSecretBtn.addEventListener('click', openSecretModal);
  if (closeSecretBtn) closeSecretBtn.addEventListener('click', closeSecretModal);
  if (closeSecretBtn2) closeSecretBtn2.addEventListener('click', closeSecretModal);
  if (secretModalBackdrop) secretModalBackdrop.addEventListener('click', closeSecretModal);

  // =========================================================================
  // 11. GRAND FINAL SURPRISE CELEBRATION
  // =========================================================================
  const grandSurpriseBtn = document.getElementById('grandSurpriseBtn');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');
  const finishCelebrationBtn = document.getElementById('finishCelebrationBtn');
  const burstMoreConfettiBtn = document.getElementById('burstMoreConfettiBtn');

  function openGrandCelebration() {
    // Multi-stage fireworks and confetti
    fireConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4, 100);
    setTimeout(() => fireConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4, 100), 200);
    setTimeout(() => fireConfetti(window.innerWidth * 0.5, window.innerHeight * 0.3, 140), 400);

    if (celebrationOverlay) {
      celebrationOverlay.classList.add('active');
      celebrationOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeGrandCelebration() {
    if (celebrationOverlay) {
      celebrationOverlay.classList.remove('active');
      celebrationOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (grandSurpriseBtn) grandSurpriseBtn.addEventListener('click', openGrandCelebration);
  if (closeCelebrationBtn) closeCelebrationBtn.addEventListener('click', closeGrandCelebration);
  if (finishCelebrationBtn) finishCelebrationBtn.addEventListener('click', closeGrandCelebration);

  if (burstMoreConfettiBtn) {
    burstMoreConfettiBtn.addEventListener('click', () => {
      fireConfetti(window.innerWidth * 0.5, window.innerHeight * 0.4, 150);
    });
  }
});
