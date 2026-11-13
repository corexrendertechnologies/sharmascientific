const fs = require('fs');

const data = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const company = data.company;
const categories = data.categories;
const products = data.products;

function whatsappIcon(size = 20) {
  return `<svg class="whatsapp-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.16 1.6 5.97L.05 24l6.27-1.64a11.94 11.94 0 0 0 5.76 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.5-8.42ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.62-.23-.37a9.87 9.87 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.01 2.91a9.84 9.84 0 0 1 2.9 7.02c0 5.46-4.44 9.9-9.92 9.9Zm5.43-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.62.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" fill="currentColor"/></svg>`;
}

function jsonLdScript(schemaObj) {
  return '\n  <script type="application/ld+json">\n' + JSON.stringify(schemaObj, null, 2) + '\n  </script>\n';
}

function getHead(title, description, canonicalSlug = "", extraHead = "") {
  const canonUrl = `https://sharmascientificinstruments.in/${canonicalSlug}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="laboratory equipment, BOD incubator, hot air oven, humidity chamber, laminar air flow bench, water bath, scientific instruments, Sharma Scientific Instruments">
  <link rel="canonical" href="${canonUrl}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://sharmascientificinstruments.in/assets/img/logo/logo-mark-512.png">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://sharmascientificinstruments.in/assets/img/logo/logo-mark-512.png">

  <!-- Favicon Set -->
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/img/logo/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/img/logo/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/img/logo/apple-touch-icon.png">

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="assets/css/style.css">

  <!-- Central Configuration & Core Systems (No 3D / No Three.js) -->
  <script src="assets/js/config.js"></script>
  <script src="assets/js/enquiry.js"></script>
  <script src="assets/js/script.js" defer></script>
  ${extraHead}
</head>
<body>
  <!-- Accessibility Skip Link -->
  <a href="#main-content" class="skip-link" style="position:absolute; top:-100px; left:10px; background:#0b1528; color:#fff; padding:8px 12px; z-index:99999; border-radius:4px; font-weight:600;">Skip to main content</a>

  <!-- Page Loader -->
  <div id="ssi-page-loader" class="ssi-page-loader" aria-hidden="true">
    <img src="assets/img/logo/logo-mark.svg" alt="SSI Logo" class="loader-badge-pulse" width="90" height="52">
    <span style="font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em; color: var(--color-primary); text-transform: uppercase;">Sharma Scientific Instruments</span>
  </div>
`;
}

function getHeader(activeNav = "") {
  const navs = [
    { url: "index.html", name: "Home", active: activeNav === "home" },
    { url: "about.html", name: "About", active: activeNav === "about" },
    { url: "products.html", name: "Products", active: activeNav === "products" },
    { url: "industries.html", name: "Industries", active: activeNav === "industries" },
    { url: "quality.html", name: "Quality", active: activeNav === "quality" },
    { url: "contact.html", name: "Contact", active: activeNav === "contact" },
  ];

  const linksHtml = navs.map(n => `<a href="${n.url}" class="nav-link ${n.active ? 'active' : ''}"${n.active ? ' aria-current="page"' : ''}>${n.name}</a>`).join('');
  const mobileLinksHtml = navs.map(n => `<a href="${n.url}" class="mobile-nav-link ${n.active ? 'active' : ''}"${n.active ? ' aria-current="page"' : ''}>${n.name}</a>`).join('');

  return `
  <!-- Top Corporate Contact Strip (Single Line Desktop, Verified Only, Hidden on Mobile) -->
  <div class="top-corporate-bar">
    <div class="container topbar-content">
      <div class="topbar-items">
        <a href="tel:+919898457997" class="topbar-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          +91 98984 57997
        </a>
        <a href="mailto:ssirajesh2010@gmail.com" class="topbar-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          ssirajesh2010@gmail.com
        </a>
      </div>
      <div class="topbar-right">
        <span class="topbar-note">Laboratory equipment catalogue • Ahmedabad, Gujarat</span>
      </div>
    </div>
  </div>

  <!-- Executive Sticky Header (Single 72px Row / 64px Mobile, No Wrap) -->
  <header class="site-header" role="banner">
    <div class="container header-container">
      <!-- Brand Lockup: Logo + 2-Line Text Centered -->
      <a href="index.html" class="site-brand" aria-label="Sharma Scientific Instruments Home">
        <img src="assets/img/logo/logo-mark.svg" alt="SSI Logo" class="site-brand-logo" width="48" height="28">
        <div class="site-brand-text">
          <span class="brand-title">Sharma Scientific</span>
          <span class="brand-sub">Laboratory equipment · Ahmedabad</span>
        </div>
      </a>

      <!-- Desktop Nav (Hidden below 1100px) -->
      <nav class="desktop-nav" role="navigation" aria-label="Main Navigation">
        ${linksHtml}
      </nav>

      <!-- Action Tools Cluster -->
      <div class="header-actions">
        <!-- Request Quote Button (Keep visible as primary button) -->
        <button type="button" class="btn btn-primary btn-sm" onclick="SSI_Enquiry.openQuoteModal('General Equipment Enquiry', '')">
          Request Quote
        </button>

        <!-- Mobile Menu Hamburger (Visible below 1100px) -->
        <button type="button" class="btn-icon-tool mobile-menu-toggle" aria-label="Open mobile navigation menu" aria-expanded="false" aria-controls="mobile-navigation-drawer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer Menu (Focus-Trapped Full-Height Drawer) -->
  <div class="mobile-nav-backdrop" aria-hidden="true"></div>
  <div class="mobile-nav-drawer" id="mobile-navigation-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer" aria-hidden="true" inert>
    <div class="mobile-drawer-header">
      <div class="flex items-center gap-2">
        <img src="assets/img/logo/logo-mark.svg" alt="SSI Logo" width="40" height="24">
        <span style="font-weight: 800; font-size: 1rem;">Sharma Scientific</span>
      </div>
      <button type="button" class="btn-icon-tool mobile-nav-close" aria-label="Close navigation drawer">&times;</button>
    </div>
    <div class="mobile-nav-links">
      ${mobileLinksHtml}
    </div>
    <div class="mobile-drawer-footer">
      <button type="button" class="btn btn-primary w-100 mb-2" onclick="requestQuoteFromMobileMenu()">
        Request Quotation
      </button>
      <a href="https://wa.me/919898457997?text=Hello%20Sharma%20Scientific%20Instruments%2C%20I%20would%20like%20to%20request%20a%20quotation%20for%20laboratory%20equipment." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp w-100 mb-2">
        ${whatsappIcon(19)} Chat on WhatsApp
      </a>
      <a href="tel:+919898457997" class="btn btn-secondary w-100">
        Call: +91 98984 57997
      </a>
    </div>
  </div>
  `;
}

function getFooter() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-feature">
        <div class="footer-brand-lockup"><img src="assets/img/logo/logo-mark.svg" alt="" width="52" height="32"><div><strong>Sharma Scientific Instruments</strong><span>Laboratory equipment · Ahmedabad, India</span></div></div>
        <p>Explore equipment by application, review the published product information, then contact the team to confirm model configuration and availability.</p>
        <a class="footer-cta" href="contact.html">Talk to our team <span aria-hidden="true">↗</span></a>
      </div>
      <div class="footer-grid">
        <div class="footer-col"><h4>Explore</h4><div class="footer-links"><a href="about.html">About</a><a href="products.html">Product catalogue</a><a href="industries.html">Applications</a><a href="quality.html">Selection guide</a><a href="contact.html">Contact</a></div></div>
        <div class="footer-col"><h4>Product families</h4><div class="footer-links">${categories.slice(0, 6).map(c => `<a href="products.html?category=${escapeHtml(c.id)}">${escapeHtml(c.name)}</a>`).join('')}</div></div>
        <div class="footer-col footer-contact-col"><h4>Get in touch</h4><div class="footer-links"><a href="tel:+919898457997">+91 98984 57997</a><a href="tel:+917405057997">+91 74050 57997</a><a href="mailto:ssirajesh2010@gmail.com">ssirajesh2010@gmail.com</a><span>Ahmedabad, Gujarat, India</span></div><a class="footer-whatsapp" href="https://wa.me/919898457997" target="_blank" rel="noopener noreferrer">${whatsappIcon(18)} WhatsApp enquiry <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} Sharma Scientific Instruments</span><span>Published specifications are subject to model and configuration confirmation.</span></div>
    </div>
  </footer>

  <!-- Persistent Sticky Mobile Bottom CTA Bar (< 768px) -->
  <div class="mobile-sticky-cta-bar" aria-label="Mobile Contact and RFQ Bar">
    <a href="https://wa.me/919898457997?text=Hello%20Sharma%20Scientific%20Instruments%2C%20I%20would%20like%20to%20request%20a%20quotation%20for%20laboratory%20equipment." target="_blank" rel="noopener noreferrer" class="btn-mobile-cta btn-whatsapp">
${whatsappIcon(19)}
      WhatsApp
    </a>
    <button type="button" class="btn-mobile-cta btn-primary" aria-label="Request a quotation" onclick="SSI_Enquiry.openQuoteModal('General Equipment Enquiry', '')">
      Quote
    </button>
    <a href="tel:+919898457997" class="btn-mobile-cta btn-secondary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      Call
    </a>
  </div>

  <!-- Back to Top Button -->
  <button type="button" class="back-to-top-btn btn-icon-tool" aria-label="Back to top" style="position: fixed; bottom: 24px; right: 24px; z-index: 850; display: none;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
  </button>
