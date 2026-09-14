// Enable JS active styling
document.body.classList.add('js-active');

// ================================================================
//  LANGUAGE SYSTEM — English default, toggle to Thai
// ================================================================
let currentLang = 'en';

function setLanguage(lang) {
  try {
    currentLang = lang;
    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'en' ? 'TH' : 'EN';

    document.querySelectorAll('[data-en]').forEach(el => {
      const val = el.getAttribute(`data-${lang}`);
      // Do NOT trim: some headings are split across two <span> tags where the
      // first one intentionally ends with a trailing space (e.g. "Who am " + "I?").
      // Trimming collapses that gap into "Who amI?".
      if (val !== null) el.textContent = val;
    });

    if (window.updateNavIndicator) {
      requestAnimationFrame(() => window.updateNavIndicator(null, false));
    }
  } catch (e) {
    console.error('Language error:', e);
  }
}

const langBtn = document.getElementById('langToggle');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'th' : 'en';
    setLanguage(next);
  });
}

// Initialize English
setLanguage('en');

// ================================================================
//  THEME SYSTEM — moon/dark default, switch to sun/light
// ================================================================
const themeSwitch = document.getElementById('themeSwitch');
let currentTheme = 'dark';

function setTheme(theme) {
  currentTheme = theme === 'light' ? 'light' : 'dark';
  const isLight = currentTheme === 'light';
  document.body.classList.toggle('theme-light', isLight);

  if (themeSwitch) {
    themeSwitch.classList.toggle('is-light', isLight);
    themeSwitch.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  }
}

if (themeSwitch) {
  setTheme('dark');
  themeSwitch.addEventListener('click', (e) => {
    e.stopPropagation();
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// ================================================================
//  SKILL ICON CLICK — globe slides left, an info panel opens on the right
//  (stacks below the globe instead, on small/mobile screens)
// ================================================================
(function () {
  const globeCard = document.getElementById('globeCard');
  if (!globeCard) return;
  const panelIcon = document.getElementById('skillPanelIcon');
  const panelName = document.getElementById('skillPanelName');
  const panelDesc = document.getElementById('skillPanelDesc');
  const panelClose = document.getElementById('skillPanelClose');

  let activeIcon = null;

  function openSkill(icon) {
    const name = icon.getAttribute('data-skill') || icon.getAttribute('title') || '';
    const descAttr = currentLang === 'th' ? 'data-desc-th' : 'data-desc-en';
    const desc = icon.getAttribute(descAttr) || '';

    panelIcon.innerHTML = icon.innerHTML;
    panelName.textContent = name;
    panelDesc.textContent = desc;
    globeCard.classList.add('skill-active');
    activeIcon = icon;
  }

  function closeSkill() {
    globeCard.classList.remove('skill-active');
    activeIcon = null;
  }

  document.querySelectorAll('.orbit-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      if (activeIcon === icon) {
        closeSkill();
      } else {
        openSkill(icon);
      }
    });
  });

  if (panelClose) panelClose.addEventListener('click', closeSkill);
})();

// ================================================================
//  PROJECT DETAILS MODAL — 50/50 preview + description, ~70% viewport
// ================================================================
(function () {
  const overlay = document.getElementById('projectModalOverlay');
  if (!overlay) return;
  const title = document.getElementById('projectModalTitle');
  const desc = document.getElementById('projectModalDesc');
  const tags = document.getElementById('projectModalTags');
  const closeBtn = document.getElementById('projectModalClose');

  function openModal(card) {
    const h3 = card.querySelector('h3');
    const viewBtn = card.querySelector('.project-view');
    const tagList = card.querySelector('.tag-list');
    const descAttr = currentLang === 'th' ? 'data-full-th' : 'data-full-en';

    title.textContent = h3 ? h3.textContent : '';
    desc.textContent = viewBtn ? (viewBtn.getAttribute(descAttr) || '') : '';
    tags.innerHTML = tagList ? tagList.innerHTML : '';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();

// ================================================================
//  SETTINGS DROPDOWN
// ================================================================
const settingsBtn = document.getElementById('settingsBtn');
const settingsDropdown = document.getElementById('settingsDropdown');
const settingsWrapper = document.getElementById('settingsWrapper');

if (settingsBtn && settingsDropdown) {
  function openSettings() {
    settingsDropdown.hidden = false;
    settingsBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      settingsDropdown.classList.add('is-open');
    });
  }

  function closeSettings() {
    settingsDropdown.classList.remove('is-open');
    settingsBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      if (!settingsDropdown.classList.contains('is-open')) {
        settingsDropdown.hidden = true;
      }
    }, 240);
  }

  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = settingsDropdown.classList.contains('is-open');
    if (isOpen) {
      closeSettings();
    } else {
      openSettings();
    }
  });

  settingsDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (settingsDropdown.classList.contains('is-open')) {
      if (settingsWrapper && !settingsWrapper.contains(e.target)) {
        closeSettings();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsDropdown.classList.contains('is-open')) {
      closeSettings();
      settingsBtn.focus();
    }
  });
}

