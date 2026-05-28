/* shared-layout.js — Injects navbar, footer, Mili shell for category pages.
   Load after gobernanza-data.js. Runs sync at bottom of <body>. */
(function () {

  /* §1 CONSTANTS */
  var CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  var CATS = [
    { key: 'VIDA',         label: 'Vida',         href: '/vida/' },
    { key: 'AUTOS',        label: 'Autos',        href: '/autos/' },
    { key: 'CUMPLIMIENTO', label: 'Cumplimiento', href: '/cumplimiento/' },
    { key: 'GENERALES',    label: 'Generales',    href: '/generales/' },
  ];

  /* §2 NAVBAR */
  function buildNavbar() {
    var sm = (typeof SUBCATEGORY_MAP !== 'undefined') ? SUBCATEGORY_MAP : [];
    var items = CATS.map(function (c) {
      var cols = sm.filter(function (s) { return s.category === c.key; })
        .map(function (s) {
          return '<div class="mega-menu-column"><div class="mega-menu-title">' + s.name + '</div></div>';
        }).join('');
      return '<li class="has-dropdown"><a href="' + c.href + '">' + c.label + ' ' + CHEVRON + '</a>'
        + '<div class="mega-menu">' + cols + '</div></li>';
    }).join('');
    return '<nav id="navbar"><div class="container">'
      + '<a href="/"><img src="/Logo_Leon_V2_transparente.png" alt="M&amp;L Seguros" class="nav-logo"></a>'
      + '<ul class="nav-menu"><li><a href="/">Inicio</a></li>' + items
      + '<li><a href="/comparar/">Comparar</a></li>'
      + '<li><a href="/aliadas/">Aliadas</a></li></ul>'
      + '<div class="nav-right">'
      + '<div class="badge-ai" onclick="openMili()"><span class="pulse-dot"></span>IA 24/7</div>'
      + '<a href="/contacto/" class="btn-primary">Contacto</a>'
      + '</div>'
      + '<button class="nav-mobile-toggle" id="navMobileToggle" aria-label="Abrir menú" aria-expanded="false">'
      + '<span></span><span></span><span></span>'
      + '</button>'
      + '</div></nav>';
  }

  /* §3 MOBILE DRAWER */
  function buildMobileDrawer() {
    var links = [
      { href: '/',             label: 'Inicio' },
      { href: '/vida/',        label: 'Vida',        cat: true },
      { href: '/autos/',       label: 'Autos' },
      { href: '/cumplimiento/', label: 'Cumplimiento' },
      { href: '/generales/',   label: 'Generales' },
      { href: '/comparar/',    label: 'Comparar',    sep: true },
      { href: '/aliadas/',     label: 'Aliadas' },
    ];
    var lis = links.map(function (l) {
      return '<li>'
        + (l.sep ? '<span class="nav-mobile-cat-label">Herramientas</span>' : '')
        + '<a href="' + l.href + '">' + l.label + '</a></li>';
    }).join('');
    return '<div id="navMobileOverlay" class="nav-mobile-overlay">'
      + '<div class="nav-mobile-drawer">'
      + '<div class="nav-mobile-header">'
      + '<a href="/"><img src="/Logo_Leon_V2_transparente.png" alt="M&amp;L Seguros" class="nav-mobile-logo"></a>'
      + '<button class="nav-mobile-close" id="navMobileClose" aria-label="Cerrar men&uacute;">&#x2715;</button>'
      + '</div>'
      + '<ul class="nav-mobile-links">' + lis + '</ul>'
      + '<div class="nav-mobile-cta"><a href="/contacto/" class="btn-primary">Contacto</a></div>'
      + '</div></div>';
  }

  /* §3b SVG_HELPERS */
  function svgWa()   { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'; }
  function svgEm()   { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2185B" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'; }
  function svgPin()  { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'; }
  function svgFb()   { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'; }
  function svgLi()   { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'; }
  function svgYt()   { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>'; }
  function svgIg()   { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'; }
  function svgSend() { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'; }

  /* §4 FOOTER */
  function buildFooter() {
    return '<footer><div class="footer-main">'
      + '<div>'
      + '<a href="/"><img src="/Logo_Leon_V2_transparente.png" alt="M&amp;L Seguros" class="footer-logo"></a>'
      + '<p class="footer-info">Consultores de Seguros &middot; Bogot&aacute;, Colombia<br>NIT: 901331365-1</p>'
      + '<div class="social-icons">'
      + '<a href="https://www.facebook.com/people/Isagis-Technologies/61576177173753/" class="social-icon" aria-label="Facebook" target="_blank" rel="noopener">' + svgFb() + '</a>'
      + '<a href="https://www.linkedin.com/company/isagis-technologies/" class="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener">' + svgLi() + '</a>'
      + '<a href="https://www.youtube.com/@IsaGISTechnologies" class="social-icon" aria-label="YouTube" target="_blank" rel="noopener">' + svgYt() + '</a>'
      + '<a href="https://www.instagram.com/isagistechnologies/" class="social-icon" aria-label="Instagram" target="_blank" rel="noopener">' + svgIg() + '</a>'
      + '</div></div>'
      + '<div><div class="footer-column-label">NAVEGACI&Oacute;N</div><ul class="footer-links">'
      + '<li><a href="/">Inicio</a></li>'
      + '<li><a href="/vida/">Vida</a></li>'
      + '<li><a href="/autos/">Autos</a></li>'
      + '<li><a href="/cumplimiento/">Cumplimiento</a></li>'
      + '<li><a href="/generales/">Generales</a></li>'
      + '<li><a href="/comparar/">Comparar</a></li>'
      + '<li><a href="/aliadas/">Aliadas</a></li>'
      + '<li><a href="/contacto/">Contacto</a></li>'
      + '</ul></div>'
      + '<div><div class="footer-column-label">CONTACTO</div>'
      + '<div class="footer-contact-item">' + svgWa() + '<span>+57 320 278 0611</span></div>'
      + '<div class="footer-contact-item">' + svgEm() + '<span>mateusyd@segurosmyl.com</span></div>'
      + '<div class="footer-contact-item">' + svgPin() + '<span>Bogot&aacute;, Colombia</span></div>'
      + '</div></div>'
      + '<div class="footer-bottom">'
      + '<div class="footer-copyright">&copy; 2025 Consultores de Seguros M&amp;L &mdash; Todos los derechos reservados</div>'
      + '<div class="footer-mili-status"><span class="pulse-dot"></span>Mili IA disponible 24/7</div>'
      + '</div></footer>';
  }

  /* §5 MILI */
  function buildMiliShell() {
    return '<button class="mili-fab-floating" onclick="openMili()">'
      + '<div class="mili-fab-avatar-wrapper"><div class="mili-fab-avatar">M</div><div class="mili-fab-status-dot"></div></div>'
      + '<div class="mili-fab-content"><p class="mili-fab-title">Hablar con Mili</p><p class="mili-fab-subtitle">&#9679; Respuesta inmediata</p></div>'
      + '</button>'
      + '<div id="miliWindow" style="display:none" class="mili-window"><div class="mili-chat">'
      + '<div class="mili-header">'
      + '<div class="mili-header-avatar">M</div>'
      + '<div class="mili-header-info">'
      + '<p class="mili-header-name">Mili &middot; Asesora M&amp;L</p>'
      + '<p class="mili-header-status"><span class="pulse-dot" style="width:6px;height:6px"></span>En l&iacute;nea &middot; Responde en segundos</p>'
      + '</div>'
      + '<button class="mili-close-btn" onclick="closeMili()">&#x2715;</button>'
      + '</div>'
      + '<div class="mili-messages" id="miliMessages"></div>'
      + '<div class="quick-chips" id="miliQuickChips"></div>'
      + '<div class="mili-input-area">'
      + '<input type="text" class="mili-input" id="miliInput" placeholder="Escribe tu pregunta..." autocomplete="off">'
      + '<button class="mili-send" id="miliSendBtn" aria-label="Enviar">' + svgSend() + '</button>'
      + '</div>'
      + '</div></div>';
  }

  /* §6 INJECT */
  function injectLayout() {
    if (document.getElementById('navbar')) { return; }
    document.body.insertAdjacentHTML('afterbegin', buildNavbar());
    document.body.insertAdjacentHTML('beforeend', buildFooter() + buildMiliShell());
    document.body.insertAdjacentHTML('beforeend', buildMobileDrawer());

    var nav     = document.getElementById('navbar');
    var toggle  = document.getElementById('navMobileToggle');
    var overlay = document.getElementById('navMobileOverlay');
    var closeBtn= document.getElementById('navMobileClose');

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 10) { nav.classList.add('scrolled'); }
      else { nav.classList.remove('scrolled'); }
    }, { passive: true });

    function openMobileNav() {
      overlay.classList.add('open');
      document.body.classList.add('nav-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closeMobileNav() {
      overlay.classList.remove('open');
      document.body.classList.remove('nav-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', openMobileNav);
    closeBtn.addEventListener('click', closeMobileNav);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeMobileNav(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMobileNav(); }
    });
  }

  injectLayout();

}());
