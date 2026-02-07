import { gsap } from 'gsap';

/**
 * Panneau de parametres avec sections animees via GSAP
 */
export class ControlPanel {
  constructor(container, onUpdate, onExport, sceneRef) {
    this.container = container;
    this.onUpdate = onUpdate;
    this.onExport = onExport;
    this.sceneRef = sceneRef;
    this.activePanel = 'templates';

    this.params = {
      width: 85,
      height: 55,
      depth: 2,
      // Business card fields
      fullName: 'John Doe',
      jobTitle: 'CEO & Founder',
      phone: '06 12 34 56 78',
      email: 'john@email.com',
      website: 'www.example.com',
      // Text settings
      mainTextSize: 6,
      mainTextPositionY: 15,
      mainTextMode: 'emboss',
      mainTextColor: 0x2d2640,
      // Frame
      frameEnabled: false,
      frameThickness: 2,
      cardColor: 0xffffff,
      // Preset
      activePreset: 'business'
    };

    this.render();
    this.attachEvents();
    this.showPanelSection(this.activePanel, false);
    this.animateIn();
  }

  render() {
    this.container.innerHTML = `
      <div class="settings-header">
        <h2>Parametres</h2>
      </div>

      <!-- TEMPLATES SECTION -->
      <div class="settings-section" data-section="templates">
        <div class="section-title">Presets</div>
        <div class="preset-grid">
          <button class="preset-btn active" data-preset="business">
            <div class="preset-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="6" y1="9" x2="12" y2="9"/>
                <line x1="6" y1="12" x2="10" y2="12"/>
                <line x1="6" y1="15" x2="14" y2="15"/>
              </svg>
            </div>
            <span>Business</span>
          </button>
          <button class="preset-btn" data-preset="minimal">
            <div class="preset-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <span>Minimal</span>
          </button>
          <button class="preset-btn" data-preset="credit-card">
            <div class="preset-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <span>Credit Card</span>
          </button>
        </div>
      </div>

      <div class="settings-section" data-section="dimensions">
        <div class="section-title">Dimensions (mm)</div>
        <div class="control-row">
          <span class="control-label">Largeur</span>
          <input type="number" class="control-input" id="width" value="${this.params.width}" min="20" max="200">
        </div>
        <div class="control-row">
          <span class="control-label">Hauteur</span>
          <input type="number" class="control-input" id="height" value="${this.params.height}" min="20" max="200">
        </div>
        <div class="control-row">
          <span class="control-label">Epaisseur</span>
          <input type="number" class="control-input" id="depth" value="${this.params.depth}" min="0.5" max="10" step="0.5">
        </div>
      </div>

      <!-- TEXT SECTION - Business Card Fields -->
      <div class="settings-section" data-section="text-fields">
        <div class="section-title">Informations</div>
        <div class="field-group">
          <label class="field-label">Nom complet</label>
          <input type="text" class="control-input full-width" id="fullName" value="${this.params.fullName}" placeholder="John Doe">
        </div>
        <div class="field-group">
          <label class="field-label">Poste / Titre</label>
          <input type="text" class="control-input full-width" id="jobTitle" value="${this.params.jobTitle}" placeholder="CEO & Founder">
        </div>
        <div class="field-group">
          <label class="field-label">Telephone</label>
          <input type="tel" class="control-input full-width" id="phone" value="${this.params.phone}" placeholder="06 12 34 56 78">
        </div>
        <div class="field-group">
          <label class="field-label">Email</label>
          <input type="email" class="control-input full-width" id="email" value="${this.params.email}" placeholder="john@email.com">
        </div>
        <div class="field-group">
          <label class="field-label">Site web</label>
          <input type="text" class="control-input full-width" id="website" value="${this.params.website}" placeholder="www.example.com">
        </div>
      </div>

      <div class="settings-section" data-section="text-style">
        <div class="section-title">Style texte</div>
        <div class="control-row">
          <span class="control-label">Taille</span>
          <input type="number" class="control-input" id="mainTextSize" value="${this.params.mainTextSize}" min="3" max="20">
        </div>
        <div class="control-row">
          <span class="control-label">Couleur</span>
          <div class="color-grid" id="textColorGrid">
            <div class="color-btn active" style="background:#2d2640" data-color="0x2d2640"></div>
            <div class="color-btn" style="background:#6b5f7a" data-color="0x6b5f7a"></div>
            <div class="color-btn" style="background:#7c5cbf" data-color="0x7c5cbf"></div>
            <div class="color-btn" style="background:#ffffff" data-color="0xffffff"></div>
            <div class="color-btn" style="background:#e8a84c" data-color="0xe8a84c"></div>
          </div>
        </div>
      </div>

      <div class="settings-section" data-section="mode">
        <div class="section-title">Mode</div>
        <div class="mode-switch">
          <button class="mode-btn active" data-mode="emboss">Relief</button>
          <button class="mode-btn" data-mode="engrave">Grave</button>
        </div>
      </div>

      <!-- BACKGROUND SECTION -->
      <div class="settings-section" data-section="background">
        <div class="section-title">Couleur de fond</div>
        <div class="color-grid large" id="cardColorGrid">
          <div class="color-btn active" style="background:#ffffff" data-color="0xffffff"></div>
          <div class="color-btn" style="background:#f5f0ff" data-color="0xf5f0ff"></div>
          <div class="color-btn" style="background:#e8e0f7" data-color="0xe8e0f7"></div>
          <div class="color-btn" style="background:#d4c4e8" data-color="0xd4c4e8"></div>
          <div class="color-btn" style="background:#b8a0d9" data-color="0xb8a0d9"></div>
          <div class="color-btn" style="background:#2d2640" data-color="0x2d2640"></div>
          <div class="color-btn" style="background:#4a4458" data-color="0x4a4458"></div>
          <div class="color-btn" style="background:#a8d5ba" data-color="0xa8d5ba"></div>
          <div class="color-btn" style="background:#f4d9a0" data-color="0xf4d9a0"></div>
          <div class="color-btn" style="background:#c5e8f7" data-color="0xc5e8f7"></div>
        </div>
      </div>

      <div class="settings-section" data-section="frame">
        <div class="section-title">Cadre</div>
        <div class="toggle-row">
          <span class="control-label">Activer</span>
          <div class="toggle-switch ${this.params.frameEnabled ? 'active' : ''}" id="frameToggle"></div>
        </div>
        <div class="slider-control" id="frameSliderGroup" style="opacity:${this.params.frameEnabled ? 1 : 0.5}">
          <div class="slider-header">
            <span>Epaisseur</span>
            <span id="frameThicknessValue">${this.params.frameThickness}mm</span>
          </div>
          <input type="range" class="slider-track" id="frameThickness" value="${this.params.frameThickness}" min="1" max="10" step="0.5">
        </div>
      </div>

      <!-- LOGO SECTION -->
      <div class="settings-section" data-section="logo">
        <div class="section-title">Logo</div>
        <div class="upload-zone" id="logoUpload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <span>Glisser un logo ou cliquer</span>
          <small>PNG, SVG (max 2MB)</small>
        </div>
      </div>

      <!-- SHAPE SECTION -->
      <div class="settings-section" data-section="shape">
        <div class="section-title">Formes</div>
        <div class="shape-grid">
          <button class="shape-btn" data-shape="circle">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="shape-btn" data-shape="square">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="shape-btn" data-shape="triangle">
            <svg viewBox="0 0 24 24"><polygon points="12,3 22,21 2,21" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="shape-btn" data-shape="star">
            <svg viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
      </div>

      <!-- IMAGES SECTION -->
      <div class="settings-section" data-section="images">
        <div class="section-title">Images</div>
        <div class="upload-zone" id="imageUpload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Ajouter une image</span>
          <small>JPG, PNG (max 5MB)</small>
        </div>
      </div>

      <!-- QR CODE SECTION -->
      <div class="settings-section" data-section="qrcode">
        <div class="section-title">QR Code</div>
        <div class="field-group">
          <label class="field-label">URL ou texte</label>
          <input type="text" class="control-input full-width" id="qrContent" placeholder="https://example.com">
        </div>
        <button class="btn-action secondary" id="generateQR">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Generer QR Code
        </button>
      </div>


    `;
  }