// ================================================================
//  PARTICLE SYSTEM — subtle white dots + connections
// ================================================================
try {
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX, mouseY;
    const COUNT = 38;
    const LINK_DIST = 110;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouseX = e.x; mouseY = e.y; });

    class Dot {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.2 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.4 + 0.08;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        if (mouseX !== undefined) {
          const dx = this.x - mouseX, dy = this.y - mouseY;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) { this.x += dx * 0.008; this.y += dy * 0.008; }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        const isLight = document.body.classList.contains('theme-light');
        ctx.fillStyle = isLight
          ? `rgba(30, 45, 75, ${this.alpha * 0.7})`
          : `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Dot());

    function drawLinks() {
      const isLight = document.body.classList.contains('theme-light');
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const a = (1 - d / LINK_DIST) * 0.08;
            ctx.strokeStyle = isLight
              ? `rgba(30, 45, 75, ${a * 0.7})`
              : `rgba(255, 255, 255, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    let particleVisible = true;
    if ('IntersectionObserver' in window) {
      const pObs = new IntersectionObserver(entries => {
        particleVisible = entries[0].isIntersecting;
      });
      pObs.observe(canvas);
    }

    function loopParticles() {
      if (particleVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLinks();
      }
      requestAnimationFrame(loopParticles);
    }
    loopParticles();
  }
} catch (e) {
  console.error('Particle error:', e);
}

// ================================================================
//  NAVBAR SCROLL
// ================================================================
const navbar = document.getElementById('navbar');
if (navbar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ================================================================
//  MOBILE NAV
// ================================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
    if (navLinks.classList.contains('mobile-open') && window.updateNavIndicator) {
      requestAnimationFrame(() => window.updateNavIndicator(null, true));
    }
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });
}

// ================================================================
//  INTERNAL LINKS — smooth scroll without showing #hash in the URL
// ================================================================
function cleanHashFromUrl() {
  if (window.location.hash && window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

function scrollToSection(target) {
  const navOffset = navbar ? navbar.offsetHeight + 28 : 72;
  const top = target.id === 'hero'
    ? 0
    : Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset);

  window.scrollTo({ top, behavior: 'smooth' });
  cleanHashFromUrl();
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    scrollToSection(target);

    if (navToggle && navLinks) {
      navToggle.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    }
  });
});

cleanHashFromUrl();

// ================================================================
//  SUPPORTERS MODAL — pops up like the project-details modal
// ================================================================
const supporterToggle = document.getElementById('supporterToggle');
const supporterModalOverlay = document.getElementById('supporterModalOverlay');
const supporterModalClose = document.getElementById('supporterModalClose');

