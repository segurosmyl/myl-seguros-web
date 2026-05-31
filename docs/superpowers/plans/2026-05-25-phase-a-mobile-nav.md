# Phase A: Mobile Navigation + Global Mobile Framework

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement functional mobile navigation on all 31 pages plus global mobile framework fixes (overflow containment, Mili FAB overlap).

**Architecture:** Two navbar codepaths exist — `index.html` (home, standalone CSS) and `js/shared-layout.js` + `css/shared.css` (all other 30 pages). Both need a hamburger button + slide-in right drawer. Shared.css already has a `.nav-mobile-toggle { display: none }` stub but no drawer CSS or JS. All changes are `@media (max-width: 768px)` additive — zero desktop regression risk.

**Tech Stack:** Vanilla JS, CSS media queries, Playwright (QA). No build step.

---

## Key Facts from Audit

- `css/shared.css` already has: `@media (max-width: 768px) { .nav-menu, .nav-right .badge-ai { display: none; } .nav-mobile-toggle { display: flex; } }`
- `index.html` does NOT load `shared.css` — all styles are inline `<style>` blocks
- Home page Mili: a side-mounted `position:fixed; top:50%; right:0` button with inline styles (no class)
- Shared-layout Mili FAB: already collapses to 52px circle at ≤480px in shared.css
- Footer overflow in home page: caused by `.footer-main { grid-template-columns: 1.5fr 1fr 1fr }` in inline styles with no mobile override → OUT OF SCOPE Phase A
- Home page overflow source: footer 3-column grid + carousel cards → OUT OF SCOPE Phase A
- Nav drawer z-index plan: overlay=1020, drawer=1030 (above navbar z-index:1000, below mili-window z-index:9999)

---

## Task 1: Mobile Drawer CSS — css/shared.css

**Files:**
- Modify: `css/shared.css` (append new section at end)

- [ ] **Step 1: Append mobile drawer styles to shared.css**

Append immediately after the existing `@media (max-width: 560px)` block:

```css
/* ══════════════════════════════════════════════════════
   MOBILE NAV DRAWER
   ══════════════════════════════════════════════════════ */
.nav-mobile-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(10,10,20,0.75);
  z-index: 1020;
  -webkit-tap-highlight-color: transparent;
}
.nav-mobile-overlay.open { display: block; }

.nav-mobile-drawer {
  position: absolute; top: 0; right: 0;
  width: 280px; max-width: 85vw;
  height: 100%;
  background: #1A1A2E;
  display: flex; flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transform: translateX(100%);
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  z-index: 1030;
}
.nav-mobile-overlay.open .nav-mobile-drawer { transform: translateX(0); }

.nav-mobile-header {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  min-height: 64px;
  flex-shrink: 0;
}
.nav-mobile-logo { height: 40px; width: auto; object-fit: contain; }

.nav-mobile-close {
  background: none; border: none;
  color: rgba(255,255,255,0.75);
  font-size: 20px; cursor: pointer;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.nav-mobile-close:hover,
.nav-mobile-close:active { background: rgba(255,255,255,0.1); color: #fff; }

.nav-mobile-links {
  list-style: none;
  flex: 1;
  padding: 8px 0;
}
.nav-mobile-links li {
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.nav-mobile-links a {
  display: flex; align-items: center;
  padding: 0 24px;
  min-height: 56px;
  color: rgba(255,255,255,0.82);
  text-decoration: none;
  font-size: 16px; font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}
.nav-mobile-links a:hover,
.nav-mobile-links a:active {
  background: rgba(194,24,91,0.12);
  color: #fff;
}
.nav-mobile-links .nav-mobile-cat-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #C2185B;
  padding: 20px 24px 6px;
  display: block;
}

.nav-mobile-cta {
  padding: 20px 24px;
  border-top: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.nav-mobile-cta .btn-primary {
  width: 100%; justify-content: center;
  min-height: 48px; font-size: 15px;
}

/* Hamburger → X animation */
.nav-mobile-toggle.is-open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.nav-mobile-toggle.is-open span:nth-child(2) { opacity: 0; }
.nav-mobile-toggle.is-open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}
.nav-mobile-toggle span { transition: all 0.25s ease; }

/* Prevent body scroll when drawer is open */
body.nav-open { overflow: hidden; }
```

