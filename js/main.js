/**
 * FRNDSPACE LUXURY NIGHT VILLA - MAIN CORE CONTROLLER
 * Ambient Glow Theme Picker, Day/Night Slider, 3D Tilt, Scroll Observer, FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect & Scroll To Top
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
      scrollTopBtn?.classList.add('visible');
    } else {
      header?.classList.remove('scrolled');
      scrollTopBtn?.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  }

  // 3. Ambient Glow Theme Picker
  const themeBtn = document.getElementById('themeBtn');
  const themeDropdown = document.getElementById('themeDropdown');

  // Load saved theme
  const savedTheme = localStorage.getItem('frndspace_theme') || 'gold';
  if (savedTheme !== 'gold') {
    document.body.setAttribute('data-theme', savedTheme);
  }

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
      const langDropdown = document.getElementById('langDropdown');
      if (langDropdown) langDropdown.classList.remove('open');
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.remove('open');
    });

    const themeOptions = themeDropdown.querySelectorAll('.theme-option');
    themeOptions.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = opt.getAttribute('data-theme-val');
        if (theme === 'gold') {
          document.body.removeAttribute('data-theme');
        } else {
          document.body.setAttribute('data-theme', theme);
        }
        localStorage.setItem('frndspace_theme', theme);
        themeDropdown.classList.remove('open');
      });
    });
  }

  // 4. Interactive Day vs Night Slider
  const comparisonSlider = document.getElementById('comparisonSlider');
  const nightImg = document.getElementById('nightImg');
  const comparisonHandle = document.getElementById('comparisonHandle');

  if (comparisonSlider && nightImg && comparisonHandle) {
    function updateComparison(val) {
      nightImg.style.width = `${val}%`;
      comparisonHandle.style.left = `${val}%`;
    }

    comparisonSlider.addEventListener('input', (e) => {
      updateComparison(e.target.value);
    });
  }

  // 5. 3D Card Tilt on Mouse Move
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 7. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((i) => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // 8. Quick Booking Form (Homepage)
  const heroBookingForm = document.getElementById('heroBookingForm');
  if (heroBookingForm) {
    // Set default dates
    const checkInInput = document.getElementById('heroCheckIn');
    const checkOutInput = document.getElementById('heroCheckOut');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    if (checkInInput && !checkInInput.value) {
      checkInInput.value = tomorrow.toISOString().split('T')[0];
    }
    if (checkOutInput && !checkOutInput.value) {
      checkOutInput.value = dayAfter.toISOString().split('T')[0];
    }

    heroBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkIn = document.getElementById('heroCheckIn')?.value || 'Not specified';
      const checkOut = document.getElementById('heroCheckOut')?.value || 'Not specified';
      const guests = document.getElementById('heroGuests')?.value || '1-4 Guests';
      const occasion = document.getElementById('heroOccasion')?.value || 'Friends Getaway';
      const phoneNumber = '918688661938';

      const message = 
        `*✨ VILLA BOOKING INQUIRY - frndspace ✨*%0A` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
        `*Check-In:* ${checkIn}%0A` +
        `*Check-Out:* ${checkOut}%0A` +
        `*Total Guests:* ${guests}%0A` +
        `*Occasion:* ${occasion}%0A` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
        `Please confirm available night slots and rates!`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 9. Dynamic Stargazing & Moon Phase Display
  const moonPhaseElement = document.getElementById('moonPhaseText');
  if (moonPhaseElement) {
    const moonPhases = ['Waxing Crescent 🌙', 'First Quarter 🌓', 'Waxing Gibbous 🌔', 'Full Moon 🌕', 'Waning Gibbous 🌖'];
    const randomPhase = moonPhases[Math.floor(Math.random() * moonPhases.length)];
    moonPhaseElement.textContent = `Moon: ${randomPhase}`;
  }
});