if (supporterToggle && supporterModalOverlay) {
  function openSupporterModal() {
    supporterModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSupporterModal() {
    supporterModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  supporterToggle.addEventListener('click', openSupporterModal);

  if (supporterModalClose) supporterModalClose.addEventListener('click', closeSupporterModal);

  supporterModalOverlay.addEventListener('click', (e) => {
    if (e.target === supporterModalOverlay) closeSupporterModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && supporterModalOverlay.classList.contains('open')) closeSupporterModal();
  });
}

// ================================================================
//  RESILIENT SLIDING NAV INDICATOR ("ความ resilient หนุ่มๆ เลื่อนไปมา")
// ================================================================
(function initNavIndicator() {
  const navLinksContainer = document.getElementById('navLinks');
  const indicator = document.getElementById('navIndicator');
  if (!navLinksContainer || !indicator) return;

  const links = Array.from(navLinksContainer.querySelectorAll('.nav-link'));
  let currentTarget = navLinksContainer.querySelector('.nav-link.active') || links[0];
  let isHovering = false;

  function moveIndicator(target, immediate = false) {
    if (!target) return;
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = target.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const top = linkRect.top - containerRect.top;
    const width = linkRect.width;
    const height = linkRect.height;

    if (immediate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = '';
    }

    indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    indicator.style.width = `${width}px`;
    indicator.style.height = `${height}px`;
    indicator.style.opacity = '1';

    if (immediate) {
      void indicator.offsetHeight;
      indicator.style.transition = '';
    }
  }

  // Hover transitions
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      isHovering = true;
      moveIndicator(link);
    });

    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentTarget = link;
      moveIndicator(link);
    });
  });

  navLinksContainer.addEventListener('mouseleave', () => {
    isHovering = false;
    const active = navLinksContainer.querySelector('.nav-link.active') || links[0];
    moveIndicator(active);
  });

  // Expose helper to update from scroll or language switch
  window.updateNavIndicator = function(newActiveLink, immediate = false) {
    if (newActiveLink) {
      currentTarget = newActiveLink;
    }
    if (!isHovering) {
      const active = newActiveLink || navLinksContainer.querySelector('.nav-link.active') || links[0];
      moveIndicator(active, immediate);
    }
  };

  // Nav indicator style switch: Pill vs Line
  const navStyleSwitch = document.getElementById('navStyleSwitch');
  const styleBtns = navStyleSwitch ? navStyleSwitch.querySelectorAll('.nav-style-btn') : [];

  function setIndicatorStyle(style) {
    const isLine = style === 'line';
    indicator.classList.toggle('nav-indicator-line', isLine);
    indicator.classList.toggle('nav-indicator-pill', !isLine);

    styleBtns.forEach(btn => {
      const active = btn.getAttribute('data-style') === style;
      btn.classList.toggle('active', active);
    });

    try {
      localStorage.setItem('0ii-nav-style', style);
    } catch(e) {}

    const active = navLinksContainer.querySelector('.nav-link.active') || links[0];
    moveIndicator(active, true);
  }

  styleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chosen = btn.getAttribute('data-style');
      setIndicatorStyle(chosen);
    });
  });

  let savedStyle = 'pill';
  try {
    savedStyle = localStorage.getItem('0ii-nav-style') || 'pill';
  } catch(e) {}
  setIndicatorStyle(savedStyle);

  window.addEventListener('resize', () => moveIndicator(currentTarget, true));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moveIndicator(currentTarget, true));
  }
  requestAnimationFrame(() => moveIndicator(currentTarget, true));
})();

// ================================================================
//  ACTIVE NAV TRACKING
// ================================================================
const sectionEls = document.querySelectorAll('section[id]');
let currentActiveSectionId = '';

function activeNav() {
  const y = window.scrollY + 120;
  sectionEls.forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
    const lnk = document.querySelector(`.nav-link[href="#${id}"]`);
    if (lnk) {
      if (y >= top && y < top + h) {
        if (currentActiveSectionId !== id) {
          currentActiveSectionId = id;
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          lnk.classList.add('active');
          if (window.updateNavIndicator) {
            window.updateNavIndicator(lnk);
          }
        }
      }
    }
  });
}
window.addEventListener('scroll', activeNav, { passive: true });

// ================================================================
//  TYPEWRITER
// ================================================================
try {
  const typedEl = document.getElementById('typewriter');
  if (typedEl) {
    const phrases = ['learner - Pentester', 'Cyber Security student', 'still learning'];
    let pI = 0, cI = 0, deleting = false, speed = 250;

    function type() {
      const word = phrases[pI];
      if (deleting) {
        typedEl.textContent = word.substring(0, cI - 1);
        cI--;
        speed = 45;
      } else {
        typedEl.textContent = word.substring(0, cI + 1);
        cI++;
        speed = 110;
      }
      if (!deleting && cI === word.length) { speed = 2200; deleting = true; }
      else if (deleting && cI === 0) { deleting = false; pI = (pI + 1) % phrases.length; speed = 350; }
      setTimeout(type, speed);
    }
    setTimeout(type, 500);
  }
} catch (e) {
  console.error('Typewriter error:', e);
}

// ================================================================
//  MUSIC PLAYER
// ================================================================
const playIconD = "M8 5v14l11-7z";
const pauseIconD = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