---

## Task 2: Hamburger + Drawer HTML/JS — js/shared-layout.js

**Files:**
- Modify: `js/shared-layout.js`

- [ ] **Step 1: Add hamburger button to buildNavbar()**

In `buildNavbar()`, add the hamburger button before the closing `</div></nav>` of nav-right:

Change the last line of the returned string from:
```javascript
      + '<div class="nav-right">'
      + '<div class="badge-ai" onclick="openMili()"><span class="pulse-dot"></span>IA 24/7</div>'
      + '<a href="/contacto/" class="btn-primary">Contacto</a>'
      + '</div></div></nav>';
```
To:
```javascript
      + '<div class="nav-right">'
      + '<div class="badge-ai" onclick="openMili()"><span class="pulse-dot"></span>IA 24/7</div>'
      + '<a href="/contacto/" class="btn-primary">Contacto</a>'
      + '</div>'
      + '<button class="nav-mobile-toggle" id="navMobileToggle" aria-label="Abrir menú" aria-expanded="false">'
      + '<span></span><span></span><span></span>'
      + '</button>'
      + '</div></nav>';
```

- [ ] **Step 2: Add buildMobileDrawer() function**

Add this function in the IIFE, after `buildNavbar()`:

```javascript
  function buildMobileDrawer() {
    var links = [
      { href: '/', label: 'Inicio' },
      { href: '/vida/', label: 'Vida', cat: true },
      { href: '/autos/', label: 'Autos' },
      { href: '/cumplimiento/', label: 'Cumplimiento' },
      { href: '/generales/', label: 'Generales' },
      { href: '/comparar/', label: 'Comparar', sep: true },
      { href: '/aliadas/', label: 'Aliadas' },
    ];
    var lis = links.map(function(l) {
      return '<li>' + (l.sep ? '<span class="nav-mobile-cat-label">Herramientas</span>' : '')
        + '<a href="' + l.href + '">' + l.label + '</a></li>';
    }).join('');
    return '<div id="navMobileOverlay" class="nav-mobile-overlay">'
      + '<div class="nav-mobile-drawer">'
      + '<div class="nav-mobile-header">'
      + '<a href="/"><img src="/Logo_Leon_V2_transparente.png" alt="M&amp;L Seguros" class="nav-mobile-logo"></a>'
      + '<button class="nav-mobile-close" id="navMobileClose" aria-label="Cerrar menú">&#x2715;</button>'
      + '</div>'
      + '<ul class="nav-mobile-links">' + lis + '</ul>'
      + '<div class="nav-mobile-cta"><a href="/contacto/" class="btn-primary">Contacto</a></div>'
      + '</div></div>';
  }
```

- [ ] **Step 3: Wire toggle JS in injectLayout()**

In `injectLayout()`, after the scroll event listener, add:

```javascript
    document.body.insertAdjacentHTML('beforeend', buildMobileDrawer());
    var toggle  = document.getElementById('navMobileToggle');
    var overlay = document.getElementById('navMobileOverlay');
    var closeBtn= document.getElementById('navMobileClose');

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
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) { closeMobileNav(); }
    });
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { closeMobileNav(); }
    });
```

---

## Task 3: Home Page Mobile Nav — index.html

**Files:**
- Modify: `index.html`

The home page has its own `<nav id="navbar">` (no shared-layout.js) and a `@media (max-width: 768px)` block in inline `<style>`.

- [ ] **Step 1: Add hamburger button to nav HTML in index.html**

Find the nav-right closing div in the home page nav (around line 2006):
```html
      <div class="nav-right">
        <div class="badge-ai" onclick="openMili()">
          <span class="pulse-dot"></span>
          IA 24/7
        </div>
        <a href="#contacto" class="btn-primary">Contacto</a>
      </div>
    </div>
  </nav>
```