</body>
</html>
`;
}

/* ==========================================================================
   1. BUILD INDEX.HTML (HIGH-IMPACT SCIENTIFIC MANUFACTURER HERO)
   ========================================================================== */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderProductCard(p) {
  const code = p.catalogueCode || 'S.S.I. Make';
  const fallback = p.imageFallback || p.image;
  const chips = (p.chips && Array.isArray(p.chips) && p.chips.length > 0) ? p.chips.slice(0, 3) : [];
  const chipsHtml = chips.length > 0
    ? `<div class="card-chips">${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>`
    : '';

  const datasheetBtn = p.pdfUrl
    ? `<a href="${p.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-icon" title="Download Technical Datasheet (PDF)">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
         <span class="action-label">Datasheet</span>
       </a>`
    : `<button type="button" class="btn-action-icon" onclick="SSI_Enquiry.openQuoteModal('${escapeHtml(p.name)} - Datasheet Request', '${code}')" title="Request Technical Datasheet">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
         <span class="action-label">Request datasheet</span>
       </button>`;

  return `
    <article class="product-card" data-id="${p.id}" data-category="${p.category}" data-name="${escapeHtml(p.name)}" data-model="${code}">
      <!-- Product catalogue image -->
      <div class="product-photo-box">
        <span class="badge-origin">SSI Catalogue</span>
        <img src="${p.image}" alt="${escapeHtml(p.name)}" class="product-photo-img" loading="lazy" width="400" height="300" onerror="this.src='${fallback}'">
      </div>

      <!-- Card Body Content -->
      <div class="product-card-body">
        <div class="card-meta">
          <span class="card-category">${p.categoryName}</span>
          <span class="card-model-code">${code}</span>
        </div>
        <h3 class="product-card-title">${escapeHtml(p.name)}</h3>
        <p class="product-card-desc">${escapeHtml(p.tagline || p.description)}</p>
        ${chipsHtml}

        <div class="product-card-footer">
          <!-- Primary Request Quote Button (Full Width) -->
          <button type="button" class="btn btn-primary w-100" onclick="SSI_Enquiry.openQuoteModal('${escapeHtml(p.name)}', '${code}')">
            Request Quote
          </button>

          <!-- Secondary Actions Subrow -->
          <div class="card-actions-subrow">
            ${datasheetBtn}
            <a href="product.html?id=${p.id}" class="card-link-details">
              View details &rarr;
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

function buildIndex() {
  const catsHtml = categories.map(cat => `
    <a href="products.html?category=${cat.id}" class="product-card" style="padding: 1.5rem; text-decoration: none;">
      <div class="flex items-center justify-between mb-2">
        <span class="section-eyebrow" style="margin-bottom:0;">${cat.count} Instruments</span>
        <span style="color: var(--color-accent); font-size: 0.85rem; font-weight: 700;">Explore &rarr;</span>
      </div>
      <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 800;">${cat.name}</h3>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0; line-height: 1.5;">${cat.description}</p>
    </a>
  `).join('');

  const featured = products.filter(p => p.featured);
  const featHtml = featured.map(p => renderProductCard(p)).join('');

  const indexSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sharmascientificinstruments.in/#organization",
        "name": "Sharma Scientific Instruments",
        "alternateName": "SSI",
        "url": "https://sharmascientificinstruments.in",
        "logo": "https://sharmascientificinstruments.in/assets/img/logo/logo-mark-512.png",
        "founder": {
          "@type": "Person",
          "name": "Mr. Rajesh Sharma"
        },
        "description": "Precision laboratory equipment and scientific instrument manufacturer in Ahmedabad, Gujarat, India.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91 98984 57997",
          "contactType": "sales",
          "availableLanguage": ["English"]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://sharmascientificinstruments.in/#localbusiness",
        "name": "Sharma Scientific Instruments",
        "alternateName": "SSI",
        "image": "https://sharmascientificinstruments.in/assets/img/logo/logo-mark-512.png",
        "telephone": "+91 98984 57997",
        "email": "ssirajesh2010@gmail.com",
        "url": "https://sharmascientificinstruments.in",
        "description": "Manufacturer of laboratory equipment, vertical autoclaves, BOD incubators, hot air ovens, humidity chambers, and water baths in Ahmedabad, Gujarat."
      },
      {
        "@type": "WebSite",
        "@id": "https://sharmascientificinstruments.in/#website",
        "url": "https://sharmascientificinstruments.in",
        "name": "Sharma Scientific Instruments",
        "publisher": { "@id": "https://sharmascientificinstruments.in/#organization" }
      }
    ]
  };

  const body = `
  <main id="main-content">
    <!-- Hero Section (Fluid Type, 2-Col Desktop Fold, 2x2 Verified Points, 3 Equal-Height Buttons) -->
    <section class="hero-scientific">
      <div class="container">
        <div class="hero-grid">
          <!-- Left Column: Company Value Proposition & Verified Points -->
          <div class="hero-copy-col">
            <span class="hero-eyebrow">Precision laboratory equipment <span class="hero-eyebrow-location">· Ahmedabad, India</span></span>
            <h1 class="hero-h1">Better tools for<br><em>better lab work.</em></h1>
            <p class="hero-lead">
              Explore 38 laboratory equipment models, review product details and datasheets, then speak directly with our team about the configuration your work needs.
            </p>

            <!-- Equal-Height Action Buttons Row (Never Orphans Third Row) -->
            <div class="hero-btn-row">
              <button type="button" class="btn btn-primary" onclick="SSI_Enquiry.openQuoteModal('General Equipment Enquiry', 'Flagship Range')">
                Request a Quote
              </button>
              <a href="#catalogue-section" class="btn btn-secondary hero-explore-btn">
                Explore the catalogue <span aria-hidden="true">↓</span>
              </a>
              <a href="https://wa.me/919898457997?text=Hello%20Sharma%20Scientific%20Instruments%2C%20I%20would%20like%20to%20request%20a%20quotation%20for%20laboratory%20equipment." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-whatsapp-icon" aria-label="Chat on WhatsApp" title="Chat directly on WhatsApp">
                ${whatsappIcon(20)}
                <span class="btn-whatsapp-text">WhatsApp</span>
              </a>
            </div>
            <div class="hero-value-row" aria-label="What you can do on this site">
              <span><i aria-hidden="true">01</i> Browse by equipment family</span>
              <span><i aria-hidden="true">02</i> Review model details</span>
              <span><i aria-hidden="true">03</i> Request a direct quotation</span>
            </div>
          </div>

          <!-- Right Column: Flagship Studio Equipment Showcase Card (Fits in Desktop Fold) -->
          <div class="hero-showcase-col">
            <div class="hero-showcase-box">
              <div class="hero-showcase-topline"><span class="hero-showcase-kicker"><i aria-hidden="true"></i> Product spotlight</span><span class="hero-showcase-count" id="hero-showcase-count">01 <b>/</b> 04</span></div>
              <span class="hero-showcase-badge" id="hero-flagship-tag">Model 01 · Featured</span>
              <div class="hero-showcase-img-wrap">
                <img id="hero-main-img" src="assets/img/products/bod-incubator.webp" alt="B.O.D. Incubator" class="hero-showcase-img" width="400" height="300" fetchpriority="high">
              </div>
              <div class="hero-showcase-info">
                <div class="hero-product-label">SSI product catalogue <span>·</span> Model spotlight</div>
                <h2 id="hero-prod-title" style="font-size:1.15rem; font-weight:800; margin-bottom:0.35rem; color:var(--text-main);">B.O.D. Incubator (S.S.I. / 005)</h2>
                <p id="hero-prod-desc" style="font-size:0.86rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.85rem;">Multi-purpose Low Temperature Incubator (5°C to 50°C) with Microcontroller PID dual LED display.</p>
                <a id="hero-prod-link" href="product.html?id=bod-incubator" class="btn btn-secondary btn-sm" style="width:100%; justify-content:center;">
                  View Specifications & Dimensions &rarr;
                </a>
              </div>

              <!-- Switcher Thumbnails -->
              <div class="hero-showcase-thumbs">
                <button type="button" class="hero-thumb-btn active" aria-pressed="true" aria-label="Show B.O.D. Incubator" onclick="switchHeroShowcase('bod-incubator', 'B.O.D. Incubator (S.S.I. / 005)', 'Multi-purpose Low Temperature Incubator (5°C to 50°C) with Microcontroller PID dual LED display.', 'assets/img/products/bod-incubator.webp', this)" title="B.O.D. Incubator">
                  <img src="assets/img/products/bod-incubator.webp" alt="BOD Incubator" width="48" height="48">
                </button>
                <button type="button" class="hero-thumb-btn" aria-pressed="false" aria-label="Show Hot Air Oven" onclick="switchHeroShowcase('hot-air-oven', 'Hot Air Oven (S.S.I. / 002)', 'Forced air circulation oven up to 250°C with heavy PUF/mineral wool insulation.', 'assets/img/products/hot-air-oven-ss.webp', this)" title="Hot Air Oven">
                  <img src="assets/img/products/hot-air-oven-ss.webp" alt="Hot Air Oven" width="48" height="48">
                </button>
                <button type="button" class="hero-thumb-btn" aria-pressed="false" aria-label="Show Vertical Autoclave" onclick="switchHeroShowcase('vertical-autoclave', 'Vertical Autoclave (S.S.I. Make)', 'High pressure steam sterilizer with radial swivel nuts and dial pressure gauge.', 'assets/img/products/vertical-autoclave.webp', this)" title="Vertical Autoclave">
                  <img src="assets/img/products/vertical-autoclave.webp" alt="Vertical Autoclave" width="48" height="48">
                </button>
                <button type="button" class="hero-thumb-btn" aria-pressed="false" aria-label="Show Humidity Chamber" onclick="switchHeroShowcase('humidity-chamber', 'Humidity Chamber (S.S.I. / 006)', 'Controlled humidity and temperature testing cabinet for pharmaceutical stability runs.', 'assets/img/products/humidity-chamber.webp', this)" title="Humidity Chamber">
                  <img src="assets/img/products/humidity-chamber.webp" alt="Humidity Chamber" width="48" height="48">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Credentials Ribbon -->
    <section class="trust-ribbon">
      <div class="container">
        <div class="trust-ribbon-grid">
          <div class="trust-item">
            <div class="trust-item-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <div class="trust-item-title">Ahmedabad, Gujarat</div>
              <div class="trust-item-sub">Sharma Scientific Instruments</div>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-item-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <div>
              <div class="trust-item-title">${products.length} product models</div>
              <div class="trust-item-sub">Browse by category or model</div>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-item-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div>
              <div class="trust-item-title">Direct product enquiries</div>
              <div class="trust-item-sub">Request a quotation from any product page</div>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-item-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <div>
              <div class="trust-item-title">Technical details</div>
              <div class="trust-item-sub">Available on individual product pages</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid Section with Category Chips, Search Box & Result Count -->
    <section class="section" id="catalogue-section">
      <div class="container">
        <div class="home-section-intro">
          <div><span class="section-eyebrow">Explore the catalogue <span aria-hidden="true">/ 38 models</span></span>
          <h2 class="section-title">Find the right equipment</h2></div>
          <p class="section-desc">
            Search by instrument or model, browse by category, and open any product for specifications or a direct quotation request.
          </p>
        </div>

        <!-- Catalogue Controls Bar -->
        <div class="catalogue-controls-bar">
          <!-- Search Box -->
          <div style="max-width: 550px; margin: 0 auto; width: 100%; position: relative;">
            <input type="text" id="catalogue-search-input" class="btn btn-secondary w-100" style="padding: 0.85rem 1.25rem; font-size: 0.95rem; text-align: left; border-radius: var(--radius-full);" placeholder="Search instruments (e.g. autoclave, incubator, oven, water bath)..." oninput="handleProductSearch(this.value)">
          </div>

          <!-- Category Filter Chips (Horizontal Scroll Row on Mobile) -->
          <div class="cat-chips-scroll" role="tablist" aria-label="Product categories">
            <button type="button" class="cat-pill active" onclick="filterProductsByCategory('all', this)">
              All Instruments (${products.length})
            </button>
            ${categories.map(c => `
              <button type="button" class="cat-pill" onclick="filterProductsByCategory('${c.id}', this)">
                ${c.name} (${c.count})
              </button>
            `).join('')}
          </div>

          <!-- Result Counter -->
          <div class="home-catalogue-status" style="font-size: 0.9rem; color: var(--text-muted); padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
            <div>Showing <strong id="products-count-label" style="color: var(--text-main);">${products.length}</strong> equipment models</div>
            <div style="font-size: 0.82rem; color: var(--text-faint);">
              Direct Manufacturer Supply • Custom Specifications Welcome
            </div>
          </div>
        </div>

        <!-- Product Grid (Auto-Fill MinMax 280px, Equal Height Cards) -->
        <div class="product-grid" id="catalogue-products-grid">
          ${products.map(p => renderProductCard(p)).join('')}
        </div>

        <!-- Empty State -->
        <div id="catalogue-empty-state" style="display: none; padding: 4rem 1rem; text-align: center;">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No matching instruments found</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your keyword or selecting a different category.</p>
          <button type="button" class="btn btn-primary" onclick="resetGridFilters()">Reset Filters</button>
        </div>
      </div>
    </section>

    <!-- Practical equipment selection notes, grounded in authoritative guidance -->
    <section class="section equipment-guidance">
      <div class="container guidance-panel">
        <div>
          <span class="section-eyebrow">Plan the right specification</span>
          <h2 class="section-title">Start with the process and the load</h2>
          <p class="section-desc">For sterilisation, choose a cycle around the material, packaging, load size and intended use. Temperature alone does not establish a successful cycle: steam contact, time at temperature, air removal and routine monitoring all matter.</p>
          <a class="guidance-source" href="https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/steam-sterilization.html" target="_blank" rel="noopener noreferrer">Read CDC steam sterilisation guidance ↗</a>
        </div>
        <ul class="guidance-checklist">
          <li>Tell us what you will process and approximate batch size.</li>
          <li>Confirm the cycle requirements with your validated protocol.</li>
          <li>Ask about chamber capacity, utilities, controls and documentation.</li>
        </ul>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="section home-cta-section">
      <div class="container home-cta-panel">
        <div class="home-cta-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
        <span class="section-eyebrow">A direct line to our team</span>
        <h2>Let’s find the right fit<br><em>for your laboratory.</em></h2>
        <p class="home-cta-copy">
          Share the product, capacity, operating range and electrical supply you need. Ask for the current model datasheet and configuration details.
        </p>
        <div class="flex justify-center flex-wrap gap-2">
          <button type="button" class="btn btn-whatsapp btn-lg" onclick="window.open('https://wa.me/919898457997?text=Hello%2C%20I%20would%20like%20to%20request%20a%20quotation%20for%20laboratory%20equipment.', '_blank')">
            ${whatsappIcon(19)} Chat on WhatsApp
          </button>
          <button type="button" class="btn btn-primary btn-lg" onclick="SSI_Enquiry.openQuoteModal('General Equipment Enquiry', '')">
            Request Formal Quotation
          </button>
          <a href="contact.html" class="btn btn-accent btn-lg">
            View contact details
          </a>
        </div>
      </div>
    </section>
  </main>
  `;

  fs.writeFileSync('index.html', getHead(
    "Sharma Scientific Instruments | Laboratory Equipment Manufacturer Ahmedabad",
    "Sharma Scientific Instruments (SSI) makes laboratory equipment in Ahmedabad, Gujarat, India. Explore autoclaves, BOD incubators, hot air ovens, humidity chambers and scientific instruments.",
    "",
    jsonLdScript(indexSchema)
  ) + getHeader("home") + body + getFooter());
  console.log("index.html generated.");
}