document.querySelectorAll('audio').forEach(a => { a.volume = 0.5; });

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function setPlaying(audioId, playing) {
  const card = document.getElementById('card-' + audioId);
  if (!card) return;
  if (playing) {
    card.classList.add('is-playing');
  } else {
    card.classList.remove('is-playing');
  }
}

function toggleMusic(audioId, btnEl) {
  const audio = document.getElementById(audioId);
  if (!audio) return;
  const iconPath = btnEl ? btnEl.querySelector('.icon-path') : null;

  document.querySelectorAll('.gallery-item.is-playing').forEach(card => {
    const otherId = card.id.replace('card-', '');
    if (otherId === audioId) return;
    const otherAudio = document.getElementById(otherId);
    if (otherAudio && !otherAudio.paused) otherAudio.pause();
    setPlaying(otherId, false);
    const otherIcon = card.querySelector('.icon-path');
    if (otherIcon) otherIcon.setAttribute('d', playIconD);
    const otherProgress = document.getElementById('progress-' + otherId);
    if (otherProgress) otherProgress.style.width = '0%';
    const otherTime = document.getElementById('time-' + otherId);
    if (otherTime) otherTime.textContent = '0:00 / 0:00';
  });

  if (audio.paused) {
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        if (iconPath) iconPath.setAttribute('d', pauseIconD);
        setPlaying(audioId, true);
      }).catch(() => {
        if (iconPath) iconPath.setAttribute('d', pauseIconD);
        setPlaying(audioId, true);
        simulateProgress(audioId);
      });
    }
  } else {
    audio.pause();
    if (iconPath) iconPath.setAttribute('d', playIconD);
    setPlaying(audioId, false);
  }
}

document.querySelectorAll('audio').forEach(audio => {
  const progressEl = document.getElementById('progress-' + audio.id);
  const timeEl = document.getElementById('time-' + audio.id);

  function showInitialDuration() {
    if (timeEl && audio.duration) {
      timeEl.textContent = '0:00 / ' + fmtTime(audio.duration);
    }
  }

  audio.addEventListener('loadedmetadata', showInitialDuration);
  // preload="metadata" can finish loading before this script (placed at the end
  // of <body>) even runs, so the 'loadedmetadata' event may already have fired
  // and been missed. Catch that case by checking readyState directly.
  if (audio.readyState >= 1 /* HAVE_METADATA */) {
    showInitialDuration();
  }

  let isScrubbing = false;

  audio.addEventListener('timeupdate', () => {
    if (!isScrubbing) {
      if (audio.duration && progressEl) {
        progressEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
      }
      if (timeEl) {
        timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
      }
    }
  });

  audio.addEventListener('ended', () => {
    const icon = document.querySelector('#card-' + audio.id + ' .icon-path');
    if (icon) icon.setAttribute('d', playIconD);
    setPlaying(audio.id, false);
    if (progressEl) progressEl.style.width = '0%';
    if (timeEl) timeEl.textContent = '0:00 / ' + fmtTime(audio.duration);
  });

  if (audio.parentElement) {
    const container = audio.parentElement.querySelector('.m-progress-container');
    if (container) {
      function seek(e) {
        if (!audio.duration || isNaN(audio.duration)) return;
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        if (progressEl) progressEl.style.width = (pct * 100) + '%';
        if (timeEl) timeEl.textContent = fmtTime(pct * audio.duration) + ' / ' + fmtTime(audio.duration);
        audio.currentTime = pct * audio.duration;
      }

      container.addEventListener('pointerdown', (e) => {
        if (!audio.duration || isNaN(audio.duration)) return;
        isScrubbing = true;
        container.classList.add('is-dragging');
        try { container.setPointerCapture(e.pointerId); } catch (_) {}
        seek(e);
      });

      container.addEventListener('pointermove', (e) => {
        if (!isScrubbing) return;
        seek(e);
      });

      const endScrub = (e) => {
        if (!isScrubbing) return;
        isScrubbing = false;
        container.classList.remove('is-dragging');
        try { container.releasePointerCapture(e.pointerId); } catch (_) {}
      };

      container.addEventListener('pointerup', endScrub);
      container.addEventListener('pointercancel', endScrub);
    }
  }
});