Change to:
```html
      <div class="nav-right">
        <div class="badge-ai" onclick="openMili()">
          <span class="pulse-dot"></span>
          IA 24/7
        </div>
        <a href="#contacto" class="btn-primary">Contacto</a>
      </div>
      <button class="nav-mobile-toggle" id="navMobileToggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Nav Drawer -->
  <div id="navMobileOverlay" class="nav-mobile-overlay">
    <div class="nav-mobile-drawer">
      <div class="nav-mobile-header">
        <a href="/"><img src="Logo_Leon_V2_transparente.png" alt="M&L Seguros" class="nav-mobile-logo"></a>
        <button class="nav-mobile-close" id="navMobileClose" aria-label="Cerrar menú">&#x2715;</button>
      </div>
      <ul class="nav-mobile-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/vida/">Vida</a></li>
        <li><a href="/autos/">Autos</a></li>
        <li><a href="/cumplimiento/">Cumplimiento</a></li>
        <li><a href="/generales/">Generales</a></li>
        <li><span class="nav-mobile-cat-label">Herramientas</span><a href="/comparar/">Comparar</a></li>
        <li><a href="/aliadas/">Aliadas</a></li>
      </ul>
      <div class="nav-mobile-cta">
        <a href="/contacto/" class="btn-primary">Contacto</a>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Add mobile nav CSS to index.html inline @media block**

In the existing `@media (max-width: 768px)` block inside `<style>`, add:
```css
      .nav-mobile-toggle { display: flex; }
      /* Reuse drawer styles from shared.css pattern */
      .nav-mobile-overlay {
        display: none;
        position: fixed; inset: 0;
        background: rgba(10,10,20,0.75);
        z-index: 1020;
      }
      .nav-mobile-overlay.open { display: block; }
      .nav-mobile-drawer {
        position: absolute; top: 0; right: 0;
        width: 280px; max-width: 85vw;
        height: 100%; background: #1A1A2E;
        display: flex; flex-direction: column;
        overflow-y: auto;
        transform: translateX(100%);
        transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        z-index: 1030;
      }
      .nav-mobile-overlay.open .nav-mobile-drawer { transform: translateX(0); }
      .nav-mobile-header {
        display: flex; align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        min-height: 64px;
      }
      .nav-mobile-logo { height: 40px; width: auto; }
      .nav-mobile-close {
        background: none; border: none;
        color: rgba(255,255,255,0.75); font-size: 20px;
        cursor: pointer; width: 44px; height: 44px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 8px;
      }
      .nav-mobile-links { list-style: none; flex: 1; padding: 8px 0; }
      .nav-mobile-links li { border-bottom: 1px solid rgba(255,255,255,0.05); }
      .nav-mobile-links a {
        display: flex; align-items: center;
        padding: 0 24px; min-height: 56px;
        color: rgba(255,255,255,0.82);
        text-decoration: none; font-size: 16px; font-weight: 500;
      }
      .nav-mobile-links .nav-mobile-cat-label {
        font-size: 10px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        color: #C2185B; padding: 20px 24px 6px; display: block;
      }
      .nav-mobile-cta {
        padding: 20px 24px;
        border-top: 1px solid rgba(255,255,255,0.08);
      }
      .nav-mobile-cta .btn-primary {
        width: 100%; justify-content: center;
        min-height: 48px; font-size: 15px;
        display: flex; text-align: center;
      }
      .nav-mobile-toggle.is-open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      .nav-mobile-toggle.is-open span:nth-child(2) { opacity: 0; }
      .nav-mobile-toggle.is-open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
      body.nav-open { overflow: hidden; }
```

- [ ] **Step 3: Add toggle JS to index.html**

Find the `<script>` block near the end of index.html (before `</body>`). Add the mobile nav toggle JS:

```javascript
  // Mobile Nav
  (function() {
    var toggle  = document.getElementById('navMobileToggle');
    var overlay = document.getElementById('navMobileOverlay');
    var closeBtn= document.getElementById('navMobileClose');
    if (!toggle) return;
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
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) { closeMobileNav(); }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { closeMobileNav(); }
    });
  }());
