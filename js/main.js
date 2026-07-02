/* =========================================================
   GeoLab — main.js
   Анимации, формы, навигация
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // HEADER SCROLL EFFECT
  // =========================================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // =========================================================
  // BURGER MENU
  // =========================================================
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  // Create overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  overlay.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close nav on link click
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // =========================================================
  // SMOOTH SCROLL (для старых браузеров)
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll down button
  const scrollDown = document.getElementById('scrollDown');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const services = document.getElementById('services');
      if (services) {
        const offset = services.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  }

  // =========================================================
  // REVEAL ON SCROLL (Intersection Observer)
  // =========================================================
  const revealElements = document.querySelectorAll(
    '.service-card, .about__card, .cert-card, .portfolio__item, .about__stats, .equipment__inner, .contact__inner, .section__header'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Добавляем небольшую задержку для вложенных элементов
        const children = entry.target.querySelectorAll('.service-card, .about__card, .cert-card, .portfolio__item');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Also observe individual cards that are not inside a section__header
  document.querySelectorAll('.service-card, .about__card, .cert-card').forEach(el => {
    // Already handled by the parent observer, but ensure standalone cards work
    if (!el.closest('.reveal')) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });

  // =========================================================
  // COUNTER ANIMATION
  // =========================================================
  const counters = document.querySelectorAll('.stat__num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 60);
    const duration = 1500;
    const stepTime = Math.floor(duration / 60);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current + (target === 99 ? '%' : '+');
    }, stepTime);
  }

  // =========================================================
  // FORM HANDLING
  // =========================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Простейшая валидация
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name) {
        showFormError('Пожалуйста, укажите ваше имя');
        return;
      }

      if (!phone || phone.length < 10) {
        showFormError('Пожалуйста, укажите корректный номер телефона');
        return;
      }

      // Показываем успех (позже заменить на отправку)
      const submitBtn = contactForm.querySelector('.btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = '✓ Отправлено! Спасибо!';
      submitBtn.style.background = '#4CAF50';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);

      // TODO: заменить на реальную отправку
      // Пример: fetch('/api/send', { method: 'POST', body: formData })
      console.log('Форма отправлена:', { name, phone, message });
    });

    function showFormError(msg) {
      // Удаляем старую ошибку
      const oldError = contactForm.querySelector('.form__error');
      if (oldError) oldError.remove();

      const error = document.createElement('p');
      error.className = 'form__error';
      error.textContent = msg;
      error.style.cssText = `
        color: #D4A5A5;
        font-size: 0.85rem;
        text-align: center;
        padding: 12px;
        background: color-mix(in srgb, #D4A5A5 10%, transparent);
        border-radius: 8px;
        margin-bottom: 16px;
      `;

      const btn = contactForm.querySelector('.btn');
      btn.parentNode.insertBefore(error, btn);

      setTimeout(() => error.remove(), 3000);
    }

    // Маска телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.startsWith('7') || value.startsWith('8')) {
          value = value.substring(1);
        }
        let formatted = '+7';
        if (value.length > 0) formatted += ' (' + value.substring(0, 3);
        if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
        if (value.length >= 7) formatted += '-' + value.substring(6, 8);
        if (value.length >= 9) formatted += '-' + value.substring(8, 10);
        e.target.value = formatted;
      }
    });
  }

  // =========================================================
  // ПЕРЕКЛЮЧАТЕЛЬ ЦВЕТОВЫХ СХЕМ
  // =========================================================
  const themeSwitcher = document.getElementById('themeSwitcher');
  if (themeSwitcher) {
    const themeBtns = themeSwitcher.querySelectorAll('.theme-btn');

    // Сохраняем выбранную тему
    const savedTheme = localStorage.getItem('geolab-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === savedTheme);
      });
    }

    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;

        // Удаляем или устанавливаем data-theme
        if (theme) {
          document.documentElement.setAttribute('data-theme', theme);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }

        localStorage.setItem('geolab-theme', theme);

        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // =========================================================
  // PARALLAX ДЛЯ ГЕРОЯ (легкий эффект)
  // =========================================================
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scroll = window.pageYOffset;
      const shapes = hero.querySelectorAll('.hero__shape');
      shapes.forEach((shape, i) => {
        const speed = 0.05 * (i + 1);
        shape.style.transform = `translate(-50%, calc(-50% + ${scroll * speed}px))`;
      });
    });
  }

  // =========================================================
  // АНИМАЦИЯ МОБИЛЬНОГО СКАНЕРА
  // =========================================================
  const scannerHead = document.querySelector('.scanner__head');
  if (scannerHead) {
    const scanningObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.3 });

    scanningObserver.observe(scannerHead);
  }

  console.log('GeoLab — Геодезия в Крыму');
  console.log('Сайт загружен успешно ✓');

  // =========================================================
  // ГОД В ФУТЕРЕ
  // =========================================================
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