function setVol(audioId, val) {
  const v = parseFloat(val);
  const audio = document.getElementById(audioId);
  if (audio) audio.volume = v;

  const iconEl = document.getElementById('volicon-' + audioId);
  if (!iconEl) return;

  const poly = '<polygon points="10 5 5 9 1 9 1 15 5 15 10 19 10 5"></polygon>';
  if (v === 0) {
    iconEl.innerHTML = poly + '<line x1="21" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="21" y2="15"></line>';
  } else if (v <= 0.33) {
    iconEl.innerHTML = poly + '<path d="M14 9a3 3 0 0 1 0 6"></path>';
  } else if (v <= 0.66) {
    iconEl.innerHTML = poly + '<path d="M14 9a3 3 0 0 1 0 6"></path><path d="M17 7a6 6 0 0 1 0 10"></path>';
  } else {
    iconEl.innerHTML = poly + '<path d="M14 9a3 3 0 0 1 0 6"></path><path d="M17 7a6 6 0 0 1 0 10"></path><path d="M20 5a9 9 0 0 1 0 14"></path>';
  }
}

function simulateProgress(audioId) {
  const audio = document.getElementById(audioId);
  let p = 0;
  const progressEl = document.getElementById('progress-' + audioId);
  const timeEl = document.getElementById('time-' + audioId);

  const intv = setInterval(() => {
    const card = document.getElementById('card-' + audioId);
    if (!card || !card.classList.contains('is-playing')) {
      clearInterval(intv);
      return;
    }
    p += 0.5;
    if (p > 100) p = 0;
    if (progressEl) progressEl.style.width = p + '%';
    if (timeEl) timeEl.textContent = fmtTime(p * 2.1) + ' / 3:30';
  }, 100);
}

// ================================================================
//  SCROLL REVEAL (Safe observer + immediate trigger)
// ================================================================
function revealAll() {
  document.querySelectorAll('.reveal, .reveal-card').forEach(el => el.classList.add('visible'));
}

if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.05, rootMargin: '50px' });

  document.querySelectorAll('.reveal, .reveal-card').forEach(el => revealObs.observe(el));
} else {
  revealAll();
}

// Fallback safety trigger
setTimeout(revealAll, 600);

// ================================================================
//  COUNTING ANIMATION
// ================================================================
if ('IntersectionObserver' in window) {
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';

        // Special dedication stat → count up then ∞
        if (e.target.dataset.dedication) {
          runDedicationAnimation(e.target);
          return;
        }

        const t = +e.target.dataset.count;
        const start = performance.now();
        const dur = 1400;
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(ease * t);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.stat-num').forEach(el => cntObs.observe(el));
}

// Dedication: count up → glass crack → inf
function runDedicationAnimation(numEl) {
  const suffix = document.getElementById('dedication-suffix');
  const infEl = document.getElementById('dedication-inf');
  const crackEl = document.getElementById('glass-crack');
  const statEl = document.getElementById('dedication-stat');
  const flashOverlay = document.getElementById('inf-flash-overlay');

  const start = performance.now();
  const dur = 2400; // count-up duration

  (function tick(now) {
    const elapsed = now - start;
    const p = Math.min(elapsed / dur, 1);
    // Accelerating ease — starts slow, speeds up dramatically
    const ease = p * p * p * p;
    const val = Math.round(ease * 999);
    numEl.textContent = val;

    // Accelerating color shift toward red as it climbs
    if (p > 0.5) {
      const redP = (p - 0.5) / 0.5;
      const g = Math.round(255 * (1 - redP * 0.9));
      const b = Math.round(255 * (1 - redP * 0.9));
      numEl.style.color = `rgb(255,${g},${b})`;
      if (suffix) suffix.style.color = `rgb(255,${g},${b})`;
    }

    // Tremble effect near the end
    if (p > 0.8) {
      const intensity = ((p - 0.8) / 0.2) * 3;
      const tx = (Math.random() - 0.5) * intensity;
      const ty = (Math.random() - 0.5) * intensity;
      numEl.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      numEl.style.transform = '';
      triggerInfinity(numEl, suffix, infEl, crackEl, statEl, flashOverlay);
    }
  })(start);
}

