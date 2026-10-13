/**
 * BUMI LESTARI - Interactive Logic & Modern Animations
 * Mendukung scroll progress, scroll spy, animasi hitung mundur (count-up),
 * checklist interaktif tersimpan (localStorage), filter tab, generator ikrar komitmen,
 * serta mode gelap/terang.
 */

(function () {
  'use strict';

  // 1. Reading Scroll Progress Bar
  const progressBar = document.getElementById('scrollProgressBar');
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // 2. Sticky Header State & Shadow on Scroll
  const header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenuWrapper = document.getElementById('navMenuWrapper');
  if (menuToggle && header) {
    menuToggle.addEventListener('click', function () {
      const isOpen = header.getAttribute('data-mobile-open') === 'true';
      header.setAttribute('data-mobile-open', !isOpen);
      menuToggle.setAttribute('aria-expanded', !isOpen);
      menuToggle.setAttribute('aria-label', !isOpen ? 'Tutup navigasi' : 'Buka navigasi');
    });

    // Close mobile menu when clicking any nav link
    const mobileLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        header.setAttribute('data-mobile-open', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. ScrollSpy: Highlight active section in navigation & Floating Dots
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollDots = document.querySelectorAll('.scroll-dot');
  let currentActiveSectionId = 'beranda';

  function highlightNavOnScroll() {
    const scrollY = window.scrollY + 140;
    sections.forEach(function (current) {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = sectionId;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });

        scrollDots.forEach(function (dot) {
          if (dot.getAttribute('data-section') === sectionId) {
            dot.classList.add('is-active');
          } else {
            dot.classList.remove('is-active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // 5. Theme Toggle (Light / Dark Theme)
  const themeToggle = document.getElementById('themeToggle');
  const themeStorageKey = 'bumi-lestari-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (e) {}
    if (themeToggle) {
      const sunIcon = themeToggle.querySelector('.icon-sun');
      const moonIcon = themeToggle.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
    }
  }

  // Detect saved theme or system preference
  let initialTheme = 'light';
  try {
    const saved = localStorage.getItem(themeStorageKey);
    if (saved) {
      initialTheme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }
  } catch (e) {}
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  // 7. Interactive Animated Counters in Fakta & Data
  const factsSection = document.getElementById('fakta');
  let factsCounted = false;

  function countUp(el, target, duration, isDecimal, suffix) {
    let start = 0;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = start;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (isDecimal) {
        el.textContent = current.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (suffix || '');
      } else {
        el.textContent = Math.floor(current).toLocaleString('id-ID') + (suffix || '');
      }
    }, stepTime);
  }

  if (factsSection && 'IntersectionObserver' in window) {
    const factsObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !factsCounted) {
          factsCounted = true;
          // Animate progress stack bars
          const managedBar = document.querySelector('.progress-segment.managed');
          const unmanagedBar = document.querySelector('.progress-segment.unmanaged');
          if (managedBar) managedBar.style.width = '59.74%';
          if (unmanagedBar) unmanagedBar.style.width = '40.26%';

          // Animate counters
          const countTimbulan = document.getElementById('countTimbulan');
          if (countTimbulan) countUp(countTimbulan, 34214607.36, 1600, true, '');

          const countManaged = document.getElementById('countManaged');
          if (countManaged) countUp(countManaged, 59.74, 1200, true, '%');

          const countUnmanaged = document.getElementById('countUnmanaged');
          if (countUnmanaged) countUp(countUnmanaged, 40.26, 1200, true, '%');
        }
      },
      { threshold: 0.25 }
    );
    factsObserver.observe(factsSection);
  }

  // 8. Interactive Checklist (LocalStorage, Progress, Filtering, Confetti)
  const CHECKLIST_STORAGE_KEY = 'bumi-lestari-checklist';
  const checkboxes = Array.from(document.querySelectorAll('.check-item-label input[type="checkbox"]'));
  const totalItems = checkboxes.length;

  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}') || {};
  } catch (e) {
    savedState = {};
  }

  checkboxes.forEach(function (box) {
    const key = box.getAttribute('data-k');
    if (key && savedState[key]) {
      box.checked = true;
    }
  });

  const progressCount = document.getElementById('checklistCount');
  const progressFill = document.getElementById('checklistFill');
  const progressMsg = document.getElementById('checklistMsg');
  const meterEl = document.getElementById('checklistMeter');

  function getMessage(completed) {
    if (completed === 0) return 'Mulai dari satu langkah kecil hari ini.';
    if (completed <= 3) return 'Awal yang hebat! Teruskan satu aksi lagi.';
    if (completed <= 7) return 'Kamu sudah separuh jalan menuju kebiasaan hijau.';
    if (completed < totalItems) return 'Luar biasa! Sedikit lagi semua aksi tuntas.';
    return '🎉 Hebat! Seluruh 12 kebiasaan hijau telah kamu kuasai. Wujudkan bumi lestari!';
  }

  function launchConfetti() {
    // Simple canvas confetti particle animation
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#2E6B3F', '#78A641', '#35B9D7', '#F4D35E', '#FFFFFF'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        r: Math.random() * 6 + 3,
        dx: (Math.random() - 0.5) * 12,
        dy: (Math.random() - 0.7) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.08 + 0.04,
        opacity: 1,
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillActive = false;

      particles.forEach(function (p) {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.25; // gravity
        p.tiltAngle += p.tiltAngleInc;
        p.tilt = Math.sin(p.tiltAngle) * 10;
        p.opacity -= 0.009;

        if (p.opacity > 0) {
          stillActive = true;
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (stillActive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    }
    render();
  }

  function updateChecklist() {
    const checkedCount = checkboxes.filter(function (b) { return b.checked; }).length;
    const percent = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    if (progressCount) progressCount.textContent = checkedCount + ' dari ' + totalItems;
    if (progressFill) progressFill.style.width = percent + '%';
    if (meterEl) meterEl.setAttribute('aria-valuenow', checkedCount);
    if (progressMsg) progressMsg.textContent = getMessage(checkedCount);

    const newState = {};
    checkboxes.forEach(function (b) {
      if (b.checked) newState[b.getAttribute('data-k')] = 1;
    });

    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {}

    if (checkedCount === totalItems) {
      launchConfetti();
    }
  }

  checkboxes.forEach(function (box) {
    box.addEventListener('change', updateChecklist);
  });

  const resetBtn = document.getElementById('resetChecklistBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (confirm('Apakah kamu yakin ingin mereset daftar kebiasaan hijau ini?')) {
        checkboxes.forEach(function (b) { b.checked = false; });
        updateChecklist();
      }
    });
  }

  // Checklist Filter Tabs (Semua, Di Rumah, Di Sekolah, Belum Selesai)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const checklistCards = document.querySelectorAll('.checklist-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');

      checklistCards.forEach(function (card) {
        const cardType = card.getAttribute('data-type');
        const items = card.querySelectorAll('.check-item-label');

        if (filter === 'all') {
          card.style.display = 'block';
          items.forEach(function (item) { item.style.display = 'flex'; });
        } else if (filter === 'pending') {
          card.style.display = 'block';
          let hasPending = false;
          items.forEach(function (item) {
            const chk = item.querySelector('input[type="checkbox"]');
            if (chk && !chk.checked) {
              item.style.display = 'flex';
              hasPending = true;
            } else {
              item.style.display = 'none';
            }
          });
          if (!hasPending) {
            card.style.display = 'none';
          }
        } else {
          // 'home' or 'school'
          if (cardType === filter) {
            card.style.display = 'block';
            items.forEach(function (item) { item.style.display = 'flex'; });
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  updateChecklist();

  // 9. Interactive Pledge Generator ("Masa Depan Bumi Dimulai Dari Kita")
  const pledgeForm = document.getElementById('pledgeForm');
  const pledgeNameInput = document.getElementById('pledgeName');
  const pledgeActionSelect = document.getElementById('pledgeAction');
  const pledgeResult = document.getElementById('pledgeResult');
  const pledgeCertificateName = document.getElementById('pledgeCertificateName');
  const pledgeCertificateAction = document.getElementById('pledgeCertificateAction');
  const pledgeCertificateDate = document.getElementById('pledgeCertificateDate');
  const pledgeCountDisplay = document.getElementById('pledgeCountDisplay');

  let totalPledges = 1428;
  try {
    const savedPledges = localStorage.getItem('bumi-lestari-pledges');
    if (savedPledges) totalPledges = parseInt(savedPledges, 10);
  } catch (e) {}
  if (pledgeCountDisplay) pledgeCountDisplay.textContent = totalPledges.toLocaleString('id-ID');

  if (pledgeForm) {
    pledgeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = pledgeNameInput.value.trim();
      const action = pledgeActionSelect.value;

      if (!name) {
        alert('Silakan tuliskan nama atau panggilan Anda.');
        pledgeNameInput.focus();
        return;
      }

      totalPledges += 1;
      try {
        localStorage.setItem('bumi-lestari-pledges', totalPledges);
      } catch (e) {}

      if (pledgeCountDisplay) pledgeCountDisplay.textContent = totalPledges.toLocaleString('id-ID');
      if (pledgeCertificateName) pledgeCertificateName.textContent = name;
      if (pledgeCertificateAction) pledgeCertificateAction.textContent = action;

      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      if (pledgeCertificateDate) {
        pledgeCertificateDate.textContent = now.toLocaleDateString('id-ID', options);
      }

      if (pledgeResult) {
        pledgeResult.style.display = 'block';
        pledgeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      launchConfetti();
    });
  }

  // 10. Smooth Back To Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // 11. Floating Dot Navigation Click Handler
  scrollDots.forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = dot.getAttribute('data-section');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================================================
  // 12. Fluid Parallax Motion Engine (Wix wh-1070 & Hitit Inspired)
  // ==========================================================================
  const parallaxLayers = Array.from(document.querySelectorAll('.parallax-img-layer'));
  const heroBadges = {
    topRight: document.querySelector('.badge-top-right'),
    bottomLeft: document.querySelector('.badge-bottom-left'),
  };
  const heroCard = document.querySelector('.hero-visual-card');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cache parent sections for high performance
  const layerData = parallaxLayers.map(function (layer) {
    const parentContainer = layer.closest('section') || layer.closest('.band-wrapper') || layer.parentElement;
    const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.2;
    return { layer: layer, container: parentContainer, speed: speed };
  });

  let currentScrollY = window.scrollY || window.pageYOffset;
  let targetScrollY = currentScrollY;
  let isParallaxRunning = true;

  function updateParallax() {
    if (prefersReducedMotion) return;

    // Smooth lerping for silky comfortable motion
    currentScrollY += (targetScrollY - currentScrollY) * 0.12;

    const windowH = window.innerHeight;

    layerData.forEach(function (item) {
      if (!item.container) return;
      const rect = item.container.getBoundingClientRect();

      // Only calculate if visible or nearby
      if (rect.bottom > -150 && rect.top < windowH + 150) {
        const centerY = rect.top + rect.height / 2;
        const distFromCenter = centerY - windowH / 2;
        const offsetY = -distFromCenter * item.speed;
        item.layer.style.transform = 'translate3d(0, ' + offsetY.toFixed(2) + 'px, 0)';
      }
    });

    // Multi-layer depth on hero components
    const heroSection = document.getElementById('beranda');
    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0 && heroRect.top < windowH) {
        const distFromCenter = (heroRect.top + heroRect.height / 2) - windowH / 2;
        if (heroBadges.topRight) {
          heroBadges.topRight.style.transform = 'translate3d(0, ' + (-distFromCenter * 0.08).toFixed(2) + 'px, 0)';
        }
        if (heroBadges.bottomLeft) {
          heroBadges.bottomLeft.style.transform = 'translate3d(0, ' + (distFromCenter * 0.07).toFixed(2) + 'px, 0)';
        }
        if (heroCard) {
          heroCard.style.transform = 'translate3d(0, ' + (-distFromCenter * 0.035).toFixed(2) + 'px, 0)';
        }
      }
    }

    if (isParallaxRunning) {
      requestAnimationFrame(updateParallax);
    }
  }

  window.addEventListener('scroll', function () {
    targetScrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  if (!prefersReducedMotion) {
    requestAnimationFrame(updateParallax);
  }

  // ==========================================================================
  // 13. Dynamic Morphing Eco Canvas Particle System
  // ==========================================================================
  const canvas = document.getElementById('ecoParallaxCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000, radius: 110 };

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      mouse.x = -1000;
      mouse.y = -1000;
    }, { passive: true });

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize, { passive: true });

    // Color definitions per section
    const themePalettes = {
      beranda: [
        { r: 120, g: 166, b: 65 },  // leaf green
        { r: 46,  g: 107, b: 63 },  // forest green
        { r: 244, g: 211, b: 94 },  // warm sun
      ],
      tentang: [
        { r: 53,  g: 185, b: 215 }, // river water
        { r: 120, g: 166, b: 65 },  // leaf
        { r: 200, g: 240, b: 250 }, // mist
      ],
      fakta: [
        { r: 53,  g: 185, b: 215 }, // cyan constellation
        { r: 46,  g: 107, b: 63 },  // deep forest
        { r: 244, g: 247, b: 235 }, // light star
      ],
      aksi: [
        { r: 120, g: 166, b: 65 },  // vibrant chlorophyll
        { r: 46,  g: 107, b: 63 },  // deep leaf
        { r: 165, g: 214, b: 90 },  // fresh sprout
      ],
      tips: [
        { r: 244, g: 211, b: 94 },  // golden energy
        { r: 120, g: 166, b: 65 },  // green action
        { r: 53,  g: 185, b: 215 }, // clear water
      ],
      ajakan: [
        { r: 244, g: 211, b: 94 },  // bright celebration gold
        { r: 230, g: 175, b: 60 },  // amber
        { r: 120, g: 166, b: 65 },  // eco green
      ],
      sumber: [
        { r: 46,  g: 107, b: 63 },  // forest
        { r: 120, g: 166, b: 65 },  // leaf
        { r: 140, g: 170, b: 150 }, // muted woodland
      ],
    };

    const particleCount = Math.min(Math.floor(window.innerWidth / 28), 55);
    const particles = [];

    function createParticle() {
      const palette = themePalettes.beranda;
      const c = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.8 + 1.2,
        color: { r: c.r, g: c.g, b: c.b },
        targetColor: { r: c.r, g: c.g, b: c.b },
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7 - 0.25,
        alpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    let lastActiveSection = '';

    function renderParticles() {
      // Check if active section changed to smoothly morph particle colors
      const activeSec = currentActiveSectionId || 'beranda';
      if (activeSec !== lastActiveSection) {
        lastActiveSection = activeSec;
        const currentPalette = themePalettes[activeSec] || themePalettes.beranda;
        particles.forEach(function (p, idx) {
          const newColor = currentPalette[idx % currentPalette.length];
          p.targetColor = { r: newColor.r, g: newColor.g, b: newColor.b };
        });
      }

      ctx.clearRect(0, 0, width, height);

      const isConstellation = activeSec === 'fakta';

      // Draw constellation connective lines in Facts section
      if (isConstellation) {
        ctx.lineWidth = 0.75;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              const lineAlpha = (1 - dist / 90) * 0.18;
              ctx.strokeStyle = 'rgba(53, 185, 215, ' + lineAlpha + ')';
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      particles.forEach(function (p) {
        // Smoothly interpolate RGB color towards target palette
        p.color.r += (p.targetColor.r - p.color.r) * 0.04;
        p.color.g += (p.targetColor.g - p.color.g) * 0.04;
        p.color.b += (p.targetColor.b - p.color.b) * 0.04;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Pulse alpha gently
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.12;

        // Mouse avoidance/repulsion for interactive tactile feel
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius && mdist > 0) {
          const force = (mouse.radius - mdist) / mouse.radius;
          p.x += (mdx / mdist) * force * 3;
          p.y += (mdy / mdist) * force * 3;
        }

        // Screen boundary wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + Math.round(p.color.r) + ',' + Math.round(p.color.g) + ',' + Math.round(p.color.b) + ',' + Math.max(0, currentAlpha) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);
  }
})();