/* ==========================================================================
   2. BUILD ABOUT.HTML
   ========================================================================== */
function buildAbout() {
  const families = categories.map((c, i) => `
    <a class="family-card" href="products.html?category=${c.id}">
      <span class="family-index">0${i + 1}</span>
      <span class="family-copy"><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.description)}</small></span>
      <span class="family-arrow" aria-hidden="true">↗</span>
    </a>`).join('');
  const body = `
  <main id="main-content" class="page-shell page-about">
    <section class="page-hero about-hero">
      <div class="container page-hero-grid">
        <div class="page-hero-copy">
          <span class="eyebrow-pill"><span class="eyebrow-dot"></span> Sharma Scientific Instruments · Ahmedabad</span>
          <h1>Laboratory equipment,<br><em>made easier to choose.</em></h1>
          <p>Explore a practical catalogue of instruments for heating, incubation, sterilisation, sample preparation, clean-air work and temperature control.</p>
          <div class="page-hero-actions"><a class="btn btn-primary btn-lg" href="products.html">Explore the catalogue <span aria-hidden="true">↗</span></a><a class="text-link" href="contact.html">Talk through a requirement <span>→</span></a></div>
        </div>
        <div class="hero-feature-card about-feature-card">
          <span class="feature-kicker">A clearer starting point</span>
          <div class="feature-orbit"><img src="assets/img/products/bod-incubator.webp" alt="B.O.D. incubator from the product catalogue" loading="lazy"></div>
          <div class="feature-card-foot"><div><small>Browse by application</small><strong>Find a product family</strong></div><a href="products.html" aria-label="Browse product families">↗</a></div>
          <div class="feature-stamp"><strong>${products.length}</strong><span>catalogue<br>listings</span></div>
        </div>
      </div>
      <div class="page-hero-gridline" aria-hidden="true"></div>
    </section>

    <section class="page-stat-strip"><div class="container page-stat-grid"><div><strong>${products.length}</strong><span>Product listings</span></div><div><strong>${categories.length}</strong><span>Equipment families</span></div><p>Use the published brochure details as a guide, then confirm the exact configuration before ordering.</p></div></section>

    <section class="section page-section"><div class="container">
      <div class="section-intro-row"><div><span class="eyebrow-label">Inside the catalogue</span><h2>Built around the work<br>your lab needs to do.</h2></div><p>Every product page brings key catalogue information into one place—model identifiers, operating details, size options and accessories where those details are available.</p></div>
      <div class="family-list">${families}</div>
    </div></section>

    <section class="section process-band"><div class="container process-band-inner"><div class="process-band-heading"><span class="eyebrow-label">A straightforward enquiry</span><h2>From shortlist<br>to specification.</h2><p>Compare the published information, note your requirements and send one clear enquiry.</p><a class="btn btn-primary" href="products.html">Start browsing</a></div><div class="process-steps"><article><span>01</span><div><h3>Browse</h3><p>Search by instrument, category or application.</p></div></article><article><span>02</span><div><h3>Compare</h3><p>Review model details and shortlist up to three products.</p></div></article><article><span>03</span><div><h3>Confirm</h3><p>Ask for the current datasheet, configuration and delivery details.</p></div></article></div></div></section>
  </main>`;
  fs.writeFileSync('about.html', getHead("About | Sharma Scientific Instruments", "Explore the Sharma Scientific Instruments catalogue and the laboratory equipment families it covers.", "about.html") + getHeader("about") + body + getFooter());
  console.log("about.html generated.");
}

/* ==========================================================================
   3. BUILD PRODUCTS.HTML (CATALOGUE WITH LIVE SEARCH, FILTER & COMPARE)
   ========================================================================== */