function triggerInfinity(numEl, suffix, infEl, crackEl, statEl, flashOverlay) {
  // 1. Dark flash overlay
  if (flashOverlay) {
    flashOverlay.classList.add('active');
    setTimeout(() => flashOverlay.classList.remove('active'), 500);
  }

  // 2. Generate crack lines
  generateCracks(crackEl);

  // 3. Shake
  statEl.classList.add('shake');
  setTimeout(() => statEl.classList.remove('shake'), 400);

  // 4. Spawn shards & ring
  spawnShards(statEl);
  spawnRing(statEl);

  // 5. Activate crack container (flashes and fades out in CSS)
  crackEl.classList.add('active');

  // Clean up crack lines after fade out
  setTimeout(() => {
    crackEl.innerHTML = '';
    crackEl.classList.remove('active');
  }, 600);

  // 6. Fade out number + suffix, show inf cleanly
  numEl.style.opacity = '0';
  if (suffix) suffix.style.opacity = '0';

  setTimeout(() => {
    infEl.classList.add('active');
  }, 100);
}

function generateCracks(container) {
  container.innerHTML = ''; // Ensure clean slate
  const cx = container.offsetWidth / 2;
  const cy = container.offsetHeight / 2;
  const count = 8 + Math.floor(Math.random() * 3);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
    const len = 10 + Math.random() * 18; // Shorter length to avoid bleeding into DEDICATION text
    const thick = 0.5 + Math.random() * 0.8;

    const line = document.createElement('div');
    line.className = 'crack-line';
    line.style.width = len + 'px';
    line.style.height = thick + 'px';
    line.style.left = cx + 'px';
    line.style.top = cy + 'px';
    line.style.transform = `rotate(${angle}rad)`;
    container.appendChild(line);

    if (Math.random() > 0.4) {
      const bAngle = angle + (Math.random() - 0.5) * 1.2;
      const bLen = 5 + Math.random() * 10;
      const branch = document.createElement('div');
      branch.className = 'crack-line';
      branch.style.width = bLen + 'px';
      branch.style.height = (thick * 0.6) + 'px';
      branch.style.left = (cx + Math.cos(angle) * len * 0.6) + 'px';
      branch.style.top = (cy + Math.sin(angle) * len * 0.6) + 'px';
      branch.style.transform = `rotate(${bAngle}rad)`;
      branch.style.opacity = '0.7';
      container.appendChild(branch);
    }
  }
}

