/**
 * Sharma Scientific Instruments (SSI) - Enquiry Basket & RFQ System
 * Handles multi-product enquiry basket in localStorage, quote requests,
 * and direct dispatch via WhatsApp (wa.me) and mailto fallback.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ssi_enquiry_basket_v1';
  let quoteOpener = null;

  const SSI_Enquiry = {
    getBasket: function () {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Error reading enquiry basket:', e);
        return [];
      }
    },

    saveBasket: function (items) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        SSI_Enquiry.updateBadge();
      } catch (e) {
        console.error('Error saving enquiry basket:', e);
      }
    },

    addItem: function (item) {
      const basket = SSI_Enquiry.getBasket();
      const existing = basket.find(b => b.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        basket.push({
          id: item.id,
          name: item.name,
          catalogueCode: item.catalogueCode || '',
          category: item.categoryName || '',
          image: item.image || '',
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
      SSI_Enquiry.saveBasket(basket);
      SSI_Enquiry.showToast(`Added "${item.name}" to your enquiry basket.`);
    },

    removeItem: function (id) {
      let basket = SSI_Enquiry.getBasket();
      basket = basket.filter(b => b.id !== id);
      SSI_Enquiry.saveBasket(basket);
      SSI_Enquiry.renderDrawerItems();
    },

    clearBasket: function () {
      localStorage.removeItem(STORAGE_KEY);
      SSI_Enquiry.updateBadge();
      SSI_Enquiry.renderDrawerItems();
    },

    getCount: function () {
      const basket = SSI_Enquiry.getBasket();
      return basket.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },

    updateBadge: function () {
      const count = SSI_Enquiry.getCount();
      const badges = document.querySelectorAll('.enquiry-badge-count');
      badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
      });
    },

    showToast: function (msg) {
      let toast = document.getElementById('ssi-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ssi-toast';
        toast.className = 'ssi-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    },

    /**
     * Open Single Product Quote Modal
     */
    openQuoteModal: function (productName, productCode) {
      let modal = document.getElementById('ssi-quote-modal');
      if (!modal) {
        SSI_Enquiry.createQuoteModalDOM();
        modal = document.getElementById('ssi-quote-modal');
      }
      const prodField = document.getElementById('quote-product-name');
      if (prodField) prodField.value = `${productName || 'Laboratory Equipment'} ${productCode ? '(' + productCode + ')' : ''}`.trim();
      quoteOpener = document.activeElement;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => document.getElementById('quote-name')?.focus(), 80);
    },

    closeQuoteModal: function () {
      const modal = document.getElementById('ssi-quote-modal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
      if (quoteOpener && typeof quoteOpener.focus === 'function') quoteOpener.focus();
    },

    /**
     * Open Multi-Item Enquiry Drawer
     */
    openDrawer: function () {
      let drawer = document.getElementById('ssi-basket-drawer');
      if (!drawer) {
        SSI_Enquiry.createBasketDrawerDOM();
        drawer = document.getElementById('ssi-basket-drawer');
      }
      SSI_Enquiry.renderDrawerItems();
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeDrawer: function () {
      const drawer = document.getElementById('ssi-basket-drawer');
      if (drawer) drawer.classList.remove('active');
      document.body.style.overflow = '';
    },

    validateBasketContact: function () {
      const name = document.getElementById('basket-user-name');
      const phone = document.getElementById('basket-user-phone');
      if (name) name.required = true;
      if (phone) phone.required = true;
      return !name || !phone || (name.reportValidity() && phone.reportValidity());
    },

    renderDrawerItems: function () {
      const listEl = document.getElementById('ssi-basket-items-list');
      const emptyEl = document.getElementById('ssi-basket-empty');
      const footerEl = document.getElementById('ssi-basket-footer');
      if (!listEl) return;

      const basket = SSI_Enquiry.getBasket();
      if (basket.length === 0) {
        listEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (footerEl) footerEl.style.display = 'none';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';

      listEl.innerHTML = basket.map(item => `
        <div class="basket-item-card">
          <img src="${item.image || 'assets/img/logo/logo-mark.png'}" alt="${item.name}" class="basket-thumb" onerror="this.src='assets/img/logo/logo-mark.png'">
          <div class="basket-item-info">
            <h4 class="basket-item-title">${item.name}</h4>
            <span class="basket-item-code">${item.catalogueCode || item.category || 'SSI Quality'}</span>
            <div class="basket-item-actions">
              <span class="basket-qty">Qty: ${item.quantity || 1}</span>
              <button type="button" class="btn-remove-basket" onclick="SSI_Enquiry.removeItem('${item.id}')" aria-label="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      `).join('');
    },

    /**
     * Send Multi-Item Basket Request via WhatsApp
     */
    sendBasketViaWhatsApp: function () {
      const basket = SSI_Enquiry.getBasket();
      if (basket.length === 0) return;
      if (!SSI_Enquiry.validateBasketContact()) return;

      const userName = (document.getElementById('basket-user-name')?.value || 'Prospective Client').trim();
      const userPhone = (document.getElementById('basket-user-phone')?.value || '').trim();
      const userOrg = (document.getElementById('basket-user-org')?.value || '').trim();

      let text = `*NEW ENQUIRY - SHARMA SCIENTIFIC INSTRUMENTS*\n`;
      text += `--------------------------------------\n`;
      text += `*Name:* ${userName}\n`;
      if (userPhone) text += `*Phone:* ${userPhone}\n`;
      if (userOrg) text += `*Institute/Company:* ${userOrg}\n`;
      text += `--------------------------------------\n`;
      text += `*Requested Equipment (${basket.length} items):*\n`;

      basket.forEach((item, idx) => {
        text += `${idx + 1}. *${item.name}* [${item.catalogueCode || 'Standard'}] (Qty: ${item.quantity || 1})\n`;
      });

      text += `--------------------------------------\n`;
      text += `Please share specifications, technical datasheet, and quotation. Thank you!`;

      const waNumber = window.SSI_CONFIG ? window.SSI_CONFIG.contact.whatsappNumber : '919898457997';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    },

    /**
     * Send Multi-Item Basket Request via Mailto
     */
    sendBasketViaEmail: function () {
      const basket = SSI_Enquiry.getBasket();
      if (basket.length === 0) return;
      if (!SSI_Enquiry.validateBasketContact()) return;

      const userName = (document.getElementById('basket-user-name')?.value || 'Prospective Client').trim();
      const userPhone = (document.getElementById('basket-user-phone')?.value || '').trim();
      const userOrg = (document.getElementById('basket-user-org')?.value || 'Laboratory').trim();

      const subject = `Equipment Quotation Request - ${userName} (${basket.length} Products)`;
      let body = `Hello Sharma Scientific Instruments,\n\n`;
      body += `I would like to request a formal technical quotation and availability for the following equipment:\n\n`;

      basket.forEach((item, idx) => {
        body += `${idx + 1}. ${item.name} ${item.catalogueCode ? '[' + item.catalogueCode + ']' : ''} - Qty: ${item.quantity || 1}\n`;
      });

      body += `\nOrganization / Institute: ${userOrg}\n`;
      body += `Contact Person: ${userName}\n\n`;
      if (userPhone) body += `Phone / WhatsApp: ${userPhone}\n`;
      body += `Please share the current specifications, quotation, warranty and delivery details.\n\nRegards,\n${userName}`;

      const email = window.SSI_CONFIG ? window.SSI_CONFIG.contact.email : 'ssirajesh2010@gmail.com';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },

    /**
     * Download Enquiry List as Formatted Text Document (.txt)
     */
    downloadBasketText: function () {
      const basket = SSI_Enquiry.getBasket();
      if (basket.length === 0) {
        SSI_Enquiry.showToast('Enquiry basket is empty.');
        return;
      }
      const userName = (document.getElementById('basket-user-name')?.value || 'Client / Laboratory').trim();
      const userPhone = (document.getElementById('basket-user-phone')?.value || 'Not provided').trim();
      const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

      let text = `========================================================================\n`;
      text += `SHARMA SCIENTIFIC INSTRUMENTS (SSI) - FORMAL ENQUIRY LIST\n`;
      text += `Laboratory equipment catalogue • Ahmedabad, Gujarat\n`;
      text += `Ahmedabad, Gujarat, India • Phone: +91 98984 57997 • Email: ssirajesh2010@gmail.com\n`;
      text += `\n`;
      text += `========================================================================\n\n`;
      text += `Date: ${dateStr}\n`;
      text += `Generated For: ${userName}\n`;
      text += `Contact Phone: ${userPhone}\n`;
      text += `Total Equipment Items: ${basket.length}\n\n`;
      text += `REQUESTED INSTRUMENT SPECIFICATIONS & QUANTITIES:\n`;
      text += `------------------------------------------------------------------------\n`;

      basket.forEach((item, idx) => {
        text += `${idx + 1}. ${item.name.toUpperCase()}\n`;
        if (item.catalogueCode) text += `   Catalogue Code: ${item.catalogueCode}\n`;
        if (item.category) text += `   Category: ${item.category}\n`;
        text += `   Quantity Requested: ${item.quantity || 1} Unit(s)\n`;
        text += `   Catalogue Reference: https://sharmascientificinstruments.in/product.html?id=${item.id}\n\n`;
      });

      text += `------------------------------------------------------------------------\n`;
      text += `Terms Requested:\n`;
      text += `- Formal Proforma Quotation with GST breakdown\n`;
      text += `- Technical Datasheet & Chamber Dimensional Drawing\n`;
      text += `- Standard Manufacturer Warranty & Calibration Traceability\n`;
      text += `- Freight / Crating Estimate for Site Delivery\n`;
      text += `========================================================================\n`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SSI-Enquiry-List-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SSI_Enquiry.showToast('Enquiry specification list downloaded (.txt)');
    },

    /**
     * Download Enquiry List as CSV Spreadsheet (.csv)
     */
    downloadBasketCSV: function () {
      const basket = SSI_Enquiry.getBasket();
      if (basket.length === 0) {
        SSI_Enquiry.showToast('Enquiry basket is empty.');
        return;
      }
      let csv = 'Item No,Product Name,Catalogue Code,Category,Quantity,Product URL\n';
      basket.forEach((item, idx) => {
        const name = `"${item.name.replace(/"/g, '""')}"`;
        const code = `"${(item.catalogueCode || 'Standard').replace(/"/g, '""')}"`;
        const cat = `"${(item.category || '').replace(/"/g, '""')}"`;
        const qty = item.quantity || 1;
        const url = `https://sharmascientificinstruments.in/product.html?id=${item.id}`;
        csv += `${idx + 1},${name},${code},${cat},${qty},${url}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SSI-Enquiry-List-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SSI_Enquiry.showToast('Enquiry spreadsheet downloaded (.csv)');
    },

    /**
     * Send Single Modal Quote via WhatsApp
     */
    sendQuoteModalWhatsApp: function () {
      const form = document.getElementById('quote-modal-form');
      if (form && !form.reportValidity()) return;
      const prod = (document.getElementById('quote-product-name')?.value || '').trim();
      const name = (document.getElementById('quote-name')?.value || '').trim();
      const phone = (document.getElementById('quote-phone')?.value || '').trim();
      const email = (document.getElementById('quote-email')?.value || '').trim();
      const org = (document.getElementById('quote-org')?.value || '').trim();
      const city = (document.getElementById('quote-city')?.value || '').trim();
      const quantity = (document.getElementById('quote-quantity')?.value || '').trim();
      const notes = (document.getElementById('quote-notes')?.value || '').trim();

      if (!name) {
        alert('Please enter your name.');
        return;
      }

      let text = `*QUOTE REQUEST - SHARMA SCIENTIFIC INSTRUMENTS*\n`;
      text += `--------------------------------------\n`;
      text += `*Product:* ${prod}\n`;
      text += `*Client Name:* ${name}\n`;
      text += `*Phone / Mobile:* ${phone}\n`;
      if (email) text += `*Email:* ${email}\n`;
      if (org) text += `*Organisation:* ${org}\n`;
      if (city) text += `*City / Location:* ${city}\n`;
      if (quantity) text += `*Quantity:* ${quantity}\n`;
      if (notes) text += `*Requirement Details:* ${notes}\n`;
      text += `--------------------------------------\n`;
      text += `Kindly provide quotation and dispatch schedule.`;

      const waNumber = window.SSI_CONFIG ? window.SSI_CONFIG.contact.whatsappNumber : '919898457997';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      SSI_Enquiry.closeQuoteModal();
    },

    /**
     * Send Single Modal Quote via Mailto
     */
    sendQuoteModalEmail: function () {
      const form = document.getElementById('quote-modal-form');
      if (form && !form.reportValidity()) return;
      const prod = (document.getElementById('quote-product-name')?.value || 'Laboratory Equipment').trim();
      const name = (document.getElementById('quote-name')?.value || 'Valued Client').trim();
      const phone = (document.getElementById('quote-phone')?.value || '').trim();
      const emailAddress = (document.getElementById('quote-email')?.value || '').trim();
      const org = (document.getElementById('quote-org')?.value || '').trim();
      const city = (document.getElementById('quote-city')?.value || '').trim();
      const quantity = (document.getElementById('quote-quantity')?.value || '').trim();
      const notes = (document.getElementById('quote-notes')?.value || '').trim();

      const subject = `Price Quotation Request: ${prod}`;
      let body = `Dear Sharma Scientific Instruments,\n\n`;
      body += `I am interested in procuring the following equipment:\n\n`;
      body += `Product: ${prod}\n`;
      body += `Name: ${name}\n`;
      body += `Phone: ${phone}\n`;
      if (emailAddress) body += `Email: ${emailAddress}\n`;
      if (org) body += `Organisation: ${org}\n`;
      if (city) body += `Location: ${city}\n`;
      if (quantity) body += `Quantity: ${quantity}\n`;
      if (notes) body += `Specific Size / Requirements: ${notes}\n\n`;
      body += `Please provide your best quotation, technical catalog, and freight estimate.\n\nRegards,\n${name}`;

      const email = window.SSI_CONFIG ? window.SSI_CONFIG.contact.email : 'ssirajesh2010@gmail.com';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      SSI_Enquiry.closeQuoteModal();
    },


    /**
     * Open Printable Technical Datasheet Modal for an Instrument
     */
    openDatasheet: function (productId) {
      function showModal(prod) {
        if (!prod) { SSI_Enquiry.showToast('Product specifications not found.'); return; }
        let modal = document.getElementById('ssi-datasheet-modal');
        if (!modal) { modal = document.createElement('div'); modal.id = 'ssi-datasheet-modal'; modal.className = 'ssi-modal-backdrop'; document.body.appendChild(modal); }
        const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        const label = key => String(key).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, c => c.toUpperCase());
        const rowTable = obj => {
          if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return '';
          const rows = Object.entries(obj).filter(([, value]) => value !== null && typeof value !== 'object');
          if (!rows.length) return '';
          return '<table class="sheet-table"><tbody>' + rows.map(([key, value]) => '<tr><th>' + esc(label(key)) + '</th><td>' + esc(value) + '</td></tr>').join('') + '</tbody></table>';
        };
        const groups = [];
        ['temperature','operatingSpecs','specifications','humidity','refrigeration','coolingHeating','heating','construction'].forEach(key => {
          if (prod[key] && typeof prod[key] === 'object' && !Array.isArray(prod[key])) groups.push('<section class="sheet-section"><h2>' + esc(label(key)) + '</h2>' + rowTable(prod[key]) + '</section>');
        });
        const models = prod.sizes || prod.models;
        if (Array.isArray(models) && models.length && models.every(item => item && typeof item === 'object')) {
          const keys = [...new Set(models.flatMap(item => Object.keys(item)))];
          groups.push('<section class="sheet-section"><h2>Published models &amp; dimensions</h2><div class="sheet-table-scroll"><table class="sheet-table sheet-model-table"><thead><tr>' + keys.map(key => '<th>' + esc(label(key)) + '</th>').join('') + '</tr></thead><tbody>' + models.map(item => '<tr>' + keys.map(key => '<td>' + esc(item[key] == null ? '—' : item[key]) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></section>');
        }
        const listSection = (key, heading) => Array.isArray(prod[key]) && prod[key].length ? '<section class="sheet-section"><h2>' + heading + '</h2><ul class="sheet-list">' + prod[key].map(item => '<li>' + esc(item) + '</li>').join('') + '</ul></section>' : '';
        const apps = listSection('applications', 'Typical applications');
        const accessories = listSection('optionalAccessories', 'Optional accessories');
        const code = esc(prod.catalogueCode || 'Ask supplier');
        const pdfAction = prod.pdfUrl ? '<a class="btn btn-secondary btn-sm" href="' + esc(prod.pdfUrl) + '" target="_blank" rel="noopener">Download product PDF</a>' : '';
        const extraGroups = groups.join('') || '<p class="sheet-empty">Ask the team for current model specifications.</p>';
        modal.innerHTML = `
          <style>
            #ssi-datasheet-modal .ssi-datasheet-dialog{width:min(100%,980px);max-height:92vh;overflow:auto;padding:clamp(1rem,3vw,2rem);border:1px solid #dce5dc;border-radius:22px;background:#fbfaf6;color:#173b33;box-shadow:0 28px 80px #071c1640}
            #ssi-datasheet-modal .sheet-toolbar{position:sticky;top:-1px;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:.7rem;margin:-.3rem 0 1rem;padding:.4rem 0 1rem;border-bottom:1px solid #dce5dc;background:#fbfaf6}
            #ssi-datasheet-modal .sheet-actions{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.sheet-close{width:38px;height:38px;border:1px solid #dce5dc;border-radius:50%;background:#fff;color:#285b4f;font-size:1.45rem;cursor:pointer}
            #ssi-datasheet-modal .sheet-brand{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:0 0 1rem;border-bottom:2px solid #285b4f}.sheet-brand strong{display:block;font-size:.92rem;letter-spacing:.04em}.sheet-brand small{display:block;margin-top:.2rem;color:#68776f}.sheet-brand .sheet-brand-mark{color:#b96543;font-weight:800}
            #ssi-datasheet-modal .sheet-hero{display:grid;grid-template-columns:180px 1fr;gap:1.2rem;align-items:center;padding:1.2rem 0}.sheet-hero-image{display:grid;place-items:center;min-height:140px;padding:.6rem;border:1px solid #dce5dc;border-radius:14px;background:linear-gradient(145deg,#fff,#f0f3ed)}.sheet-hero-image img{max-width:100%;max-height:150px;object-fit:contain}.sheet-eyebrow{color:#b96543;font-size:.67rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.sheet-hero h1{margin:.35rem 0;color:#173b33;font-size:clamp(1.5rem,3vw,2.3rem);letter-spacing:-.04em}.sheet-code{display:inline-block;padding:.42rem .6rem;border-radius:8px;background:#eaf0e8;color:#285b4f;font-size:.75rem;font-weight:800}.sheet-hero p{margin:.55rem 0 0;color:#68776f;font-size:.82rem;line-height:1.6}
            #ssi-datasheet-modal .sheet-section{margin:1rem 0}.sheet-section h2{margin:0 0 .5rem;padding-bottom:.48rem;border-bottom:1px solid #dce5dc;color:#173b33;font-size:.98rem}.sheet-table{width:100%;border-collapse:collapse;font-size:.76rem}.sheet-table th,.sheet-table td{padding:.56rem .65rem;border-bottom:1px solid #e4e9e1;text-align:left;vertical-align:top;line-height:1.5}.sheet-table tbody tr:nth-child(even){background:#f1f4ee}.sheet-table th{width:31%;color:#285b4f;font-size:.7rem}.sheet-model-table th{width:auto;background:#285b4f;color:#fff}.sheet-table-scroll{overflow:auto}.sheet-list{display:grid;gap:.45rem;margin:0;padding:1rem 1rem 1rem 2rem;border:1px solid #dce5dc;border-radius:12px;background:#f1f4ee;color:#435b50;font-size:.78rem;line-height:1.5}.sheet-empty{color:#68776f}
            #ssi-datasheet-modal .sheet-notice{margin:1rem 0;padding:.8rem 1rem;border-left:3px solid #b96543;border-radius:0 10px 10px 0;background:#f1f4ee;color:#617169;font-size:.72rem;line-height:1.6}.sheet-contact{padding-top:.8rem;border-top:1px solid #dce5dc;color:#68776f;font-size:.72rem}
            @media(max-width:600px){#ssi-datasheet-modal{padding:.45rem!important}#ssi-datasheet-modal .ssi-datasheet-dialog{max-height:94vh;padding:1rem;border-radius:16px}.sheet-hero{grid-template-columns:1fr!important}.sheet-hero-image{min-height:110px}.sheet-hero-image img{max-height:110px}.sheet-brand{align-items:flex-start!important;flex-direction:column}.sheet-table th,.sheet-table td{padding:.48rem;font-size:.7rem}.sheet-toolbar{align-items:flex-start!important;flex-direction:column}}
            @media print{@page{size:A4;margin:14mm}body>*:not(#ssi-datasheet-modal){display:none!important}#ssi-datasheet-modal{position:static!important;display:block!important;padding:0!important;background:#fff!important}#ssi-datasheet-modal .ssi-datasheet-dialog{width:auto;max-height:none;overflow:visible;padding:0;border:0;border-radius:0;box-shadow:none;background:#fff}#ssi-datasheet-modal .sheet-toolbar,#ssi-datasheet-modal .sheet-actions,.sheet-notice{display:none!important}.sheet-section{break-inside:avoid}.sheet-hero-image{min-height:100px}.sheet-hero-image img{max-height:120px}}
          </style>
          <div class="ssi-datasheet-dialog" role="dialog" aria-modal="true" aria-label="${esc(prod.name)} specification sheet">
            <div class="sheet-toolbar"><span class="sheet-eyebrow">Technical specification sheet</span><div class="sheet-actions">${pdfAction}<button type="button" class="btn btn-primary btn-sm" onclick="window.print()">Print / Save PDF</button><button type="button" class="sheet-close" aria-label="Close datasheet" onclick="document.getElementById('ssi-datasheet-modal').classList.remove('active');document.body.style.overflow='';">×</button></div></div>
            <div id="ssi-datasheet-print-area"><header class="sheet-brand"><div><strong><span class="sheet-brand-mark">SSI /</span> SHARMA SCIENTIFIC INSTRUMENTS</strong><small>Laboratory equipment · Ahmedabad, Gujarat, India</small></div><div class="sheet-eyebrow">Product specification</div></header>
              <div class="sheet-hero"><div class="sheet-hero-image"><img src="${esc(prod.image)}" alt="${esc(prod.name)}" onerror="this.src='${esc(prod.imageFallback || prod.image)}'"></div><div><span class="sheet-eyebrow">${esc(prod.categoryName || 'Laboratory equipment')}</span><h1>${esc(prod.name)}</h1><span class="sheet-code">${code}</span><p>${esc(prod.tagline || prod.description || '')}</p></div></div>
              ${extraGroups}${accessories}${apps}
              <div class="sheet-notice"><b>Procurement note</b><br>Specifications summarize published catalogue information. Confirm the exact model, configuration, utilities, options, documentation, price and delivery details with the supplier. Application examples are indicative and do not certify process suitability.</div>
              <div class="sheet-contact">Ahmedabad, Gujarat, India · +91 98984 57997 · +91 74050 57997 · ssirajesh2010@gmail.com · sharmascientificinstruments.in</div>
            </div>
            <div class="no-print sheet-actions" style="justify-content:flex-end;margin-top:1rem"><button type="button" class="btn btn-primary btn-sm" onclick="SSI_Enquiry.openQuoteModal('${esc(prod.name)}','${code}')">Request a quotation</button></div>
          </div>`;
        modal.classList.add('active'); document.body.style.overflow = 'hidden';
      }
      if (window.SSI_PRODUCTS && window.SSI_PRODUCTS.length) {
        showModal(window.SSI_PRODUCTS.find(p => p.id === productId));
      } else {
        fetch('products.json').then(res => res.json()).then(data => { window.SSI_PRODUCTS = data.products; showModal(data.products.find(p => p.id === productId)); })
          .catch(err => { console.error('Error fetching datasheet:', err); SSI_Enquiry.showToast('Unable to load specifications.'); });
      }
    },

    createQuoteModalDOM: function () {
      const modal = document.createElement('div');
      modal.id = 'ssi-quote-modal';
      modal.className = 'ssi-modal-backdrop';
      modal.classList.add('quote-modal-backdrop');
      modal.innerHTML = `
        <div class="ssi-modal-dialog quote-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title" tabindex="-1">
          <div class="ssi-modal-header">
            <div class="modal-header-text">
              <span class="modal-eyebrow">Sharma Scientific Instruments</span>
              <h3 class="modal-title" id="quote-modal-title">Request a Formal Quotation</h3>
              <p class="quote-modal-intro">Share your contact details and requirements. Your message will open for review before you send it.</p>
            </div>
            <button type="button" class="btn-close-modal" onclick="SSI_Enquiry.closeQuoteModal()" aria-label="Close dialog">&times;</button>
          </div>
          <div class="ssi-modal-body">
            <form id="quote-modal-form" onsubmit="event.preventDefault();SSI_Enquiry.sendQuoteModalWhatsApp();">
              <div class="form-group">
                <label for="quote-product-name">Equipment of interest</label>
                <input type="text" id="quote-product-name" readonly class="form-control bg-subtle" aria-describedby="quote-product-help">
                <small id="quote-product-help" class="quote-field-help">Selected from the product catalogue</small>
              </div>
              <div class="form-row">
                <div class="form-group col-6">
                  <label for="quote-name">Full name <span>*</span></label>
                  <input type="text" id="quote-name" name="name" autocomplete="name" required maxlength="100" placeholder="e.g. Dr. A. Patel" class="form-control">
                </div>
                <div class="form-group col-6">
                  <label for="quote-phone">Phone / WhatsApp <span>*</span></label>
                  <input type="tel" id="quote-phone" name="phone" autocomplete="tel" inputmode="tel" required maxlength="30" placeholder="e.g. +91 98765 43210" class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-6">
                  <label for="quote-email">Work email</label>
                  <input type="email" id="quote-email" name="email" autocomplete="email" maxlength="150" placeholder="name@organisation.com" class="form-control">
                </div>
                <div class="form-group col-6">
                  <label for="quote-org">Institution / company</label>
                  <input type="text" id="quote-org" name="organization" autocomplete="organization" maxlength="120" placeholder="Laboratory or organisation" class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-6">
                  <label for="quote-city">City / delivery location</label>
                  <input type="text" id="quote-city" name="city" autocomplete="address-level2" maxlength="100" placeholder="e.g. Ahmedabad" class="form-control">
                </div>
                <div class="form-group col-6">
                  <label for="quote-quantity">Estimated quantity</label>
                  <input type="number" id="quote-quantity" name="quantity" min="1" max="9999" value="1" inputmode="numeric" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label for="quote-notes">Application & technical requirements</label>
                <textarea id="quote-notes" name="requirements" rows="3" maxlength="1200" placeholder="Application, capacity, temperature range, chamber size, utilities or requested accessories" class="form-control"></textarea>
                <small class="quote-field-help">Optional, but useful for matching the configuration to your application.</small>
              </div>
              <div class="modal-action-buttons">
                <button type="button" class="btn btn-whatsapp w-100" onclick="SSI_Enquiry.sendQuoteModalWhatsApp()">
                  <span aria-hidden="true">↗</span>
                  Continue with WhatsApp
                </button>
                <button type="button" class="btn btn-secondary w-100" onclick="SSI_Enquiry.sendQuoteModalEmail()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Continue with email
                </button>
              </div>
              <p class="quote-privacy-note">No message is sent automatically. WhatsApp or your email app opens with these details so you can review and send.</p>
            </form>
          </div>
        </div>
      `;
      modal.addEventListener('click', event => {
        if (event.target === modal) SSI_Enquiry.closeQuoteModal();
      });
      if (!document.documentElement.dataset.ssiModalKeys) {
        document.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            SSI_Enquiry.closeQuoteModal();
            SSI_Enquiry.closeDrawer();
          }
        });
        document.documentElement.dataset.ssiModalKeys = 'true';
      }
      document.body.appendChild(modal);
    },

    createBasketDrawerDOM: function () {
      const drawer = document.createElement('div');
      drawer.id = 'ssi-basket-drawer';
      drawer.className = 'ssi-drawer-backdrop';
      drawer.innerHTML = `
        <div class="ssi-drawer-panel">
          <div class="ssi-drawer-header">
            <div>
              <span class="drawer-eyebrow">Sharma Scientific Instruments</span>
              <h3 class="drawer-title">Enquiry Basket</h3>
            </div>
            <button type="button" class="btn-close-drawer" onclick="SSI_Enquiry.closeDrawer()" aria-label="Close drawer">&times;</button>
          </div>
          <div class="ssi-drawer-body">
            <div id="ssi-basket-empty" class="basket-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <p>Your enquiry basket is empty.</p>
              <a href="products.html" class="btn btn-primary btn-sm" onclick="SSI_Enquiry.closeDrawer()">Explore Product Catalogue</a>
            </div>
            <div id="ssi-basket-items-list" class="basket-items-container"></div>
          </div>
          <div id="ssi-basket-footer" class="ssi-drawer-footer" style="display: none;">
            <div class="drawer-client-inputs">
              <label class="basket-contact-label" for="basket-user-name">Contact name <span>*</span></label>
              <input type="text" id="basket-user-name" autocomplete="name" placeholder="Your full name" required maxlength="100" class="form-control form-control-sm mb-2">
              <label class="basket-contact-label" for="basket-user-phone">Phone / WhatsApp <span>*</span></label>
              <input type="tel" id="basket-user-phone" autocomplete="tel" inputmode="tel" placeholder="+91 98765 43210" required maxlength="30" class="form-control form-control-sm mb-2">
              <label class="basket-contact-label" for="basket-user-org">Institution / company</label>
              <input type="text" id="basket-user-org" autocomplete="organization" placeholder="Laboratory or organisation" maxlength="120" class="form-control form-control-sm mb-2">
            </div>
            <div class="drawer-btn-stack">
              <button type="button" class="btn btn-whatsapp w-100 mb-2" onclick="SSI_Enquiry.sendBasketViaWhatsApp()">
                Send Enquiry via WhatsApp
              </button>
              <button type="button" class="btn btn-secondary w-100 mb-2" onclick="SSI_Enquiry.sendBasketViaEmail()">
                Send via Email
              </button>
              <div class="flex gap-2 mb-2" style="display:flex; gap:0.5rem; margin-bottom:0.5rem;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="SSI_Enquiry.downloadBasketText()" style="flex:1; justify-content:center; font-size:0.8rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download .TXT
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="SSI_Enquiry.downloadBasketCSV()" style="flex:1; justify-content:center; font-size:0.8rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download .CSV
                </button>
              </div>
              <button type="button" class="btn btn-text btn-sm text-muted w-100" onclick="SSI_Enquiry.clearBasket()">
                Clear Basket
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }
  };

  window.SSI_Enquiry = SSI_Enquiry;

  document.addEventListener('DOMContentLoaded', function () {
    SSI_Enquiry.updateBadge();
  });
})();