```

---

## Task 4: Fix Mili Side Button Overlap on Home Page

**Files:**
- Modify: `index.html`

The home page has a `position:fixed; top:50%; right:0` Mili button with fully inline styles. It cannot be controlled by CSS without an ID or class.

- [ ] **Step 1: Add id to the home page Mili side button**

Find the button at line ~2500:
```html
  <button onclick="openMili()" style="
    position:fixed; top:50%; right:0;
```

Change to:
```html
  <button id="miliSideBtn" onclick="openMili()" style="
    position:fixed; top:50%; right:0;
```

- [ ] **Step 2: Add CSS override in the @media (max-width: 768px) block**

In the existing `@media (max-width: 768px)` inline style block, add:
```css
      #miliSideBtn {
        top: auto;
        bottom: 28px;
        right: 28px;
        border-radius: 50%;
        width: 52px; height: 52px;
        padding: 0;
        justify-content: center;
        border: 1px solid rgba(194,24,91,0.45);
        transform: none;
      }
      #miliSideBtn > div:last-child { display: none; }
```

Note: inline styles override media queries unless `!important` is used. Since the button uses `style=""`, we need to handle this differently — we move it with JS OR we keep just the id for reference. Actually, inline styles on the element take highest specificity priority. However, since `top:50%` is inline, a media-query CSS rule for `#miliSideBtn { top: auto; bottom: 28px; }` will NOT override the inline `top:50%`.

**Revised approach for Step 2:**

Instead of CSS override (blocked by inline styles), use JS at page load to reposition:

```javascript
  // Mili side button repositioning on mobile
  (function() {
    var btn = document.getElementById('miliSideBtn');
    if (!btn) return;
    function adjustMiliBtn() {
      if (window.innerWidth <= 768) {
        btn.style.top = 'auto';
        btn.style.bottom = '28px';
        btn.style.right = '28px';
        btn.style.borderRadius = '50%';
        btn.style.width = '52px';
        btn.style.height = '52px';
        btn.style.padding = '0';
        btn.style.justifyContent = 'center';
        btn.style.transform = 'none';
        var textDiv = btn.querySelector('div:last-child');
        if (textDiv) { textDiv.style.display = 'none'; }
      } else {
        btn.style.top = '50%';
        btn.style.bottom = '';
        btn.style.right = '0';
        btn.style.borderRadius = '16px 0 0 16px';
        btn.style.width = '';
        btn.style.height = '';
        btn.style.padding = '16px 14px 16px 16px';
        btn.style.justifyContent = '';
        btn.style.transform = 'translateY(-50%)';
        var textDiv = btn.querySelector('div:last-child');
        if (textDiv) { textDiv.style.display = ''; }
      }
    }
    adjustMiliBtn();
    window.addEventListener('resize', adjustMiliBtn, { passive: true });
  }());
```

---

## Task 5: QA — Local Playwright Verification

**Files:**
- Run: `node qa-mobile-phase-a.js` (create script)

- [ ] **Step 1: Start local dev server**

```bash
npx serve . -p 3001
```

- [ ] **Step 2: Create QA script qa-mobile-phase-a.js**