function buildProducts() {
  const cardsHtml = products.map(p => {
    const category = categories.find(c => c.id === p.category);
    const search = [p.name, p.catalogueCode, p.categoryName, p.description, p.tagline, ...(p.chips || []), ...(p.applications || []), JSON.stringify(p.construction || {}), JSON.stringify(p.temperature || p.operatingSpecs || p.specifications || {}), JSON.stringify(p.sizes || p.models || [])].filter(Boolean).join(' ').toLowerCase();
    const code = p.catalogueCode || 'S.S.I. Make';
    const chips = (p.chips || []).slice(0, 3).map(chip => `<span class="catalogue-spec-pill">${escapeHtml(chip)}</span>`).join('');
    const datasheet = p.pdfUrl
      ? `<a class="catalogue-secondary-link" href="${escapeHtml(p.pdfUrl)}" download aria-label="Download ${escapeHtml(p.name)} datasheet PDF">Datasheet <span aria-hidden="true">↓</span></a>`
      : `<button class="catalogue-secondary-link" type="button" onclick="SSI_Enquiry.openDatasheet('${escapeHtml(p.id)}')">Datasheet <span aria-hidden="true">↗</span></button>`;
    const jsString = value => JSON.stringify(value).replace(/'/g, '\\u0027');
    const quoteCall = `SSI_Enquiry.openQuoteModal(${jsString(p.name)}, ${jsString(code)})`;
    return `
      <article class="catalogue-card" data-id="${escapeHtml(p.id)}" data-category="${escapeHtml(p.category)}" data-search="${escapeHtml(search)}">
        <div class="catalogue-card-media"><a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="View ${escapeHtml(p.name)} details"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='${escapeHtml(p.imageFallback || p.image)}'"></a><label class="compare-toggle"><input type="checkbox" class="compare-checkbox" value="${escapeHtml(p.id)}" onchange="toggleCompare(this)"><span>Compare</span></label><span class="catalogue-image-caption">Product image</span></div>
        <div class="catalogue-card-body"><div class="catalogue-card-kicker"><span class="catalogue-category-badge">${escapeHtml(p.categoryName || (category && category.name) || 'Laboratory equipment')}</span><span class="catalogue-model-code">${escapeHtml(code)}</span></div><h2><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h2><p class="catalogue-card-description">${escapeHtml(p.tagline || p.description || 'Ask for current model details.')}</p><div class="catalogue-spec-pills">${chips || '<span class="catalogue-spec-pill">Specifications available on enquiry</span>'}</div><div class="catalogue-card-actions"><button type="button" class="btn btn-primary catalogue-quote-button" onclick='${quoteCall}'>Request Quote</button><div class="catalogue-secondary-actions">${datasheet}<a class="catalogue-secondary-link catalogue-details-link" href="product.html?id=${encodeURIComponent(p.id)}">View details <span aria-hidden="true">→</span></a></div></div></div>
      </article>`;
  }).join('');
  const categoryFilters = categories.map(c => `<button type="button" class="catalogue-filter" data-filter="${escapeHtml(c.id)}" aria-pressed="false" onclick="setCatalogueFilter('${escapeHtml(c.id)}',this)">${escapeHtml(c.name)}<span>${c.count}</span></button>`).join('');
  const body = `
  <main id="main-content" class="page-shell page-products">
    <section class="page-hero catalogue-hero"><div class="container catalogue-hero-layout"><div><span class="eyebrow-pill"><span class="eyebrow-dot"></span> Product catalogue · ${categories.length} equipment families</span><h1>Find the right<br><em>instrument for the job.</em></h1><p>Search the catalogue, narrow by equipment family and compare product details before sending an enquiry.</p><div class="catalogue-hero-facts"><span><strong>${products.length}</strong> catalogue listings</span><span><strong>${categories.length}</strong> product families</span></div></div><div class="catalogue-hero-art"><div class="hero-art-ring hero-art-ring-one"></div><div class="hero-art-ring hero-art-ring-two"></div><img src="assets/img/products/hot-air-oven-ss.webp" alt="Hot air oven from the product catalogue" loading="lazy"><div class="hero-art-label"><span>Browse instruments</span><strong>By name. By need.</strong></div></div></div></section>
    <section class="catalogue-workspace"><div class="container">
      <div class="catalogue-toolbar"><div class="catalogue-search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input id="catalogue-search" type="search" aria-label="Search product catalogue" placeholder="Search products, codes or applications…" autocomplete="off" oninput="applyCatalogueFilters()"><kbd aria-hidden="true">Ctrl / ⌘ K</kbd></div><label class="catalogue-sort-label" for="catalogue-sort">Sort <select id="catalogue-sort" onchange="sortCatalogue()"><option value="default">Recommended</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option></select></label></div>
      <div class="catalogue-filter-row"><button type="button" class="catalogue-filter active" data-filter="all" aria-pressed="true" onclick="setCatalogueFilter('all',this)">All products<span>${products.length}</span></button>${categoryFilters}<button type="button" class="filter-reset" onclick="resetCatalogueFilters()">Reset</button></div>
      <div class="catalogue-results-line" aria-live="polite"><p><strong id="catalogue-count">${products.length}</strong> products <span id="catalogue-context">in the complete catalogue</span></p><p>Compare up to 3 models</p></div>
      <div class="catalogue-grid" id="catalogue-grid">${cardsHtml}</div>
      <div class="catalogue-empty" id="catalogue-empty" role="status" hidden><span aria-hidden="true">⌕</span><h2>No matching products</h2><p>Try a shorter search or choose a different category.</p><button class="btn btn-secondary" onclick="resetCatalogueFilters()">Clear filters</button></div>
    </div></section>
    <div class="compare-dock" id="compare-dock" hidden><span><strong id="compare-count">0</strong> selected <small>Choose up to three</small></span><div><button type="button" class="compare-clear" onclick="clearComparison()">Clear</button><button type="button" class="btn btn-primary" onclick="openComparison()">Compare models <span>→</span></button></div></div>
    <div class="compare-overlay" id="compare-overlay" aria-hidden="true" onclick="if(event.target===this)closeComparison()"><section class="compare-dialog" role="dialog" aria-modal="true" aria-labelledby="compare-title" tabindex="-1"><div class="compare-dialog-head"><div><span class="eyebrow-label">Side-by-side</span><h2 id="compare-title">Compare products</h2></div><button type="button" class="compare-close" aria-label="Close comparison" onclick="closeComparison()">×</button></div><div class="compare-table-wrap" id="compare-content"></div></section></div>
    <section class="catalogue-help"><div class="container catalogue-help-inner"><div><span class="eyebrow-label">Need a precise match?</span><h2>Bring your requirements.<br>We’ll help you shortlist.</h2><p>Share your process, capacity, operating range and electrical supply when you enquire.</p></div><a class="btn btn-light" href="contact.html">Send an enquiry <span>↗</span></a></div></section>
  </main>
  <script>
  let activeCatalogueFilter='all';let selectedForCompare=[];let comparisonOpener=null;const catalogueDefaultOrder=Array.from(document.querySelectorAll('.catalogue-card'));
  function applyCatalogueFilters(){const query=(document.getElementById('catalogue-search').value||'').trim().toLowerCase();let visible=0;document.querySelectorAll('.catalogue-card').forEach(card=>{const match=(activeCatalogueFilter==='all'||card.dataset.category===activeCatalogueFilter)&&(!query||card.dataset.search.includes(query));card.hidden=!match;if(match)visible++;});document.getElementById('catalogue-count').textContent=visible;const activeButton=Array.from(document.querySelectorAll('.catalogue-filter')).find(el=>el.dataset.filter===activeCatalogueFilter);const family=activeButton?activeButton.firstChild.textContent.trim():'this family';document.getElementById('catalogue-context').textContent=query?'matching your search':activeCatalogueFilter==='all'?'in the complete catalogue':'in '+family;document.getElementById('catalogue-empty').hidden=visible>0;}
  function setCatalogueFilter(key,button){activeCatalogueFilter=key;document.querySelectorAll('.catalogue-filter').forEach(el=>{const active=el===button;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});applyCatalogueFilters();}
  function resetCatalogueFilters(){document.getElementById('catalogue-search').value='';setCatalogueFilter('all',document.querySelector('.catalogue-filter[data-filter="all"]'));document.getElementById('catalogue-sort').value='default';sortCatalogue();}
  function sortCatalogue(){const grid=document.getElementById('catalogue-grid');const cards=Array.from(grid.children);const order=document.getElementById('catalogue-sort').value;if(order==='default')cards.sort((a,b)=>catalogueDefaultOrder.indexOf(a)-catalogueDefaultOrder.indexOf(b));else cards.sort((a,b)=>{const n=a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);return order==='az'?n:-n;});cards.forEach(card=>grid.appendChild(card));}
  function toggleCompare(input){const id=input.value;if(input.checked&&selectedForCompare.length>=3){input.checked=false;SSI_Enquiry.showToast('Compare up to three models at a time.');return;}selectedForCompare=input.checked?selectedForCompare.concat(id):selectedForCompare.filter(x=>x!==id);const dock=document.getElementById('compare-dock');dock.hidden=!selectedForCompare.length;document.getElementById('compare-count').textContent=selectedForCompare.length;}
  function clearComparison(){selectedForCompare=[];document.querySelectorAll('.compare-checkbox').forEach(el=>el.checked=false);document.getElementById('compare-dock').hidden=true;}
  function closeComparison(){const overlay=document.getElementById('compare-overlay');if(!overlay.classList.contains('open'))return;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('comparison-open');if(comparisonOpener&&comparisonOpener.isConnected)comparisonOpener.focus();}
  function escapeCompare(value){return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function openComparison(){if(!selectedForCompare.length)return;comparisonOpener=document.activeElement;fetch('products.json').then(r=>{if(!r.ok)throw new Error('Catalogue unavailable');return r.json();}).then(data=>{const items=data.products.filter(p=>selectedForCompare.includes(p.id));const rows=[['Category',p=>p.categoryName],['Catalogue code',p=>p.catalogueCode||'—'],['Overview',p=>p.tagline||p.description],['Operating details',p=>{const t=p.temperature||p.operatingSpecs||p.specifications;if(typeof t==='string')return t;return t?Object.entries(t).map(([k,v])=>k+': '+(typeof v==='object'?JSON.stringify(v):v)).join(' · '):'Ask supplier for current model details.'}],['Published sizes',p=>p.sizes?JSON.stringify(p.sizes):p.models?JSON.stringify(p.models):'Ask supplier for current model sizes.']];let html='<table><thead><tr><th scope="col">Detail</th>'+items.map(p=>'<th scope="col">'+escapeCompare(p.name)+'</th>').join('')+'</tr></thead><tbody>';rows.forEach(row=>{html+='<tr><th scope="row">'+escapeCompare(row[0])+'</th>'+items.map(p=>'<td>'+escapeCompare(row[1](p))+'</td>').join('')+'</tr>';});html+='<tr><th scope="row">Next step</th>'+items.map(p=>'<td><a class="btn btn-primary" href="product.html?id='+encodeURIComponent(p.id)+'">View details →</a></td>').join('')+'</tr></tbody></table>';document.getElementById('compare-content').innerHTML=html;const overlay=document.getElementById('compare-overlay');overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('comparison-open');document.querySelector('.compare-dialog').focus();}).catch(()=>SSI_Enquiry.showToast('Unable to load comparison details. Please try again.'));}
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('catalogue-search').focus();}if(e.key==='Escape')closeComparison();});
  const categoryParam=new URLSearchParams(location.search).get('category');if(categoryParam){const button=Array.from(document.querySelectorAll('.catalogue-filter')).find(el=>el.dataset.filter===categoryParam);if(button)setCatalogueFilter(categoryParam,button);}
  </script>`;
  const schema={"@context":"https://schema.org","@type":"CollectionPage","name":"Laboratory Equipment Catalogue | Sharma Scientific Instruments","description":"Browse laboratory equipment by product family and compare catalogue details.","mainEntity":{"@type":"ItemList","numberOfItems":products.length,"itemListElement":products.map((p,i)=>({"@type":"ListItem","position":i+1,"name":p.name,"url":"https://sharmascientificinstruments.in/product.html?id="+p.id}))}};
  fs.writeFileSync('products.html',getHead("Products | Sharma Scientific Instruments",`${products.length} laboratory equipment listings across ${categories.length} product families. Search, filter and compare catalogue details.`,"products.html",jsonLdScript(schema))+getHeader("products")+body+getFooter());
  console.log("products.html generated.");
}

/* ==========================================================================
   4. BUILD PRODUCT.HTML (DYNAMIC SPECIFICATION & STUDIO PHOTOGRAPHY SHOWCASE)
   ========================================================================== */
function buildProductDetail() {
  const productDetailSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Laboratory Equipment by Sharma Scientific Instruments",
    "description": "Detailed technical specifications, construction details, and studio photography for Sharma Scientific Instruments equipment.",
    "brand": {
      "@type": "Brand",
      "name": "SSI"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Sharma Scientific Instruments"
    },

  };

  const body = `
  <main id="main-content">
    <!-- Breadcrumbs -->
    <div style="background: var(--bg-subtle); border-bottom: 1px solid var(--border-color); padding: 0.85rem 0;">
      <div class="container">
        <nav aria-label="Breadcrumb" style="font-size: 0.85rem; color: var(--text-muted);">
          <a href="index.html">Home</a> &rsaquo; 
          <a href="products.html">Equipment</a> &rsaquo; 
          <span id="breadcrumb-category">Category</span> &rsaquo; 
          <span id="breadcrumb-product" style="color: var(--text-main); font-weight: 700;">Product Detail</span>
        </nav>
      </div>
    </div>

    <!-- Product Showcase Section -->
    <section class="section">
      <div class="container product-detail-grid">
        <!-- Left: Studio Photography Stage -->
        <div>
          <div class="product-studio-stage">
            <img id="detail-product-img" src="" alt="Product image" class="product-studio-img">
            <span class="image-caption">Catalogue product image</span>
          </div>
          <div class="flex items-center justify-center gap-2 mt-3" style="font-size: 0.82rem; color: var(--text-muted);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>Image shown for product identification; confirm the current model configuration when enquiring.</span>
          </div>
        </div>

        <!-- Right: Technical Details & Procurement Actions -->
        <div class="product-info-panel">
          <div class="product-meta-strip">
            <span id="detail-category-badge" class="product-card-cat" style="margin-bottom:0;">Category</span>
            <span id="detail-code-badge" class="product-code-pill">Code</span>
            <span class="detail-catalogue-label">Catalogue listing</span>
          </div>

          <h1 id="detail-product-name">Instrument Name</h1>
          <p id="detail-tagline" style="font-size: 1.15rem; font-weight: 600; color: var(--color-primary); margin-bottom: 1rem;">
            Precision Tagline
          </p>
          <p id="detail-description" class="product-detail-lead">
            Description
          </p>

          <div id="detail-highlight-list" class="detail-highlight-list" aria-label="Key product specifications"></div>

          <!-- Procurement Action Box -->
          <div class="procurement-action-card">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.85rem; font-weight: 800;">Procurement & Quotation Options</h4>
            <div class="procurement-btns">
              <button type="button" class="btn btn-primary btn-lg" onclick="requestCurrentQuote()">
                Request Official Quotation
              </button>
          <a id="btn-detail-whatsapp" href="contact.html" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg" aria-label="Ask about this product on WhatsApp">
                Direct WhatsApp Quote
              </a>
          <a id="btn-detail-datasheet" href="products.html" target="_blank" rel="noopener" class="btn btn-secondary btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                Download Datasheet (PDF)
              </a>
            </div>
            <div class="flex items-center gap-2 procurement-helper" style="font-size: 0.85rem; color: var(--text-muted);">
              <span>Need a tailored configuration?</span>
              <button type="button" onclick="requestCurrentQuote()" style="padding:0;border:0;background:none;color:var(--color-primary);font:inherit;font-weight:700;text-decoration:underline;cursor:pointer;">Request a quotation</button>
            </div>
          </div>

          <div class="detail-note">
            Specifications shown here are transcribed from available catalogue literature. Ask for the current model datasheet, configuration, supply voltage and delivery details before ordering.
          </div>
        </div>
      </div>
    </section>

    <!-- Deep Technical Specifications & Details -->
    <section class="section" style="background: var(--bg-card); border-top: 1px solid var(--border-color);">
      <div class="container">
        <div class="text-center" style="max-width: 700px; margin: 0 auto 3rem;">
          <span class="section-eyebrow">Engineering Specifications</span>
          <h2 class="section-title">Technical specifications</h2>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Construction Details -->
          <div>
            <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-navy); font-weight: 800;">Construction & finish</h3>
            <div class="table-responsive">
              <table class="table-custom">
                <tbody id="specs-construction-tbody">
                  <!-- Dynamically populated -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Temperature & Control Details -->
          <div>
            <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-navy); font-weight: 800;">Operating specifications</h3>
            <div class="table-responsive">
              <table class="table-custom">
                <tbody id="specs-temperature-tbody">
                  <!-- Dynamically populated -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div id="section-additional-specs" class="additional-specs-panel" style="margin-top:3rem;display:none;">
          <h3 class="section-title" style="font-size:1.25rem;margin-bottom:1rem;">Additional technical information</h3>
          <div id="grid-additional-specs" class="additional-specs-grid"></div>
        </div>

        <!-- Working Sizes & Ratings Table -->
        <div id="section-sizes-table" style="margin-top: 3rem; display: none;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-navy); font-weight: 800;">Published models & dimensions</h3>
          <div class="table-responsive">
            <table class="table-custom" id="table-working-sizes">
              <!-- Sizes table -->
            </table>
          </div>
        </div>

        <!-- Optional Accessories & Attachments -->
        <div id="section-accessories" style="margin-top: 3rem; display: none;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-navy); font-weight: 800;">Optional accessories</h3>
          <ul id="list-accessories" style="list-style: disc; padding-left: 1.5rem; color: var(--text-muted); line-height: 1.8;">
            <!-- Accessories -->
          </ul>
        </div>

        <!-- Typical Applications -->
        <div id="section-applications" style="margin-top: 3rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-navy); font-weight: 800;">Typical Laboratory Applications</h3>
          <div id="grid-applications" class="grid grid-cols-2 gap-2">
            <!-- Applications pills -->
          </div>
        </div>
      </div>
    </section>

    <!-- Related Products -->
    <section class="section" style="background: var(--bg-subtle);">
      <div class="container">
        <h3 style="font-size: 1.5rem; margin-bottom: 2rem; font-weight: 800;">Related Instruments</h3>
        <div id="related-products-grid" class="grid grid-cols-3">
          <!-- Populated in JS -->
        </div>
      </div>
    </section>

    <!-- Mobile Sticky RFQ Bar -->
    <div class="sticky-rfq-bar">
      <div class="sticky-rfq-inner">
        <div>
          <span id="sticky-prod-name" style="font-weight: 700; font-size: 0.92rem; display: block; line-height: 1.2;">Instrument</span>
          <span id="sticky-prod-code" style="font-size: 0.75rem; color: var(--text-muted);">SSI</span>
        </div>
        <div class="flex items-center gap-1 sticky-product-actions">
          <a href="contact.html" id="sticky-prod-whatsapp" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" aria-label="Message about this product on WhatsApp">WhatsApp</a>
          <button type="button" class="btn btn-primary btn-sm" onclick="requestCurrentQuote()">Quote</button>
        </div>
      </div>
    </div>
  </main>

  <script>
  let currentProduct = null;

  document.addEventListener('DOMContentLoaded', function () {
    fetch('products.json')
      .then(res => { if (!res.ok) throw new Error('Catalogue data could not be loaded.'); return res.json(); })
      .then(data => {
        const urlParams = new URLSearchParams(window.location.search);
        const prodId = urlParams.get('id') || 'bod-incubator';
        currentProduct = data.products.find(p => p.id === prodId);
        if (!currentProduct) {
          document.title = 'Product not found | Sharma Scientific Instruments';
          document.getElementById('detail-product-name').textContent = 'Product not found';
          document.getElementById('detail-tagline').textContent = 'This catalogue link may be outdated.';
          document.getElementById('detail-description').textContent = 'Browse the product catalogue to find current models and specifications.';
          document.getElementById('detail-description').insertAdjacentHTML('afterend', '<a class="btn btn-primary" href="products.html" style="width:max-content;margin-top:.75rem">Browse all products →</a>');
          document.querySelector('.product-info-panel .procurement-action-card').hidden = true;
          document.querySelector('.sticky-rfq-bar').hidden = true;
          return;
        }
        renderProductDetail(currentProduct, data.products);
      })
      .catch(() => {
        document.title = 'Product details unavailable | Sharma Scientific Instruments';
        document.getElementById('detail-product-name').textContent = 'Product details unavailable';
        document.getElementById('detail-tagline').textContent = 'The catalogue could not be loaded.';
        document.getElementById('detail-description').textContent = 'Please try again or browse the product catalogue to find equipment and request current information.';
        document.getElementById('detail-description').setAttribute('role', 'alert');
        document.querySelector('.product-info-panel .procurement-action-card').hidden = true;
        document.querySelector('.sticky-rfq-bar').hidden = true;
      });
  });

  function renderProductDetail(p, allProds) {
    const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    document.title = p.name + " | Sharma Scientific Instruments Ahmedabad";
    document.getElementById('breadcrumb-category').textContent = p.categoryName;
    document.getElementById('breadcrumb-product').textContent = p.name;

    document.getElementById('detail-category-badge').textContent = p.categoryName;
    document.getElementById('detail-code-badge').textContent = p.catalogueCode || 'S.S.I. Standard';
    document.getElementById('detail-product-name').textContent = p.name;
    document.getElementById('detail-tagline').textContent = p.tagline || 'Product details and configuration available on enquiry';
    document.getElementById('detail-description').textContent = p.description;
    const highlightList = document.getElementById('detail-highlight-list');
    highlightList.innerHTML = (p.chips || []).slice(0, 3).map((chip, index) => '<div class="detail-highlight"><span>0' + (index + 1) + '</span><strong>' + escapeHtml(chip) + '</strong></div>').join('');
    const datasheetLink = document.getElementById('btn-detail-datasheet');
    if (p.pdfUrl) { datasheetLink.href = p.pdfUrl; datasheetLink.setAttribute('download', ''); }
    else { datasheetLink.href = 'products.html'; datasheetLink.addEventListener('click', function(event) { event.preventDefault(); SSI_Enquiry.openDatasheet(p.id); }); }

    document.getElementById('sticky-prod-name').textContent = p.name;
    document.getElementById('sticky-prod-code').textContent = p.catalogueCode || 'SSI Make';

    // WhatsApp link setup
    const waText = encodeURIComponent(\`*ENQUIRY: \${p.name}* [\${p.catalogueCode || 'Standard'}]\\nPlease share technical specification and price quotation.\`);
    document.getElementById('btn-detail-whatsapp').href = \`https://wa.me/919898457997?text=\${waText}\`;
    document.getElementById('sticky-prod-whatsapp').href = \`https://wa.me/919898457997?text=\${waText}\`;

    // Studio Product Image
    const photoImg = document.getElementById('detail-product-img');
    photoImg.alt = p.name + ' laboratory instrument';
    photoImg.src = p.image;
    photoImg.onerror = function() { this.src = p.imageFallback || p.image; };

    const labelFor = key => String(key).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, c => c.toUpperCase());
    const rowsFor = obj => {
      if (obj == null) return [];
      if (typeof obj !== 'object' || Array.isArray(obj)) return [['Details', obj]];
      return Object.entries(obj).filter(([,v]) => v !== null && v !== undefined && typeof v !== 'object').map(([k,v]) => [labelFor(k), v]);
    };
    const renderRows = rows => rows.length
      ? rows.map(([k,v]) => '<tr><th>' + escapeHtml(k) + '</th><td>' + escapeHtml(v) + '</td></tr>').join('')
      : '<tr><td colspan="2">Ask us for current model details.</td></tr>';

    const constBody = document.getElementById('specs-construction-tbody');
    constBody.innerHTML = renderRows(rowsFor(p.construction));

    const tempBody = document.getElementById('specs-temperature-tbody');
    const primaryOperating = p.temperature || p.operatingSpecs || p.specifications || p.humidity || p.refrigeration || p.coolingHeating || p.heating;
    tempBody.innerHTML = renderRows(rowsFor(primaryOperating));

    // Sizes Table
    const dimensionUnit = ['laboratory-furnace', 'oven-and-incubator-combined', 'seed-germinator'].includes(p.id) ? 'mm' : 'cm';
    const sizeLabel = key => ({
      h: 'Height (' + dimensionUnit + ')', w: 'Width (' + dimensionUnit + ')', d: 'Depth (' + dimensionUnit + ')',
      l: 'Length (' + dimensionUnit + ')', dia: 'Diameter (cm)', kw: 'Power', cap: 'Capacity', model: 'Model'
    })[key] || labelFor(key);
    const sizesSec = document.getElementById('section-sizes-table');
    const sizesTable = document.getElementById('table-working-sizes');
    if (p.sizes && Array.isArray(p.sizes)) {
      sizesSec.style.display = 'block';
      const keys = Object.keys(p.sizes[0]);
      sizesTable.innerHTML = \`
        <thead>
          <tr>
            \${keys.map(k => \`<th>\${escapeHtml(sizeLabel(k))}</th>\`).join('')}
          </tr>
        </thead>
        <tbody>
          \${p.sizes.map(row => \`
            <tr>
              \${keys.map(k => \`<td>\${row[k]}</td>\`).join('')}
            </tr>
          \`).join('')}
        </tbody>
      \`;
    } else if (p.models && Array.isArray(p.models)) {
      sizesSec.style.display = 'block';
      const keys = Object.keys(p.models[0]);
      sizesTable.innerHTML = \`
        <thead>
          <tr>\${keys.map(k => \`<th>\${escapeHtml(sizeLabel(k))}</th>\`).join('')}</tr>
        </thead>
        <tbody>
          \${p.models.map(row => \`<tr>\${keys.map(k => \`<td>\${row[k]}</td>\`).join('')}</tr>\`).join('')}
        </tbody>
      \`;
    }

    // Render additional brochure fields not already represented in the main tables.
    const primaryKey = p.temperature ? 'temperature' : p.operatingSpecs ? 'operatingSpecs' : p.specifications ? 'specifications' : p.humidity ? 'humidity' : p.refrigeration ? 'refrigeration' : p.coolingHeating ? 'coolingHeating' : p.heating ? 'heating' : '';
    const shownKeys = new Set(['construction', primaryKey, 'sizes', 'models', 'optionalAccessories', 'applications', 'description', 'tagline', 'chips', 'image', 'imageFallback', 'pdfUrl', 'category', 'categoryName', 'id', 'name', 'catalogueCode', 'featured', 'model3d', 'hasExplodedView', 'hasDoorAnimation', 'industries']);
    const extra = Object.entries(p).filter(([key, value]) => !shownKeys.has(key) && value != null && (typeof value === 'string' || typeof value === 'number' || (typeof value === 'object' && !Array.isArray(value))));
    const extraSection = document.getElementById('section-additional-specs');
    const extraGrid = document.getElementById('grid-additional-specs');
    if (extra.length) {
      extraSection.style.display = 'block';
      extraGrid.innerHTML = extra.map(([key, value]) => {
        const entries = rowsFor(value);
        const content = entries.map(([label, val]) => '<div class="additional-spec-row"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(val) + '</strong></div>').join('');
        return '<article class="additional-spec-card"><h4>' + escapeHtml(labelFor(key)) + '</h4>' + content + '</article>';
      }).join('');
    }

    // Accessories
    const accSec = document.getElementById('section-accessories');
    const accList = document.getElementById('list-accessories');
    if (p.optionalAccessories && p.optionalAccessories.length > 0) {
      accSec.style.display = 'block';
      accList.innerHTML = p.optionalAccessories.map(a => \`<li>\${a}</li>\`).join('');
    }

    // Applications
    const appGrid = document.getElementById('grid-applications');
    if (p.applications && p.applications.length > 0) {
      appGrid.innerHTML = p.applications.map(app => \`
        <div style="background: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.9rem; color: var(--text-main); border: 1px solid var(--border-color);">
          &bull; \${app}
        </div>
      \`).join('');
    }

    // Related Products
    const relGrid = document.getElementById('related-products-grid');
    const related = allProds.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3);
    relGrid.innerHTML = related.map(r => \`
      <div class="product-card">
        <div class="product-photo-box" style="height: 180px;">
          <img src="\${r.image}" alt="\${r.name}" class="product-photo-img" style="max-height: 150px;" loading="lazy">
        </div>
        <div class="product-card-body">
          <span class="product-card-cat">\${r.categoryName}</span>
          <h4 class="product-card-title" style="font-size: 1.05rem;">\${r.name}</h4>
          <p class="product-card-desc">\${r.tagline || ''}</p>
          <a href="product.html?id=\${r.id}" class="btn btn-secondary btn-sm w-100">View Specifications</a>
        </div>
      </div>
    \`).join('');

    // Dynamic Product JSON-LD Injection
    let prodLd = document.getElementById('dynamic-product-jsonld');
    if (!prodLd) {
      prodLd = document.createElement('script');
      prodLd.id = 'dynamic-product-jsonld';
      prodLd.type = 'application/ld+json';
      document.head.appendChild(prodLd);
    }
    prodLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": p.name,
      "image": "https://sharmascientificinstruments.in/" + p.image,
      "description": p.description,
      "sku": p.catalogueCode || p.id,
      "category": p.categoryName,
      "brand": {
        "@type": "Brand",
        "name": "SSI"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Sharma Scientific Instruments"
      },
    });
  }

  function requestCurrentQuote() {
    if (currentProduct) {
      SSI_Enquiry.openQuoteModal(currentProduct.name, currentProduct.catalogueCode || '');
    }
  }

  </script>
  `;

  fs.writeFileSync('product.html', getHead(
    "Laboratory Equipment Specs | Sharma Scientific Instruments Ahmedabad",
    "Detailed technical specifications, construction details, and studio photography for Sharma Scientific Instruments equipment.",
    "product.html",
    jsonLdScript(productDetailSchema)
  ) + getHeader("products") + body + getFooter());
  console.log("product.html generated.");
}

