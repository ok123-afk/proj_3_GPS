// ===== EventFlow — Navigation =====

// roles: null  = visível para todos (incluindo não autenticado)
// roles: array = apenas utilizadores com esse role vêem o item
//
// Regras por role (derivadas do enunciado do projeto):
//
//  Admin        → tudo
//
//  Organizador  → Dashboard, Eventos, Agenda, Oradores, Inscrições,
//                 Interação, Monitorização, Comunicação
//                 (4.2 criar/editar eventos; 4.3 agenda; 4.4 oradores;
//                  4.5 inscrições/check-in; 4.7 métricas; 4.8 comunicações)
//
//  Orador       → Dashboard, Agenda, Oradores, Interação, Comunicação
//                 (4.3 ver sessões próprias; 4.4 perfil público;
//                  4.6 Q&A das suas sessões; 4.8 notif. alterações horário)
//
//  Participante → Dashboard, Agenda, Inscrições, Interação, Comunicação
//                 (4.3 visualização agenda + favoritos; 4.5 inscrever-se;
//                  4.6 feedback/Q&A/votações; 4.8 confirmações e lembretes)
//
//  (não auth)   → Dashboard, Interação  (route guard redireciona o resto)
const NAV_ITEMS = [
  { section: 'Principal' },
  { id: 'dashboard',      icon: '📊',  label: 'Dashboard',     href: 'index.html',          roles: null },
  { section: 'Gestão' },
  { id: 'utilizadores',   icon: '👤',  label: 'Utilizadores',  href: 'utilizadores.html',   roles: ['Admin'] },
  { id: 'eventos',        icon: '🗓️', label: 'Eventos',       href: 'eventos.html',        roles: ['Admin', 'Organizador'] },
  { id: 'agenda',         icon: '⏱️', label: 'Agenda',        href: 'agenda.html',         roles: ['Admin', 'Organizador', 'Orador', 'Participante'] },
  { id: 'oradores',       icon: '🎤',  label: 'Oradores',      href: 'oradores.html',       roles: ['Admin', 'Organizador', 'Orador'] },
  { id: 'inscricoes',     icon: '✅',  label: 'Inscrições',    href: 'inscricoes.html',     roles: ['Admin', 'Organizador', 'Participante'], badge: '12' },
  { section: 'Engagement' },
  { id: 'interacao',      icon: '💬',  label: 'Interação',     href: 'interacao.html',      roles: null },
  { id: 'monitorizacao',  icon: '📈',  label: 'Monitorização', href: 'monitorizacao.html',  roles: ['Admin', 'Organizador'] },
  { id: 'comunicacao',    icon: '🔔',  label: 'Comunicação',   href: 'comunicacao.html',    roles: ['Admin', 'Organizador', 'Orador', 'Participante'], badge: '3' },
];

function buildSidebar(activePage) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  const session = _efGetSession();
  const role = session ? session.role : null;

  // Update sidebar user card (use querySelector — works in all pages)
  const av = document.querySelector('.sidebar-footer .user-avatar');
  const nm = document.querySelector('.sidebar-footer .user-info .name');
  const rl = document.querySelector('.sidebar-footer .user-info .role');
  if (session) {
    if (av) av.textContent = _efInitials(session.name || 'U');
    if (nm) nm.textContent = session.name || 'Utilizador';
    if (rl) rl.textContent = session.role || '';
  } else {
    if (av) av.textContent = '?';
    if (nm) nm.textContent = 'Visitante';
    if (rl) rl.textContent = '';
  }

  // Build nav — only items allowed for this role
  let html = '';
  let pendingSection = null;

  NAV_ITEMS.forEach(item => {
    if (item.section) {
      pendingSection = item.section;
      return;
    }
    // roles: null → visível para todos (auth ou não)
    // roles: array → só visível se autenticado E com o role certo
    const visible = !item.roles || (role && item.roles.includes(role));
    if (!visible) return;

    // Only print section header when at least one item under it is visible
    if (pendingSection) {
      html += `<div class="nav-section">${pendingSection}</div>`;
      pendingSection = null;
    }

    const active = item.id === activePage ? 'active' : '';
    const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    html += `<a class="nav-item ${active}" href="${item.href}">
      <span class="icon">${item.icon}</span>
      <span>${item.label}</span>
      ${badge}
    </a>`;
  });

  nav.innerHTML = html;

  // Logout button in sidebar footer
  _efBuildLogout(session);

  // Route guard — páginas abertas sem autenticação: Dashboard (index.html) e Interação
  // Todas as outras redirecionam para login se não houver sessão
  const OPEN_PAGES = ['index.html', 'interacao.html', 'login.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!session || !session.userId) {
    if (!OPEN_PAGES.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  }
}

function _efBuildLogout(session) {
  const footer = document.querySelector('.sidebar-footer');
  if (!footer) return;
  const existing = footer.querySelector('.sidebar-logout');
  if (existing) existing.remove();
  if (!session || !session.userId) return;

  const btn = document.createElement('button');
  btn.className = 'sidebar-logout';
  btn.innerHTML = `<span>🚪</span><span>Terminar Sessão</span>`;
  btn.onclick = () => {
    localStorage.removeItem('ef_session');
    window.location.href = 'login.html';
  };
  footer.appendChild(btn);
}

function _efGetSession() {
  try { return JSON.parse(localStorage.getItem('ef_session')) || null; } catch { return null; }
}

function _efInitials(n) {
  return (n || 'U').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
}

function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || '✅'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function sidebarToggle() {
  document.getElementById('sidebar').classList.toggle('open');
}