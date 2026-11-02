/* ==========================================================================
   Main JavaScript Interactivity & UX Enhancements
   ========================================================================== */

// Content lives in data/*.js (window.PUBLICATIONS / PROJECTS / NEWS); pages only hold empty containers.
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const boldMe = a => esc(a).replace(/Park SJ/g, '<strong>Park SJ</strong>');
const nowYM = (() => { const d = new Date(); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0'); })();
const isOngoing = p => p.end >= nowYM; // 'YYYY.MM' strings compare correctly
const isPI = p => /책임자/.test(p.role || ''); // 연구책임자 + 위탁연구책임자
const THRUSTS = { structures: 'Structural integrity', acoustics: 'Underwater acoustics and signature control', survivability: 'Underwater acoustics and signature control', 'ai-twin': 'Physics-informed AI and digital twins' };
const thrustParam = (() => { const t = new URLSearchParams(location.search).get('thrust'); return THRUSTS[t] ? (t === 'survivability' ? 'acoustics' : t) : ''; })();
const matchThrust = (itemThrust, key) => (key === 'acoustics' || key === 'survivability') ? (itemThrust === 'acoustics' || itemThrust === 'survivability') : itemThrust === key;
function thrustNote(n, what, page) {
  const el = document.getElementById('thrust-note');
  if (!el || !thrustParam) return;
  el.hidden = false;
  el.innerHTML = `Showing ${n} ${n === 1 ? what.replace(/s$/, '') : what} in <strong>${esc(THRUSTS[thrustParam])}</strong>. <a href="${page}">Show all</a> · <a href="research.html#${thrustParam}">About this thrust</a>`;
}

function pubItem(p) {
  const title = p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
  return `<div class="pub-item searchable-item">
    <div class="pub-title">${title}</div>
    <div class="pub-authors">${boldMe(p.authors)}</div>
    <div class="pub-journal"><span class="badge badge-${esc(p.index.toLowerCase())}">${esc(p.index)}</span> <span>${esc(p.venue)}${p.note ? ` (${esc(p.note)})` : ''}, ${p.year}</span></div>
  </div>`;
}

function textList(title, items, id) {
  if (!items.length) return '';
  return `<div class="year-block" id="${id}"><h3 class="year-heading">${title} (${items.length})</h3>` +
    items.map(t => `<div class="pub-item searchable-item"><div class="pub-authors">${boldMe(typeof t === 'string' ? t : t.text)}</div></div>`).join('') + '</div>';
}

function renderData() {
  const P = window.PUBLICATIONS, J = P ? P.journal : [], PR = window.PROJECTS || [];
  const counts = { journal: J.length, projects: PR.length, ongoing: PR.filter(isOngoing).length, completed: PR.filter(p => !isOngoing(p)).length, transfers: P ? P.transfers.length : 0, patents: P ? P.patents.length : 0,
    conferences: P ? P.conference_international.length + P.conference_domestic.length : 0,
    'student-awards': (window.NEWS || []).filter(x => x.type === 'Student Award').length, pi: PR.filter(isPI).length,
    scie: J.filter(p => p.index === 'SCIE').length, scopus: J.filter(p => p.index === 'Scopus').length, kci: J.filter(p => p.index === 'KCI').length };
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = counts[el.dataset.count] ?? ''; });

  const news = document.getElementById('news-list');
  if (news && window.NEWS) {
    const n = +news.dataset.limit || window.NEWS.length;
    const badge = { 'Faculty Award': 'award', 'Student Award': 'patent', 'Event': 'scie' };
    news.innerHTML = window.NEWS.slice(0, n).map(x => `<li class="searchable-item" data-category="${esc((x.type || '').split(' ')[0].toLowerCase())}"><span class="news-date">${esc(x.date)}</span> <span class="news-type">${x.type ? `<span class="badge badge-${badge[x.type] || 'scie'}">${esc(x.type)}</span>` : ''}</span><span class="news-text">${esc(x.text)}</span></li>`).join('');
  }

  // Research page: papers and projects per thrust tag
  document.querySelectorAll('[data-thrust-count]').forEach(el => {
    const [kind, key] = el.dataset.thrustCount.split(':');
    const n = (kind === 'papers' ? J : PR).filter(x => matchThrust(x.thrust, key)).length;
    el.textContent = `(${n})`;
  });
  document.querySelectorAll('[data-thrust-papers]').forEach(ol => {
    const list = J.filter(p => matchThrust(p.thrust, ol.dataset.thrustPapers)).sort((a, b) => (a.thrust === 'acoustics' ? 0 : 1) - (b.thrust === 'acoustics' ? 0 : 1)).slice(0, +ol.dataset.limit || 4);
    ol.innerHTML = list.map(p => `<li>${p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}
      <span class="meta">${boldMe(p.authors)} · ${esc(p.venue)}, ${p.year}</span></li>`).join('');
  });
  document.querySelectorAll('[data-thrust-projects]').forEach(ul => {
    const all = PR.filter(p => matchThrust(p.thrust, ul.dataset.thrustProjects)).sort((a, b) => (a.thrust === 'acoustics' ? 0 : 1) - (b.thrust === 'acoustics' ? 0 : 1));
    const list = all.filter(isOngoing).concat(all.filter(p => !isOngoing(p))).slice(0, +ul.dataset.limit || 4);
    ul.innerHTML = list.map(p => `<li>${isOngoing(p) ? '<span class="badge badge-ongoing">Ongoing</span>' : ''}${esc(p.title)}
      <span class="meta">${esc(p.sponsor)} · ${esc(p.start)} – ${esc(p.end)}</span></li>`).join('');
  });

  const featured = document.getElementById('featured-pubs');
  if (featured) featured.innerHTML = J.filter(p => p.featured).map(p => `<div class="card" style="padding:1.5rem;">
      <span class="badge badge-scie" style="margin-bottom:.75rem;align-self:flex-start;">${esc(p.venue)} (${p.year})</span>
      <h3 class="featured-title"><a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${esc(p.title)}</a></h3>
      <p style="font-size:.875rem;color:var(--ink-soft);margin:0;">${boldMe(p.authors)}</p></div>`).join('');

  const pubs = document.getElementById('pub-list');
  if (pubs && P && thrustParam) {
    const T = J.filter(p => matchThrust(p.thrust, thrustParam));
    thrustNote(T.length, 'journal papers', 'publications.html');
    const years = [...new Set(T.map(p => p.year))].sort((a, b) => b - a);
    pubs.innerHTML = years.map(y => { const list = T.filter(p => p.year === y);
      return `<div class="year-block"><h3 class="year-heading">${y} (${list.length})</h3>${list.map(pubItem).join('')}</div>`; }).join('');
  } else if (pubs && P) {
    const years = [...new Set(J.map(p => p.year))].sort((a, b) => b - a);
    const jump = [['journal', 'Journal papers', J.length], ['conf-int', 'International conferences', P.conference_international.length], ['conf-dom', 'Domestic conferences', P.conference_domestic.length],
      ['patents', 'Patents', P.patents.length], ['transfers', 'Technology transfers', P.transfers.length], ['books', 'Books', P.books.length]];
    pubs.innerHTML = '<nav class="jump" aria-label="Publication types">' + jump.map(([id, t, n]) => `<a href="#${id}">${t} <span>${n}</span></a>`).join('') + '</nav>' +
      '<h2 id="journal">Journal Papers</h2>' + years.map(y => {
      const list = J.filter(p => p.year === y);
      return `<div class="year-block"><h3 class="year-heading">${y} (${list.length})</h3>${list.map(pubItem).join('')}</div>`;
    }).join('') +
      '<h2 style="margin-top:3rem;">Conferences, Patents &amp; Books</h2>' +
      textList('International Conferences', P.conference_international, 'conf-int') +
      textList('Domestic Conferences', P.conference_domestic, 'conf-dom') +
      textList('Patent Applications', P.patents, 'patents') +
      textList('Technology Transfers', P.transfers, 'transfers') +
      textList('Books', P.books, 'books');
  }

  const proj = document.getElementById('project-list');
  if (proj) {
    const card = p => {
      const on = isOngoing(p);
      return `<div class="project-card searchable-item" data-category="${on ? 'ongoing' : 'completed'}${isPI(p) ? ' pi' : ''}">
        <div class="project-header"><span class="project-title">${esc(p.title)}</span>
          <div><span class="badge badge-${on ? 'ongoing' : 'completed'}">${on ? 'Ongoing' : 'Completed'}</span>${p.role ? ` <span class="badge badge-${/책임자/.test(p.role) ? 'pi' : 'copi'}">${esc(p.role)}</span>` : ''}</div></div>
        <div class="project-meta"><span><strong>Period:</strong> ${esc(p.start)} – ${esc(p.end)}</span><span><strong>Sponsor:</strong> ${esc(p.sponsor)}</span></div>
        ${p.task ? `<p style="margin:.5rem 0 0;font-size:.9375rem;color:var(--ink-soft);">${esc(p.task)}</p>` : ''}</div>`;
    };
    const list = thrustParam ? PR.filter(p => matchThrust(p.thrust, thrustParam)) : PR;
    if (thrustParam) {
      const subCounts = { projects: list.length, ongoing: list.filter(isOngoing).length, completed: list.filter(p => !isOngoing(p)).length, pi: list.filter(isPI).length };
      document.querySelectorAll('.filter-bar [data-count]').forEach(el => { if (subCounts[el.dataset.count] !== undefined) el.textContent = subCounts[el.dataset.count]; });
    }
    thrustNote(list.length, 'projects', 'projects.html');
    proj.innerHTML = list.filter(isOngoing).map(card).join('') + list.filter(p => !isOngoing(p)).map(card).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderData(); // must run before the filter/search setup below queries the rendered items

  // 1. Highlight active navigation link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.site-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if (navToggle && siteNav) {
    const setNav = open => {
      siteNav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navToggle.innerHTML = open ? '&#10005;' : '&#9776;';
    };
    navToggle.addEventListener('click', () => setNav(!siteNav.classList.contains('open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && siteNav.classList.contains('open')) { setNav(false); navToggle.focus(); } });
  }

  // 3. Floating Back to Top Button
  const backBtn = document.createElement('button');
  backBtn.id = 'backToTop';
  backBtn.setAttribute('aria-label', 'Back to top');
  backBtn.innerHTML = '⬆ Top';
  document.body.appendChild(backBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. One-Click Email Copy with Toast Notification
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerText = 'Copied to clipboard!';
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  const copyEmailBtns = document.querySelectorAll('.copy-email-btn, [data-copy-email]');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'parksj0314@tu.ac.kr';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`📋 Copied email: ${email}`);
      }).catch(() => {
        showToast(`📋 Official Email: ${email}`);
      });
    });
  });

  // 5. Helper to update year-block visibility based on child items
  function updateYearBlockVisibility() {
    const yearBlocks = document.querySelectorAll('.year-block');
    yearBlocks.forEach(block => {
      const visibleItems = block.querySelectorAll('.searchable-item[style=""], .searchable-item:not([style*="display: none"])');
      let count = 0;
      visibleItems.forEach(item => {
        if (item.style.display !== 'none') {
          count++;
        }
      });
      if (count > 0) {
        block.style.display = '';
      } else {
        block.style.display = 'none';
      }
    });
  }

  // 6. Category filter + live search, applied together
  // a filter that would show nothing (e.g. no Events yet) is hidden
  const hasCat = (el, c) => (el.getAttribute('data-category') || '').split(' ').includes(c);
  const filterBtns = [...document.querySelectorAll('.filter-btn')];
  filterBtns.forEach(b => {
    const c = b.dataset.filter;
    if (c !== 'all' && ![...document.querySelectorAll('[data-category]')].some(el => hasCat(el, c))) b.hidden = true;
    b.setAttribute('aria-pressed', b.classList.contains('active'));
  });
  const searchInput = document.querySelector('.search-input');
  const noResults = document.querySelector('.no-results');
  let activeCat = 'all';

  function applyFilters() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let shown = 0;
    document.querySelectorAll('.searchable-item').forEach(item => {
      const catOK = activeCat === 'all' || !item.hasAttribute('data-category') || hasCat(item, activeCat);
      const textOK = !q || item.textContent.toLowerCase().includes(q);
      const show = catOK && textOK;
      item.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    updateYearBlockVisibility();
    // section headings with nothing left under them are hidden too
    document.querySelectorAll('#pub-list > h2').forEach(h => {
      let el = h.nextElementSibling, any = false;
      while (el && el.tagName !== 'H2') { if (el.classList.contains('year-block') && el.style.display !== 'none') any = true; el = el.nextElementSibling; }
      h.style.display = any ? '' : 'none';
    });
    if (noResults) noResults.hidden = shown > 0;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeCat = btn.getAttribute('data-filter');
      applyFilters();
    });
  });
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  // 7. Lightbox Modal for Research & Trajectory Figures
  const figLinks = document.querySelectorAll('.rf figure a, .pc-fig a');
  if (figLinks.length > 0) {
    const lb = document.createElement('div');
    lb.className = 'lightbox-backdrop';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-hidden', 'true');
    lb.setAttribute('aria-label', 'Figure viewer');
    lb.innerHTML = '<div class="lightbox-dialog">' +
      '<button type="button" class="lightbox-close" aria-label="Close figure viewer">&times;</button>' +
      '<img class="lightbox-img" src="" alt="">' +
      '<div class="lightbox-caption"></div>' +
      '</div>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox-img');
    const lbCap = lb.querySelector('.lightbox-caption');
    const lbClose = lb.querySelector('.lightbox-close');
    let lastTrigger = null;

    const closeLb = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
    };

    figLinks.forEach(a => {
      a.addEventListener('click', e => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        lastTrigger = a;
        const href = a.getAttribute('href');
        const img = a.querySelector('img');
        const fig = a.closest('figure');
        const capEl = fig ? fig.querySelector('figcaption') : null;
        const capText = capEl ? capEl.textContent.trim() : (img ? img.getAttribute('alt') || '' : '');
        lbImg.src = href;
        lbImg.alt = img ? img.getAttribute('alt') || '' : '';
        lbCap.textContent = capText;
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        lbClose.focus();
      });
    });

    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }
});