/* ==========================================================================
   5. BUILD QUALITY.HTML
   ========================================================================== */
function buildQuality() {
  const steps=[
    {n:'01',title:'Describe the process',text:'What material will you process? Include load dimensions, batch size, packaging and whether samples are liquid, porous, heat-sensitive or exposed to chemicals.'},
    {n:'02',title:'Set measurable limits',text:'State the working range, allowable variation, capacity and recovery expectations. Identify whether you need a timer, circulation, humidity control or a specific display.'},
    {n:'03',title:'Check the installation',text:'Confirm available power, water, drainage, exhaust, ventilation and bench or floor space. Include access dimensions for delivery.'},
    {n:'04',title:'Confirm evidence and service',text:'Request the current datasheet, included accessories, warranty, calibration or mapping records, installation support and delivery terms.'}
  ];
  const stepHtml=steps.map(s=>`<article class="spec-step"><span class="spec-step-no">${s.n}</span><div><h3>${s.title}</h3><p>${s.text}</p></div><span class="spec-step-mark">↗</span></article>`).join('');
  const body=`
  <main id="main-content" class="page-shell page-quality">
    <section class="page-hero quality-hero"><div class="container quality-hero-layout"><div><span class="eyebrow-pill"><span class="eyebrow-dot"></span> Selection & verification guide</span><h1>Good specifications<br><em>start with good questions.</em></h1><p>Use this checklist to turn your process needs into a clear equipment enquiry. The catalogue describes listed models; confirm the final specification and documentation with the supplier.</p><a class="btn btn-primary btn-lg" href="contact.html">Build your enquiry <span>↗</span></a></div><div class="quality-hero-panel"><span class="panel-overline">Before you request a quote</span><div class="quality-meter"><span>Process</span><b>→</b><span>Requirements</span><b>→</b><span>Model</span></div><div class="quality-panel-rule"></div><p>A temperature range alone may not define a suitable instrument. Consider the sample, load, environment and procedure.</p><a href="products.html">Browse the catalogue <span>↗</span></a></div></div></section>
    <section class="section page-section"><div class="container quality-content"><div class="quality-section-intro"><span class="eyebrow-label">Four things to confirm</span><h2>Make the enquiry<br>specific and useful.</h2><p>A well-scoped request helps both sides identify the right model and spot missing requirements early.</p></div><div class="spec-step-list">${stepHtml}</div></div></section>
    <section class="reference-note"><div class="container reference-note-inner"><div class="reference-icon">i</div><div><span class="eyebrow-label">Sterilisation reference</span><h2>Cycle suitability depends on the load.</h2><p>CDC guidance describes steam, pressure, temperature and time as process parameters, with cycle selection affected by the load and sterilizer type. Follow your validated procedure and ask for model-specific documentation.</p><a href="https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/steam-sterilization.html" target="_blank" rel="noopener noreferrer">Read CDC steam sterilization guidance ↗</a></div></div></section>
    <section class="catalogue-help"><div class="container catalogue-help-inner"><div><span class="eyebrow-label">Make your shortlist</span><h2>Know your requirements?<br>Let’s find a starting point.</h2><p>Browse by instrument family or send your application details directly.</p></div><a class="btn btn-light" href="products.html">Explore equipment <span>↗</span></a></div></section>
  </main>`;
  const schema={"@context":"https://schema.org","@type":"WebPage","name":"Equipment Selection Guide | Sharma Scientific Instruments","description":"A practical checklist for specifying laboratory equipment."};
  fs.writeFileSync('quality.html',getHead("Selection Guide | Sharma Scientific Instruments","A practical guide to describing process, operating range, installation and documentation needs when selecting laboratory equipment.","quality.html",jsonLdScript(schema))+getHeader("quality")+body+getFooter());
  console.log("quality.html generated.");
}

