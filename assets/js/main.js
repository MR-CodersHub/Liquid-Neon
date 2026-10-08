/* ==========================================================================
   LIQUID NEON CRAFT BREWERY & TAPROOM - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const savedTheme = localStorage.getItem('liquid_theme') || 'dark';
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('liquid_theme', theme);
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`);
    });
  }
  
  setTheme(savedTheme);
  
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  // 2. Direction Management (RTL / LTR)
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle');
  const savedDir = localStorage.getItem('liquid_dir') || 'ltr';
  
  function setDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('liquid_dir', dir);
    rtlToggleBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }
  
  setDirection(savedDir);
  
  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      setDirection(newDir);
    });
  });

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');
  const mobileClose = document.querySelector('.mobile-close');

  function openMobileNav() {
    if (mobileNav && overlay) {
      mobileNav.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNav && overlay) {
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);

  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // 4. Sticky Navbar Scroll Effect & Back to Top
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (navbar) navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
      if (backToTopBtn) backToTopBtn.classList.add('show');
    } else {
      if (navbar) navbar.style.boxShadow = 'none';
      if (backToTopBtn) backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Animated Counter Stats
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          const prefix = entry.target.getAttribute('data-prefix') || '';
          const suffix = entry.target.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.ceil(target / 40);
          
          const counter = setInterval(() => {
            count += speed;
            if (count >= target) {
              entry.target.textContent = prefix + target + suffix;
              clearInterval(counter);
            } else {
              entry.target.textContent = prefix + count + suffix;
            }
          }, 30);
          
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  }

  // 6. Accordion Logic
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Beer Filtering Engine
  const filterBtns = document.querySelectorAll('.beer-filter-btn');
  const beerItems = document.querySelectorAll('.beer-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      
      btn.classList.remove('btn-secondary');
      btn.classList.add('active', 'btn-primary');

      const styleFilter = btn.getAttribute('data-filter');

      beerItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (styleFilter === 'all' || itemCategory === styleFilter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 8. Form Validation & Modal Notification System
  const modal = document.getElementById('notificationModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalClose = document.getElementById('modalCloseBtn');

  function showModal(title, message) {
    if (modal && modalTitle && modalMessage) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modal.classList.add('active');
    } else {
      alert(`${title}\n\n${message}`);
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Enquiry Form Handler (contact.html)
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const requiredInputs = enquiryForm.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        showModal('Enquiry Received!', 'Thank you for reaching out to Liquid Neon Brewery. Our team will respond within 24 hours to confirm your reservation or request.');
        enquiryForm.reset();
      } else {
        showModal('Form Incomplete', 'Please fill in all required fields accurately.');
      }
    });
  }

  // Login Form Handler (auth.html)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPass');

      if (email.value.trim() && pass.value.trim()) {
        showModal('Welcome Back!', `Logged in successfully as ${email.value.trim()}. Cheers!`);
        loginForm.reset();
      } else {
        showModal('Authentication Error', 'Please provide both email and password.');
      }
    });
  }

  // Register Form Handler (auth.html)
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName');
      const email = document.getElementById('regEmail');

      if (name.value.trim() && email.value.trim()) {
        showModal('Welcome to Liquid Club!', `Account created for ${name.value.trim()}. You are now part of our craft inner circle.`);
        registerForm.reset();
      } else {
        showModal('Registration Error', 'Please complete all required fields.');
      }
    });
  }

  // Newsletter Forms Handler
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showModal('Subscribed!', 'You are now subscribed to Liquid Neon taproom updates and fresh release drops.');
        form.reset();
      }
    });
  });

  // 9. Countdown Timer for coming-soon.html
  const timerDays = document.getElementById('timerDays');
  const timerHours = document.getElementById('timerHours');
  const timerMinutes = document.getElementById('timerMinutes');
  const timerSeconds = document.getElementById('timerSeconds');

  if (timerDays && timerHours && timerMinutes && timerSeconds) {
    const targetDate = new Date().getTime() + (14 * 24 * 60 * 60 * 1000); // 14 days from now

    setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDays.textContent = String(days).padStart(2, '0');
        timerHours.textContent = String(hours).padStart(2, '0');
        timerMinutes.textContent = String(minutes).padStart(2, '0');
        timerSeconds.textContent = String(seconds).padStart(2, '0');
      }
    }, 1000);
  }
});
