/**
 * Sharma Scientific Instruments (SSI) - Main Platform Controller
 * Handles focus-trapped mobile drawer, sticky header,
 * hero showcase switcher, catalogue live search & filtering, and enquiry modal bindings.
 */

(function () {
  'use strict';

  // --- 1. Focus-Trapped Mobile Drawer Navigation ---
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const backdrop = document.querySelector('.mobile-nav-backdrop');

    if (!menuToggle || !mobileDrawer) return;

    let previousActiveElement = null;

    function getFocusableElements() {
      return mobileDrawer.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }

    function openMenu() {
      previousActiveElement = document.activeElement;
      mobileDrawer.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');

      document.addEventListener('keydown', handleKeyDown);

      // Focus first focusable element inside drawer
      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        setTimeout(() => focusables[0].focus(), 50);
      }
    }

    function closeMenu() {
      mobileDrawer.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');

      document.removeEventListener('keydown', handleKeyDown);

      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }

    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Close on any navigation link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- 2. Sticky Header with Scroll Padding & Shadow ---
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- 3. Hero Flagship Model Switcher ---
  window.switchHeroShowcase = function (id, title, desc, imgUrl, btnEl) {
    const mainImg = document.getElementById('hero-main-img');
    const titleEl = document.getElementById('hero-prod-title');
    const descEl = document.getElementById('hero-prod-desc');
    const linkEl = document.getElementById('hero-prod-link');

    if (mainImg) {
      mainImg.style.opacity = '0.4';
      mainImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        mainImg.src = imgUrl;
        mainImg.alt = title;
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 150);
    }
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (linkEl) linkEl.href = `product.html?id=${id}`;

    document.querySelectorAll('.hero-thumb-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  };

  // --- 4. Catalogue & Featured Grid Filtering / Search ---
  let activeCat = 'all';
  let activeSearch = '';

  window.filterProductsByCategory = function (catId, btnEl) {
    activeCat = catId;
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    applyGridFilters();
  };

  window.handleProductSearch = function (query) {
    activeSearch = (query || '').toLowerCase().trim();
    applyGridFilters();
  };

  window.resetGridFilters = function () {
    activeCat = 'all';
    activeSearch = '';
    const input = document.getElementById('catalogue-search-input');
    if (input) input.value = '';
    document.querySelectorAll('.cat-pill').forEach((b, idx) => {
      if (idx === 0) b.classList.add('active');
      else b.classList.remove('active');
    });
    applyGridFilters();
  };

  function applyGridFilters() {
    const cards = document.querySelectorAll('.product-card[data-category]');
    let count = 0;

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();
      const cardModel = (card.getAttribute('data-model') || '').toLowerCase();

      const matchCat = (activeCat === 'all' || cardCat === activeCat);
      const matchSearch = (!activeSearch || cardName.includes(activeSearch) || cardModel.includes(activeSearch));

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    const countLabel = document.getElementById('products-count-label');
    if (countLabel) countLabel.textContent = count;

    const emptyState = document.getElementById('catalogue-empty-state');
    if (emptyState) {
      emptyState.style.display = count === 0 ? 'block' : 'none';
    }
  }

  // --- 5. Page Loader Fadeout ---
  function initLoader() {
    const loader = document.getElementById('ssi-page-loader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 350);
      }, 100);
    });
  }

  // --- 6. Back-To-Top Button ---
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal key content as it enters view. Content remains visible if this
  // browser does not support IntersectionObserver.
  function initScrollReveal() {
    const revealItems = document.querySelectorAll(
      '.trust-item, .product-card, .sector-card, .guidance-panel, main .section-eyebrow'
    );
    if (!revealItems.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    revealItems.forEach(item => item.setAttribute('data-reveal', ''));
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('is-visible'));
      return;
    }

    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealItems.forEach(item => observer.observe(item));
  }

  // DOMContentLoaded Initializer
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initStickyHeader();
    initLoader();
    initBackToTop();
    initScrollReveal();

  });

})();