/* ==========================================================================
   6. BUILD INDUSTRIES.HTML
   ========================================================================== */
function buildIndustries() {
  const industries=[
    {num:'01',title:'Pharmaceutical & biotechnology',body:'Explore catalogue equipment used in temperature and humidity conditioning, incubation, drying and sterilisation workflows.',tags:['Humidity chambers','Bacteriological incubators','Vacuum ovens'],cat:'incubation-climate',tint:'sage'},
    {num:'02',title:'Microbiology & pathology',body:'Browse instruments for culture work, clean-air handling, colony counting and media preparation.',tags:['B.O.D. incubators','Laminar air flow','Colony counters'],cat:'counting-microbiology',tint:'sand'},
    {num:'03',title:'Food, beverage & dairy',body:'Find equipment for controlled heating, sample preparation and chemical oxygen demand digestion.',tags:['Water baths','COD digestion','Hot air ovens'],cat:'sample-prep-extraction',tint:'peach'},
    {num:'04',title:'Agriculture & seed science',body:'Review catalogue options for seed germination, low-temperature incubation and high-temperature ashing.',tags:['Seed germinators','Low-temperature baths','Muffle furnaces'],cat:'incubation-climate',tint:'lavender'},
    {num:'05',title:'Universities & research',body:'Browse bench and chamber equipment for teaching laboratories and experimental workflows.',tags:['Magnetic stirrers','Melting point apparatus','Water stills'],cat:'heating-drying',tint:'blue'},
    {num:'06',title:'Textile & materials testing',body:'See catalogue instruments for small-batch dyeing, drying and heat-treatment processes.',tags:['Rota dyers','Tray dryers','Hot plates'],cat:'sample-prep-extraction',tint:'mint'}
  ];
  const cards=industries.map(item=>`<article class="application-card application-${item.tint}"><div class="application-card-top"><span>${item.num} / APPLICATION AREA</span><span class="application-glyph" aria-hidden="true">✳</span></div><h2>${item.title}</h2><p>${item.body}</p><div class="application-tags">${item.tags.map(tag=>`<span>${tag}</span>`).join('')}</div><a href="products.html?category=${item.cat}" class="application-link">Browse related equipment <span>↗</span></a></article>`).join('');
  const body=`
  <main id="main-content" class="page-shell page-industries">
    <section class="page-hero industries-hero"><div class="container industries-hero-layout"><div><span class="eyebrow-pill"><span class="eyebrow-dot"></span> Applications from the catalogue</span><h1>Equipment for the<br><em>work you do.</em></h1><p>Explore product families through common laboratory and industrial workflows. These are catalogue examples—not endorsements of application suitability.</p><a class="btn btn-primary btn-lg" href="products.html">Browse all equipment <span>↗</span></a></div><div class="application-hero-art"><div class="application-orbit"></div><div class="application-orbit application-orbit-small"></div><span class="application-art-label application-label-top">HEATING</span><span class="application-art-label application-label-side">INCUBATION</span><span class="application-art-label application-label-bottom">PREPARATION</span><div class="application-art-core">SSI<small>LAB EQUIPMENT</small></div></div></div></section>
    <section class="section page-section"><div class="container"><div class="section-intro-row"><div><span class="eyebrow-label">Explore by workflow</span><h2>Start with your<br>application area.</h2></div><p>Each group links to the closest catalogue family. Open a product page to review its published model information, then confirm suitability for your process.</p></div><div class="application-grid">${cards}</div></div></section>
    <section class="application-footnote"><div class="container"><span>Important</span><p>Application examples help you browse. They do not establish regulatory compliance, method validation or fitness for a particular process. Confirm requirements and documentation before purchase.</p><a href="quality.html">Read the selection guide →</a></div></section>
    <section class="catalogue-help"><div class="container catalogue-help-inner"><div><span class="eyebrow-label">Have a specific process?</span><h2>Tell us what the instrument needs to do.</h2><p>Include the sample, capacity, operating range and site utilities in your enquiry.</p></div><a class="btn btn-light" href="contact.html">Contact us <span>↗</span></a></div></section>
  </main>`;
  const schema={"@context":"https://schema.org","@type":"WebPage","name":"Applications | Sharma Scientific Instruments","description":"Explore laboratory equipment categories by common applications."};
  fs.writeFileSync('industries.html',getHead("Applications | Sharma Scientific Instruments","Explore laboratory equipment by common workflow, from microbiology and research to food, seed and textile applications.","industries.html",jsonLdScript(schema))+getHeader("industries")+body+getFooter());
  console.log("industries.html generated.");
}