```javascript
const { chromium } = require('playwright');
const BASE = 'http://localhost:3001';
const SHOTS = 'qa-phase-a-screenshots';
const fs = require('fs');
if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS);

const VIEWPORTS = [
  { w: 320, h: 568, l: '320' },
  { w: 375, h: 667, l: '375' },
  { w: 390, h: 844, l: '390' },
  { w: 414, h: 896, l: '414' },
  { w: 768, h: 1024, l: '768' },
  { w: 1440, h: 900, l: '1440-desktop' },
];

const ROUTES = [
  { path: '/', l: 'home' },
  { path: '/vida/', l: 'vida' },
  { path: '/individual/', l: 'individual' },
  { path: '/comparar/', l: 'comparar' },
  { path: '/aliadas/', l: 'aliadas' },
  { path: '/contacto/', l: 'contacto' },
];

async function testNav(page, vp, routeL) {
  const res = await page.evaluate(() => {
    const toggle = document.getElementById('navMobileToggle');
    const overlay = document.getElementById('navMobileOverlay');
    return {
      toggleFound: !!toggle,
      toggleVisible: toggle ? toggle.offsetParent !== null : false,
      toggleH: toggle ? toggle.getBoundingClientRect().height : 0,
      toggleW: toggle ? toggle.getBoundingClientRect().width : 0,
      overlayFound: !!overlay,
    };
  });

  let drawerOpened = false;
  if (res.toggleVisible) {
    await page.click('#navMobileToggle');
    await page.waitForTimeout(350);
    drawerOpened = await page.evaluate(() => {
      const overlay = document.getElementById('navMobileOverlay');
      return overlay ? overlay.classList.contains('open') : false;
    });
    // close it
    await page.keyboard.press('Escape');
    await page.waitForTimeout(350);
  }

  return { ...res, drawerOpened };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      await page.goto(BASE + route.path, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${SHOTS}/${vp.l}__${route.l}__fold.png` });

      const nav = await testNav(page, vp, route.l);
      const overflow = await page.evaluate(() => ({
        docW: document.documentElement.scrollWidth,
        vw: window.innerWidth,
        overflows: document.documentElement.scrollWidth > window.innerWidth + 4,
      }));

      const isMobile = vp.w <= 768;
      const pass = isMobile ? (nav.toggleVisible && nav.drawerOpened) : !nav.toggleVisible;
      const label = `[${vp.l}px] ${route.l}`;
      results.push({ label, pass, nav, overflow });

      const icon = pass ? '✅' : '❌';
      console.log(`${icon} ${label}: toggle=${nav.toggleVisible} drawerOpened=${nav.drawerOpened} overflow=${overflow.overflows}(${overflow.docW}px)`);

      // Screenshot with drawer open (mobile only, first route per viewport)
      if (isMobile && nav.toggleVisible && route.l === 'home') {
        await page.click('#navMobileToggle');
        await page.waitForTimeout(350);
        await page.screenshot({ path: `${SHOTS}/${vp.l}__${route.l}__drawer-open.png` });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(350);
      }
    }
    await ctx.close();
  }

  const passed = results.filter(r => r.pass).length;
  console.log(`\nTotal: ${passed}/${results.length} passed`);
  await browser.close();
})();
```

- [ ] **Step 3: Run QA and capture results**

```bash
node qa-mobile-phase-a.js
```

Expected output: all mobile routes show `toggle=true drawerOpened=true`. Desktop 1440px shows `toggle=false` (hamburger hidden on desktop).

- [ ] **Step 4: Review drawer-open screenshots**

Verify: `qa-phase-a-screenshots/375__home__drawer-open.png` shows the full drawer with nav links, Contacto CTA, close button.

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|---|---|
| Hamburger visible at ≤768px | Task 1 (shared.css already has display:flex trigger), Task 2 (adds HTML) |
| Hidden desktop nav links at mobile | Already in shared.css; index.html has it in @media 768px |
| Slide-in mobile drawer | Task 1 (CSS), Task 2 (JS), Task 3 (HTML) |
| Close button | Task 2 + Task 3 |
| Tap outside overlay closes menu | Task 2 + Task 3 overlay click listener |
| Touch-friendly 44px tap targets | drawer links: min-height:56px |
| Logo remains visible | nav-mobile-header has logo |
| Contact CTA accessible | nav-mobile-cta has btn-primary |
| No mega-menu hover on mobile | Drawer is flat list only |
| No desktop regression | All drawer CSS is inside .nav-mobile-overlay, toggle display controlled by @media |
| Sitewide overflow fix | body/html already have overflow-x:hidden; drawer adds body.nav-open overflow:hidden |
| Mili FAB overlap fix | Task 4 |
| Z-index conflicts | overlay=1020, drawer=1030, nav=1000, mili=9999 — no conflicts |

**No placeholder issues found.**

**Type consistency: nav functions named consistently (openMobileNav/closeMobileNav) across both tasks.**