function spawnShards(parentEl) {
  const wrap = parentEl.querySelector('.stat-value-wrap');
  const count = 10;
  for (let i = 0; i < count; i++) {
    const shard = document.createElement('div');
    shard.className = 'glass-shard';
    shard.style.left = '50%';
    shard.style.top = '50%';
    shard.style.position = 'absolute';
    wrap.appendChild(shard);

    const angle = Math.random() * Math.PI * 2;
    const dist = 25 + Math.random() * 50;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const rot = Math.random() * 540;
    const size = 3 + Math.random() * 6;
    shard.style.width = size + 'px';
    shard.style.height = size + 'px';

    shard.animate([
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.9 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2) rotate(${rot}deg)`, opacity: 0 }
    ], {
      duration: 600 + Math.random() * 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    });

    setTimeout(() => shard.remove(), 1100);
  }
}

function spawnRing(parentEl) {
  const wrap = parentEl.querySelector('.stat-value-wrap');
  const ring = document.createElement('div');
  ring.className = 'inf-ring';
  wrap.appendChild(ring);
  // Trigger in next frame
  requestAnimationFrame(() => ring.classList.add('active'));
  setTimeout(() => ring.remove(), 800);
}

// ================================================================
// ================================================================
//  3D GLOBE (Minimalist & Compact)
// ================================================================
(function() {
  try {
    const gc = document.getElementById('globeCanvas');
    if (!gc) return;
    const gctx = gc.getContext('2d');
    const isMobile = window.innerWidth < 680;
    const CSS_SIZE = isMobile ? 155 : 255;
    const dpr = window.devicePixelRatio || 1;
    gc.width = CSS_SIZE * dpr;
    gc.height = CSS_SIZE * dpr;
    gc.style.width = `${CSS_SIZE}px`;
    gc.style.height = `${CSS_SIZE}px`;
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const SIZE = CSS_SIZE;
    const R = isMobile ? 68 : 112;
    const cx = SIZE / 2, cy = SIZE / 2;
    const tiltX = 0.28;
    const cosT = Math.cos(tiltX);
    const sinT = Math.sin(tiltX);
    const TAU = Math.PI * 2;
    const DEG = 180 / Math.PI;
    let angle = 0;

    const landMasses = [
      [[-168, 72], [-142, 70], [-126, 58], [-130, 49], [-121, 37], [-105, 23], [-91, 18], [-81, 25], [-78, 34], [-65, 46], [-58, 55], [-84, 70], [-120, 76]],
      [[-81, 12], [-69, 9], [-54, 3], [-36, -8], [-45, -25], [-55, -38], [-67, -55], [-74, -39], [-79, -16]],
      [[-74, 59], [-50, 59], [-20, 69], [-25, 82], [-54, 84]],
      [[-10, 36], [2, 44], [22, 45], [33, 56], [57, 55], [73, 70], [108, 72], [144, 61], [160, 50], [140, 39], [121, 34], [106, 20], [91, 10], [74, 20], [58, 25], [44, 31], [32, 39], [20, 35], [8, 36]],
      [[-17, 35], [10, 37], [35, 30], [50, 11], [42, -16], [30, -35], [12, -35], [-5, -20], [-15, 5]],
      [[112, -10], [154, -12], [153, -38], [130, -44], [113, -33]],
      [[95, 21], [108, 20], [121, 9], [132, -7], [115, -9], [103, 3]]
    ];

    function pointInLandMass(lon, lat, polygon) {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        const crossesLatitude = (yi > lat) !== (yj > lat);
        const edgeLongitude = ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
        if (crossesLatitude && lon < edgeLongitude) inside = !inside;
      }
      return inside;
    }

    function isLand(lat, lon) {
      return landMasses.some(polygon => pointInLandMass(lon, lat, polygon));
    }

    const dots = [];
    const dotCount = isMobile ? 320 : 540;
    for (let i = 0; i < dotCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const cosTheta = Math.cos(theta);
      const phi = Math.random() * TAU;
      const lat = 90 - Math.acos(cosTheta) * DEG + (Math.random() - 0.5) * 8;
      let lon = phi * DEG;
      if (lon > 180) lon -= 360;
      lon += (Math.random() - 0.5) * 8;

      dots.push({
        sinTheta: Math.sin(theta),
        cosTheta,
        phi,
        onLand: isLand(lat, lon),
        sizeOffset: Math.random(),
        blinkOffset: Math.random() * TAU
      });
    }

    let globeVisible = true;
    if ('IntersectionObserver' in window) {
      const gObs = new IntersectionObserver(entries => {
        globeVisible = entries[0].isIntersecting;
      });
      gObs.observe(gc);
    }

    function drawGlobe() {
      if (globeVisible) {
        gctx.clearRect(0, 0, SIZE, SIZE);
        angle += 0.0035;
        const isLight = document.body.classList.contains('theme-light');

        // Clean Minimal Sphere
        gctx.save();
        gctx.beginPath();
        gctx.arc(cx, cy, R, 0, TAU);
        gctx.clip();

        // Subtle gradient inside globe
        const sphere = gctx.createRadialGradient(
          cx - R * 0.35,
          cy - R * 0.38,
          R * 0.08,
          cx,
          cy,
          R * 1.05
        );
        if (isLight) {
          sphere.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          sphere.addColorStop(0.5, 'rgba(240, 244, 252, 0.85)');
          sphere.addColorStop(1, 'rgba(220, 230, 244, 0.7)');
        } else {
          sphere.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
          sphere.addColorStop(0.4, 'rgba(20, 28, 42, 0.6)');
          sphere.addColorStop(1, 'rgba(6, 9, 15, 0.75)');
        }
        gctx.fillStyle = sphere;
        gctx.fillRect(cx - R, cy - R, R * 2, R * 2);

        // Minimal grid lines
        gctx.strokeStyle = isLight ? 'rgba(50, 70, 100, 0.09)' : 'rgba(255, 255, 255, 0.06)';
        gctx.lineWidth = 0.55;

        for (let latitude = -60; latitude <= 60; latitude += 30) {
          const latitudeRad = latitude / DEG;
          const y = Math.sin(latitudeRad) * R;
          const latitudeRadius = Math.cos(latitudeRad) * R;
          gctx.beginPath();
          gctx.ellipse(cx, cy + y, latitudeRadius, latitudeRadius * 0.12, -0.08, 0, TAU);
          gctx.stroke();
        }

        for (const longitudeWidth of [0.35, 0.7]) {
          gctx.beginPath();
          gctx.ellipse(cx, cy, R * longitudeWidth, R, -0.08, 0, TAU);
          gctx.stroke();
        }
        gctx.restore();

        // Minimal Outer Boundary Ring
        gctx.beginPath();
        gctx.arc(cx, cy, R, 0, TAU);
        gctx.strokeStyle = isLight ? 'rgba(90, 115, 155, 0.22)' : 'rgba(255, 255, 255, 0.18)';
        gctx.lineWidth = 1;
        gctx.stroke();

        // Rotating Landmass Dots
        for (const dot of dots) {
          let x = R * dot.sinTheta * Math.cos(dot.phi + angle);
          let y = R * dot.cosTheta;
          let z = R * dot.sinTheta * Math.sin(dot.phi + angle);

          const y2 = y * cosT - z * sinT;
          const z2 = y * sinT + z * cosT;
          y = y2; z = z2;

          if (z < 0) continue;

          const depth = (z + R) / (2 * R);
          const blink = Math.sin(angle * 18 + dot.blinkOffset) * 0.5 + 0.5;

          if (dot.onLand) {
            const alpha = isLight
              ? (0.4 + depth * 0.55) * (0.8 + blink * 0.2)
              : (0.35 + depth * 0.6) * (0.8 + blink * 0.2);
            gctx.fillStyle = isLight
              ? `rgba(20, 32, 52, ${alpha})`
              : `rgba(255, 255, 255, ${alpha})`;
            gctx.beginPath();
            gctx.arc(cx + x, cy - y, 0.6 + dot.sizeOffset * 0.8, 0, TAU);
            gctx.fill();
          } else if (dot.sizeOffset > 0.95) {
            gctx.fillStyle = isLight
              ? `rgba(50, 75, 110, ${0.06 + depth * 0.08})`
              : `rgba(255, 255, 255, ${0.08 + depth * 0.12})`;
            gctx.beginPath();
            gctx.arc(cx + x, cy - y, 0.4, 0, TAU);
            gctx.fill();
          }
        }
      }
      requestAnimationFrame(drawGlobe);
    }

    drawGlobe();
  } catch (e) {
    console.error('Globe error:', e);
  }
})();

// ================================================================
//  ORBIT ICONS & DETACHED SKILL CARD
// ================================================================
(function initSkillOrbit() {
  const icons = document.querySelectorAll('.orbit-icon');
  const card = document.getElementById('skillDetailCard');
  const wrap = document.getElementById('globeInteractiveWrap');
  const closeBtn = document.getElementById('skillPanelClose');
  const iconTarget = document.getElementById('skillPanelIcon');
  const nameTarget = document.getElementById('skillPanelName');
  const descTarget = document.getElementById('skillPanelDesc');

  if (!icons.length || !card) return;

  function selectSkill(btn) {
    const isAlreadyActive = btn.classList.contains('is-active');
    if (isAlreadyActive && card.classList.contains('is-active')) {
      closeSkill();
      return;
    }

    icons.forEach(i => i.classList.remove('is-active'));
    btn.classList.add('is-active');

    const skillName = btn.dataset.skill || '';
    const descEn = btn.dataset.descEn || '';
    const descTh = btn.dataset.descTh || '';
    const svgContent = btn.querySelector('svg') ? btn.querySelector('svg').outerHTML : '';

    if (nameTarget) nameTarget.textContent = skillName;
    if (descTarget) {
      descTarget.setAttribute('data-en', descEn);
      descTarget.setAttribute('data-th', descTh);
      descTarget.textContent = currentLang === 'th' ? descTh : descEn;
    }
    if (iconTarget) iconTarget.innerHTML = svgContent;

    card.classList.add('is-active');
    card.setAttribute('aria-hidden', 'false');
    if (wrap) wrap.classList.add('has-skill-active');
  }

  function closeSkill() {
    icons.forEach(i => i.classList.remove('is-active'));
    card.classList.remove('is-active');
    card.setAttribute('aria-hidden', 'true');
    if (wrap) wrap.classList.remove('has-skill-active');
  }

  icons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      selectSkill(icon);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSkill();
    });
  }

  document.addEventListener('click', (e) => {
    if (card.classList.contains('is-active') && !card.contains(e.target) && !e.target.closest('.orbit-icon')) {
      closeSkill();
    }
  });
})();