/* ==========================================================================
   7. BUILD CONTACT.HTML
   ========================================================================== */
function buildContact() {
  const body=`
  <main id="main-content" class="page-shell page-contact">
    <section class="page-hero contact-hero"><div class="container contact-hero-layout"><div><span class="eyebrow-pill"><span class="eyebrow-dot"></span> Contact & product enquiries</span><h1>Let’s talk about<br><em>what your lab needs.</em></h1><p>Share the product, process, capacity and operating range you have in mind. Choose WhatsApp or email to send a pre-filled enquiry.</p></div><div class="contact-quick-links"><a href="tel:+919898457997"><span class="quick-icon">↗</span><small>Call / WhatsApp</small><strong>+91 98984 57997</strong></a><a href="tel:+917405057997"><span class="quick-icon">↗</span><small>Alternate phone</small><strong>+91 74050 57997</strong></a><a href="mailto:ssirajesh2010@gmail.com"><span class="quick-icon">↗</span><small>Email an enquiry</small><strong>ssirajesh2010@gmail.com</strong></a></div></div></section>
    <section class="section page-section"><div class="container contact-layout"><div class="contact-info-column"><div class="contact-form-heading"><span class="eyebrow-label">Before you enquire</span><h2>A few useful details<br>make a better first step.</h2><p>Give us enough context to identify which catalogue model or configuration to discuss.</p></div><div class="contact-prompt-list"><div><span>01</span><p>What material or sample will you process?</p></div><div><span>02</span><p>What capacity, dimensions or batch size do you need?</p></div><div><span>03</span><p>Which operating range, utilities or controls are important?</p></div></div><div class="address-records"><div class="address-record-head"><span class="eyebrow-label">Ahmedabad address records</span><span class="address-alert">Confirm before visiting</span></div><div class="address-record"><span>01</span><p>No. 31 Bhagwati Estate, Behind Uttam Dairy, Navneet Prakashan Road, Rakhial, Ahmedabad — 380023</p></div><div class="address-record"><span>02</span><p>31 Bhagwati Estate, O-7, Sukhramnagar, Amraiwadi, Ahmedabad — 380026</p></div><small>The catalogue and website records differ. Please call or email to confirm the current address.</small></div></div>
      <div class="contact-form-card"><div class="contact-form-card-head"><span class="form-step">ENQUIRY FORM</span><span class="form-private-note">No account required</span></div><h2>Tell us what you’re looking for.</h2><p>Required fields are marked with an asterisk.</p><form id="contact-enquiry-form" onsubmit="handleContactFormSubmit(event)" class="modern-contact-form"><label for="contact-name">Full name <span>*</span><input type="text" id="contact-name" name="name" autocomplete="name" required maxlength="100" placeholder="Your name"></label><div class="contact-form-row"><label for="contact-phone">Phone / WhatsApp <span>*</span><input type="tel" id="contact-phone" name="phone" autocomplete="tel" inputmode="tel" maxlength="30" required placeholder="+91 98765 43210"></label><label for="contact-email">Work email<input type="email" id="contact-email" name="email" autocomplete="email" maxlength="150" placeholder="name@organisation.com"></label></div><label for="contact-org">Institution / company<input type="text" id="contact-org" name="organization" autocomplete="organization" maxlength="120" placeholder="Laboratory or company"></label><label for="contact-product">Product of interest<select id="contact-product" name="product"><option value="">General laboratory enquiry</option>${products.map(p=>`<option value="${escapeHtml(p.name)} [${escapeHtml(p.catalogueCode||'Standard')}]">${escapeHtml(p.name)}</option>`).join('')}</select></label><label for="contact-notes">Application & requirements<textarea id="contact-notes" name="requirements" rows="4" maxlength="1200" placeholder="Application, capacity, operating range, quantity or other details"></textarea></label><div class="contact-submit-row"><button type="submit" class="btn btn-primary">Continue with WhatsApp <span>↗</span></button><button type="button" class="btn btn-secondary" onclick="sendContactViaEmail()">Continue with email</button></div><small>Your message opens in your WhatsApp app or email client for you to review and send. Nothing is sent until you choose to send it.</small></form></div>
    </div></section>
    <section class="contact-bottom-band"><div class="container"><span>Next step</span><p>Ask for the current datasheet, model configuration, warranty and delivery terms when you request a quotation.</p><a href="products.html">Return to the equipment catalogue →</a></div></section>
  </main>
  <script>
  function handleContactFormSubmit(e){e.preventDefault();const name=document.getElementById('contact-name').value.trim(),phone=document.getElementById('contact-phone').value.trim(),email=document.getElementById('contact-email').value.trim(),org=document.getElementById('contact-org').value.trim(),prod=document.getElementById('contact-product').value,notes=document.getElementById('contact-notes').value.trim();let text='*PRODUCT ENQUIRY - SHARMA SCIENTIFIC INSTRUMENTS*\\n';text+='Name: '+name+'\\nPhone: '+phone+'\\n';if(email)text+='Email: '+email+'\\n';if(org)text+='Organisation: '+org+'\\n';if(prod)text+='Product: '+prod+'\\n';if(notes)text+='Requirements: '+notes+'\\n';window.open('https://wa.me/919898457997?text='+encodeURIComponent(text),'_blank');}
  function sendContactViaEmail(){const form=document.getElementById('contact-enquiry-form');if(form&&!form.reportValidity())return;const name=document.getElementById('contact-name').value.trim(),phone=document.getElementById('contact-phone').value.trim(),email=document.getElementById('contact-email').value.trim(),org=document.getElementById('contact-org').value.trim(),prod=document.getElementById('contact-product').value,notes=document.getElementById('contact-notes').value.trim();const subject='Equipment enquiry - '+name+(prod?' ('+prod+')':'');let body='Hello Sharma Scientific Instruments,\\n\\nI would like information and a quotation for the following:\\n\\n';if(prod)body+='Product: '+prod+'\\n';body+='Contact: '+name+'\\nPhone / WhatsApp: '+phone+'\\n';if(email)body+='Email: '+email+'\\n';if(org)body+='Organisation: '+org+'\\n';if(notes)body+='Requirements: '+notes+'\\n';body+='\\nRegards,\\n'+name;window.location.href='mailto:ssirajesh2010@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);}
  </script>`;
  const schema={"@context":"https://schema.org","@type":"ContactPage","name":"Contact Sharma Scientific Instruments","description":"Contact details and product enquiry form."};
  fs.writeFileSync('contact.html',getHead("Contact | Sharma Scientific Instruments","Contact Sharma Scientific Instruments by phone, WhatsApp or email to ask about laboratory equipment and quotations.","contact.html",jsonLdScript(schema))+getHeader("contact")+body+getFooter());
  console.log("contact.html generated.");
}