  animateIn() {
    const sections = this.container.querySelectorAll('.settings-section');
    gsap.from(sections, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }

  attachEvents() {
    // Dimension inputs
    const dimInputs = ['width', 'height', 'depth'];
    dimInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.handleChange());
    });

    // Business card field inputs
    const fieldInputs = ['fullName', 'jobTitle', 'phone', 'email', 'website', 'mainTextSize'];
    fieldInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.handleChange());
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.params.activePreset = e.currentTarget.dataset.preset;
        this.applyPreset(this.params.activePreset);
        gsap.from(e.currentTarget, { scale: 0.95, duration: 0.2 });
      });
    });

    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.params.mainTextMode = e.target.dataset.mode;
        gsap.from(e.target, { scale: 0.9, duration: 0.2 });
        this.onUpdate(this.params);
      });
    });

    // Frame toggle
    const frameToggle = document.getElementById('frameToggle');
    const frameSliderGroup = document.getElementById('frameSliderGroup');
    frameToggle?.addEventListener('click', () => {
      this.params.frameEnabled = !this.params.frameEnabled;
      frameToggle.classList.toggle('active', this.params.frameEnabled);
      gsap.to(frameSliderGroup, { opacity: this.params.frameEnabled ? 1 : 0.5, duration: 0.2 });
      this.onUpdate(this.params);
    });

    // Frame thickness slider
    const frameThickness = document.getElementById('frameThickness');
    const frameThicknessValue = document.getElementById('frameThicknessValue');
    frameThickness?.addEventListener('input', (e) => {
      this.params.frameThickness = parseFloat(e.target.value);
      frameThicknessValue.textContent = `${this.params.frameThickness}mm`;
      this.onUpdate(this.params);
    });

    // Text color grid
    document.querySelectorAll('#textColorGrid .color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#textColorGrid .color-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const color = parseInt(e.target.dataset.color);

        // If a specific text field is selected, update its color
        if (this.selectedTextId) {
          this.updateParam(`${this.selectedTextId}Color`, color);
        } else {
          // Default to main text if nothing selected (or update all?)
          this.updateParam('mainTextColor', color);
        }

        gsap.from(e.target, { scale: 1.2, duration: 0.2 });
        this.onUpdate(this.params);
      });
    });

    // Card color grid
    document.querySelectorAll('#cardColorGrid .color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#cardColorGrid .color-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.params.cardColor = parseInt(e.target.dataset.color);
        gsap.from(e.target, { scale: 1.2, duration: 0.2 });
        this.onUpdate(this.params);
      });
    });

    // Export buttons
    // Export buttons (Header)
    document.getElementById('quickExportBtn')?.addEventListener('click', () => this.onExport('stl'));
    document.getElementById('headerExportOBJ')?.addEventListener('click', () => this.onExport('obj'));

    // Toolbar controls
    this.attachToolbarEvents();
    this.attachSidebarEvents();
  }

  applyPreset(preset) {
    switch (preset) {
      case 'business':
        this.params.width = 85;
        this.params.height = 55;
        this.params.depth = 2;
        this.params.mainTextSize = 6;
        this.params.mainTextPositionY = 10;
        break;
      case 'minimal':
        this.params.width = 85;
        this.params.height = 55;
        this.params.depth = 1.5;
        this.params.mainTextSize = 5; // Smaller text
        this.params.mainTextPositionY = 5;
        break;
      case 'credit-card':
        this.params.width = 85.6;
        this.params.height = 54;
        this.params.depth = 0.8;
        this.params.mainTextSize = 5.5;
        this.params.mainTextPositionY = 8;
        break;
    }
    document.getElementById('width').value = this.params.width;
    document.getElementById('height').value = this.params.height;
    document.getElementById('depth').value = this.params.depth;
    this.onUpdate(this.params);
  }

  attachToolbarEvents() {
    const zoomValue = document.getElementById('zoomValue');
    let currentZoom = 100;

    document.getElementById('zoomInBtn')?.addEventListener('click', () => {
      if (this.sceneRef && currentZoom < 200) {
        currentZoom += 25;
        zoomValue.textContent = `${currentZoom}%`;
        this.sceneRef.setZoom(currentZoom / 100);
      }
    });

    document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
      if (this.sceneRef && currentZoom > 50) {
        currentZoom -= 25;
        zoomValue.textContent = `${currentZoom}%`;
        this.sceneRef.setZoom(currentZoom / 100);
      }
    });

    document.getElementById('resetCameraBtn')?.addEventListener('click', () => {
      if (this.sceneRef) {
        currentZoom = 100;
        zoomValue.textContent = '100%';
        this.sceneRef.resetCamera();
      }
    });

    document.getElementById('resetViewBtn')?.addEventListener('click', () => {
      if (this.sceneRef) {
        currentZoom = 100;
        if (zoomValue) zoomValue.textContent = '100%';
        this.sceneRef.resetCamera();
      }
    });

    const gridBtn = document.getElementById('toggleGridBtn');
    gridBtn?.addEventListener('click', () => {
      gridBtn.classList.toggle('active');
      if (this.sceneRef) this.sceneRef.toggleGrid();
    });
  }

  attachSidebarEvents() {
    document.querySelectorAll('.icon-btn[data-panel]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.icon-btn[data-panel]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activePanel = e.currentTarget.dataset.panel;
        this.showPanelSection(this.activePanel);

        // Move camera to focus area
        if (this.sceneRef && this.sceneRef.moveCameraTo) {
          this.sceneRef.moveCameraTo(this.activePanel);
        }
      });
    });
  }

  showPanelSection(panel, animate = true) {
    const sections = this.container.querySelectorAll('.settings-section');

    if (animate) {
      sections.forEach(section => {
        gsap.to(section, { opacity: 0, y: -10, duration: 0.15 });
      });
    }

    const applyVisibility = () => {
      sections.forEach(section => {
        const sectionType = section.dataset.section;
        let show = false;

        if (panel === 'templates') show = ['templates', 'dimensions'].includes(sectionType);
        else if (panel === 'text') show = ['text-fields', 'text-style', 'mode'].includes(sectionType);
        else if (panel === 'background') show = ['background', 'frame'].includes(sectionType);
        else if (panel === 'logo') show = ['logo'].includes(sectionType);
        else if (panel === 'shape') show = ['shape'].includes(sectionType);
        else if (panel === 'images') show = ['images'].includes(sectionType);
        else if (panel === 'qrcode') show = ['qrcode'].includes(sectionType);

        section.style.display = show ? 'block' : 'none';
        if (show && animate) {
          gsap.fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    };

    if (animate) {
      setTimeout(applyVisibility, 150);
    } else {
      applyVisibility();
    }
  }

  setActivePanel(panel) {
    this.activePanel = panel;
    // Update sidebar buttons
    document.querySelectorAll('.icon-btn[data-panel]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === panel);
    });
    this.showPanelSection(panel);
  }

  handleChange() {
    this.params = {
      ...this.params,
      width: parseFloat(document.getElementById('width')?.value || this.params.width),
      height: parseFloat(document.getElementById('height')?.value || this.params.height),
      depth: parseFloat(document.getElementById('depth')?.value || this.params.depth),
      fullName: document.getElementById('fullName')?.value || this.params.fullName,
      jobTitle: document.getElementById('jobTitle')?.value || this.params.jobTitle,
      phone: document.getElementById('phone')?.value || this.params.phone,
      email: document.getElementById('email')?.value || this.params.email,
      website: document.getElementById('website')?.value || this.params.website,
      mainTextSize: parseFloat(document.getElementById('mainTextSize')?.value || this.params.mainTextSize)
    };
    this.onUpdate(this.params);
  }

  getParams() {
    return this.params;
  }

  updateParam(key, value) {
    this.params[key] = value;
    // Update UI input if exists
    const input = document.getElementById(key);
    if (input) input.value = value;
  }
}
