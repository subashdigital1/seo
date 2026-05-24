// =============================================
// Subash Ravi  – Digital Marketing Portfolio
// script.js – Interactions, Animations, Logic
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    toggleBackToTop();
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  // ===== ACTIVE NAV LINK =====
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], .stats-strip[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // ===== TYPING TEXT EFFECT =====
  const typingEl = document.getElementById('typingText');
  const titles = [
    'SEO | GEO | AEO Specialist',
    'Technical SEO Expert',
    'AI Search Optimizer',
    'Organic Growth Strategist',
    'GEO & AEO Consultant',
    'Search Visibility Expert'
  ];
  let titleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const current = titles[titleIdx];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      titleIdx = (titleIdx + 1) % titles.length;
      delay = 400;
    }

    typingTimeout = setTimeout(type, delay);
  }

  if (typingEl) type();

  // ===== SCROLL REVEAL ANIMATION =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on position in parent
        const siblings = Array.from(entry.target.parentElement.children);
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${(index % 4) * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== ANIMATED STATS COUNTER =====
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
      countersAnimated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.closest('.stat-item').dataset.target);
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 25);
      });
    }
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);

  // ===== SKILL BARS ANIMATION =====
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const width = bar.dataset.width;
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  // ===== PROJECT FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== TESTIMONIAL SLIDER =====
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let slidesPerView = window.innerWidth <= 768 ? 1 : 2;
    const total = Math.ceil(cards.length / slidesPerView);

    // Create dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    function updateSlider() {
      const cardWidth = cards[0].offsetWidth + 24; // gap
      track.style.transform = `translateX(-${current * slidesPerView * cardWidth}px)`;

      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      updateSlider();
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Auto-advance
    let autoSlide = setInterval(() => goTo((current + 1) % total), 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo((current + 1) % total), 5000);
    });

    // Touch support
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    window.addEventListener('resize', () => {
      slidesPerView = window.innerWidth <= 768 ? 1 : 2;
      updateSlider();
    });
  }

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle?.querySelector('i');

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    if (themeIcon) { themeIcon.className = 'fa-solid fa-sun'; }
  }

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    if (themeIcon) {
      themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  });

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  }

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      const nameErr = document.getElementById('nameError');
      const emailErr = document.getElementById('emailError');
      const messageErr = document.getElementById('messageError');

      let valid = true;

      // Clear errors
      [nameErr, emailErr, messageErr].forEach(el => { if (el) el.textContent = ''; });
      [name, email, message].forEach(el => {
        if (el) el.style.borderColor = '';
      });

      // Validate name
      if (!name.value.trim() || name.value.trim().length < 2) {
        nameErr.textContent = 'Please enter your full name (min 2 characters)';
        name.style.borderColor = '#FF5E5E';
        valid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        emailErr.textContent = 'Please enter a valid email address';
        email.style.borderColor = '#FF5E5E';
        valid = false;
      }

      // Validate message
      if (!message.value.trim() || message.value.trim().length < 10) {
        messageErr.textContent = 'Message must be at least 10 characters';
        message.style.borderColor = '#FF5E5E';
        valid = false;
      }

      if (valid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          contactForm.reset();
          formSuccess.classList.add('visible');
          setTimeout(() => formSuccess.classList.remove('visible'), 5000);
        }, 1500);
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== NAVBAR HIGHLIGHT ON SECTION ENTER =====
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => navObserver.observe(section));

  // ===== CLOSE MOBILE NAV ON OUTSIDE CLICK =====
  document.addEventListener('click', (e) => {
    if (navLinksContainer.classList.contains('open') &&
        !navLinksContainer.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    }
  });

  // ===== HERO PARALLAX (subtle) =====
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroContent && scrolled < 600) {
      heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
      if (heroVisual) heroVisual.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
  });

  console.log('🚀 Portfolio loaded | Subash Ravi | SEO · GEO · AEO Specialist');
});