/* ==========================================================================
   8. BUILD 404.HTML
   ========================================================================== */
function build404() {
  const notFoundSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Not Found (404) | Sharma Scientific Instruments Ahmedabad"
  };

  const body = `
  <main id="main-content">
    <section class="section text-center" style="min-height: 60vh; display: flex; align-items: center;">
      <div class="container" style="max-width: 600px;">
        <span class="section-eyebrow">Error 404</span>
        <h1 style="font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; color: var(--color-primary); margin-bottom: 0.5rem;">404</h1>
        <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Laboratory Record Not Found</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 2rem;">
          The page or equipment record you are seeking does not exist or has been relocated in our updated catalogue.
        </p>
        <div class="flex justify-center flex-wrap gap-2">
          <a href="index.html" class="btn btn-primary">Return to Home</a>
          <a href="products.html" class="btn btn-secondary">Explore Products</a>
          <a href="contact.html" class="btn btn-secondary">Contact Us</a>
        </div>
      </div>
    </section>
  </main>
  `;

  fs.writeFileSync('404.html', getHead(
    "Page Not Found (404) | Sharma Scientific Instruments Ahmedabad",
    "The requested page or laboratory equipment record could not be found.",
    "404.html",
    jsonLdScript(notFoundSchema)
  ) + getHeader("") + body + getFooter());
  console.log("404.html generated.");
}

/* ==========================================================================
   9. BUILD SITEMAP.XML & ROBOTS.TXT
   ========================================================================== */
function buildSitemap() {
  const staticUrls = [
    { loc: "", priority: "1.0", changefreq: "weekly" },
    { loc: "about.html", priority: "0.8", changefreq: "monthly" },
    { loc: "products.html", priority: "0.9", changefreq: "weekly" },
    { loc: "industries.html", priority: "0.7", changefreq: "monthly" },
    { loc: "quality.html", priority: "0.7", changefreq: "monthly" },
    { loc: "contact.html", priority: "0.8", changefreq: "monthly" },
  ];

  const productUrls = products.map(p => ({
    loc: `product.html?id=${p.id}`,
    priority: "0.8",
    changefreq: "monthly"
  }));

  const allUrls = [...staticUrls, ...productUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>https://sharmascientificinstruments.in/${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('sitemap.xml', sitemapXml);
  console.log("sitemap.xml generated.");

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://sharmascientificinstruments.in/sitemap.xml
`;
  fs.writeFileSync('robots.txt', robotsTxt);
  console.log("robots.txt generated.");
}

// Execute builders
buildIndex();
buildAbout();
buildProducts();
buildProductDetail();
buildQuality();
buildIndustries();
buildContact();
build404();
buildSitemap();

console.log("All static pages and SEO assets generated successfully!");
