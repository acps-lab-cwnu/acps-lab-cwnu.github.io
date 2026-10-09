/* ==========================================================================
   Main JavaScript Interactivity & UX Enhancements
   ========================================================================== */

// Content lives in data/*.js (window.PUBLICATIONS / PROJECTS / NEWS); pages only hold empty containers.
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const boldMe = a => esc(a).replace(/Park SJ/g, '<strong>Park SJ</strong>');
const nowYM = (() => { const d = new Date(); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0'); })();
const isOngoing = p => p.end >= nowYM; // 'YYYY.MM' strings compare correctly

function pubItem(p) {
  const title = p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
  return `<div class="pub-item searchable-item">
    <div class="pub-title">${title}</div>
    <div class="pub-authors">${boldMe(p.authors)}</div>
    <div class="pub-journal"><span class="badge badge-${esc(p.index.toLowerCase())}">${esc(p.index)}</span> <span>${esc(p.venue)}${p.note ? ` (${esc(p.note)})` : ''}, ${p.year}</span></div>
  </div>`;
}

function textList(title, items) {
  if (!items.length) return '';
  return `<div class="year-block"><h3 class="year-heading">${title} (${items.length})</h3>` +
    items.map(t => `<div class="pub-item searchable-item"><div class="pub-authors">${boldMe(typeof t === 'string' ? t : t.text)}</div></div>`).join('') + '</div>';
}

function renderData() {
  const P = window.PUBLICATIONS, J = P ? P.journal : [], PR = window.PROJECTS || [];
  const counts = { journal: J.length, projects: PR.length, ongoing: PR.filter(isOngoing).length, transfers: P ? P.transfers.length : 0 };
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = counts[el.dataset.count] ?? ''; });

  const news = document.getElementById('news-list');
  if (news && window.NEWS) {
    const n = +news.dataset.limit || window.NEWS.length;
    news.innerHTML = window.NEWS.slice(0, n).map(x => `<li><span class="news-date">${esc(x.date)}</span> ${esc(x.text)}</li>`).join('');
  }

  const featured = document.getElementById('featured-pubs');
  if (featured) featured.innerHTML = J.filter(p => p.featured).map(p => `<div class="card" style="padding:1.5rem;">
      <span class="badge badge-scie" style="margin-bottom:.75rem;">${esc(p.venue)} (${p.year})</span>
      <h4 style="margin-bottom:.5rem;line-height:1.4;"><a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${esc(p.title)}</a></h4>
      <p style="font-size:.875rem;color:var(--ink-soft);margin:0;">${boldMe(p.authors)}</p></div>`).join('');

  const pubs = document.getElementById('pub-list');
  if (pubs && P) {
    const years = [...new Set(J.map(p => p.year))].sort((a, b) => b - a);
    pubs.innerHTML = '<h2>Journal Papers</h2>' + years.map(y => {
      const list = J.filter(p => p.year === y);
      return `<div class="year-block"><h3 class="year-heading">${y} (${list.length})</h3>${list.map(pubItem).join('')}</div>`;
    }).join('') +
      '<h2 style="margin-top:3rem;">Conferences, Patents &amp; Books</h2>' +
      textList('International Conferences', P.conference_international) +
      textList('Domestic Conferences', P.conference_domestic) +
      textList('Patent Applications', P.patents) +
      textList('Technology Transfers', P.transfers) +
      textList('Books', P.books);
  }

  const proj = document.getElementById('project-list');
  if (proj) {
    const card = p => {
      const on = isOngoing(p);
      return `<div class="project-card searchable-item" data-category="${on ? 'ongoing' : 'completed'}">
        <div class="project-header"><span class="project-title">${esc(p.title)}</span>
          <div><span class="badge badge-${on ? 'ongoing' : 'completed'}">${on ? 'Ongoing' : 'Completed'}</span> <span class="badge badge-${/책임자/.test(p.role) ? 'pi' : 'copi'}">${esc(p.role)}</span></div></div>
        <div class="project-meta"><span><strong>Period:</strong> ${esc(p.start)} – ${esc(p.end)}</span><span><strong>Sponsor:</strong> ${esc(p.sponsor)}</span></div>
        ${p.task ? `<p style="margin:.5rem 0 0;font-size:.9375rem;color:var(--ink-soft);">${esc(p.task)}</p>` : ''}</div>`;
    };
    proj.innerHTML = PR.filter(isOngoing).map(card).join('') + PR.filter(p => !isOngoing(p)).map(card).join('');
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
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
      const expanded = siteNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
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

  // 6. Category Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-filter');

        filterItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (cat === 'all' || (itemCat && itemCat.includes(cat))) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });

        updateYearBlockVisibility();
      });
    });
  }

  // 7. Live Search Logic
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const searchItems = document.querySelectorAll('.searchable-item');

      searchItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      updateYearBlockVisibility();
    });
  }
});
