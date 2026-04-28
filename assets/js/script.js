/**
 * ============================================
 * Mníchov - Turistická lokalita | script.js
 * ============================================
 */

/* ===========================
   1. DARK MODE PREPÍNAČ
=========================== */
const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
  // Načítaj uložené nastavenie
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateDarkModeIcon(savedTheme);

  darkModeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateDarkModeIcon(next);
  });
}

function updateDarkModeIcon(theme) {
  if (!darkModeToggle) return;
  darkModeToggle.innerHTML = theme === 'dark'
    ? '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>'
    : '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>';
}

/* ===========================
   2. SCROLL REVEAL ANIMÁCIA
=========================== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Odpoj po odhalení (jednorázová animácia)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ===========================
   3. ANIMOVANÝ COUNTER
=========================== */
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('sk-SK');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('sk-SK');
    }
  }

  requestAnimationFrame(update);
}

// Spusť počítadlá keď sa dostanú do viewportu
const counterNumbers = document.querySelectorAll('.counter-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterNumbers.forEach(el => counterObserver.observe(el));

/* ===========================
   4. NAVBAR SCROLL EFEKT
=========================== */
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.style.padding = '0.5rem 0';
    } else {
      navbar.style.padding = '1rem 0';
    }
  });
}

/* ===========================
   5. GALÉRIA THUMBS SYNC
=========================== */
const thumbs = document.querySelectorAll('.gallery-thumbs img');
const carouselEl = document.getElementById('galleryCarousel');

if (carouselEl && thumbs.length > 0) {
  // Klik na thumbnail → zmeň slide
  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
      carousel.to(idx);
    });
  });

  // Zmeň aktívny thumbnail pri zmene slidu
  carouselEl.addEventListener('slid.bs.carousel', (e) => {
    thumbs.forEach(t => t.classList.remove('active'));
    if (thumbs[e.to]) {
      thumbs[e.to].classList.add('active');
    }
  });

  // Nastav prvý ako aktívny
  if (thumbs[0]) thumbs[0].classList.add('active');
}

/* ===========================
   6. KONTAKTNÝ FORMULÁR + TOAST
=========================== */
const contactForm = document.getElementById('contactForm');
const toastEl = document.getElementById('successToast');
const toastCloseBtn = document.getElementById('toastClose');
let toastTimer = null;

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Skontroluj validitu formulára
    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      return;
    }

    // Zobraz toast notifikáciu
    showToast();
    contactForm.reset();
    contactForm.classList.remove('was-validated');
  });
}

function showToast() {
  if (!toastEl) return;

  // Zobraz toast
  toastEl.classList.add('show');

  // Automaticky skry po 5 sekundách
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    hideToast();
  }, 5000);
}

function hideToast() {
  if (!toastEl) return;
  toastEl.classList.remove('show');
}

// Zatvorenie toastu manuálne
if (toastCloseBtn) {
  toastCloseBtn.addEventListener('click', () => {
    clearTimeout(toastTimer);
    hideToast();
  });
}

/* ===========================
   7. PODMIENENÉ POLE – TELEFÓN
   Telefón sa zobrazí len ak si vybrané "Telefonická konzultácia"
=========================== */
const kontaktSelect = document.getElementById('kontaktTyp');
const telefonField = document.getElementById('telefonField');

if (kontaktSelect && telefonField) {
  kontaktSelect.addEventListener('change', () => {
    if (kontaktSelect.value === 'telefon') {
      telefonField.style.display = 'block';
      const telefonInput = telefonField.querySelector('input');
      if (telefonInput) telefonInput.setAttribute('required', 'required');
    } else {
      telefonField.style.display = 'none';
      const telefonInput = telefonField.querySelector('input');
      if (telefonInput) telefonInput.removeAttribute('required');
    }
  });
}

/* ===========================
   8. AKTÍVNY NAV LINK
=========================== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage ||
     (currentPage === '' && href === 'index.html') ||
     (currentPage === 'index.html' && href === 'index.html')) {
    link.classList.add('active');
  }
});