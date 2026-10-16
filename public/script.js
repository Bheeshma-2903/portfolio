const grid = document.getElementById('grid');
const filters = document.getElementById('filters');
let projects = [];
let active = 'All';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^https?:\/\//.test(u || '') ? esc(u) : '';

function render() {
  const list = active === 'All' ? projects : projects.filter(p => p.tech.includes(active));
  if (!list.length) { grid.innerHTML = '<p class="muted">No projects yet. Add one through the API or run <code>npm run seed</code>.</p>'; return; }
  grid.innerHTML = list.map(p => `
    <article class="card">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <div class="tags">${p.tech.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="links">
        ${safeUrl(p.liveUrl) ? `<a href="${safeUrl(p.liveUrl)}" target="_blank" rel="noopener">Live demo</a>` : ''}
        ${safeUrl(p.repoUrl) ? `<a href="${safeUrl(p.repoUrl)}" target="_blank" rel="noopener">Source code</a>` : ''}
      </div>
    </article>`).join('');
}
function renderFilters() {
  const techs = ['All', ...new Set(projects.flatMap(p => p.tech))];
  filters.innerHTML = techs.map(t => `<button class="chip" aria-pressed="${t === active}" data-t="${esc(t)}">${esc(t)}</button>`).join('');
}
filters.addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  active = b.dataset.t; renderFilters(); render();
});
fetch('/api/projects')
  .then(r => { if (!r.ok) throw 0; return r.json(); })
  .then(d => { projects = d; renderFilters(); render(); })
  .catch(() => { grid.innerHTML = '<p class="muted">Could not load projects. Refresh the page to try again.</p>'; });

const form = document.getElementById('form');
const status = document.getElementById('status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  status.className = ''; status.textContent = 'Sending…';
  try {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    status.className = 'ok'; status.textContent = 'Message sent. Thanks for reaching out.'; form.reset();
  } catch (err) { status.className = 'err'; status.textContent = err.message || 'Could not send your message. Try again.'; }
});
document.getElementById('year').textContent = new Date().getFullYear();
