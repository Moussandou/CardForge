import { gsap } from 'gsap';

/**
 * Panneau de paramètres avec sections animées via GSAP
 */
export class ControlPanel {
  constructor(container, onUpdate, onExport, sceneRef) {
    this.container = container;
    this.onUpdate = onUpdate;
    this.onExport = onExport;
    this.sceneRef = sceneRef;
    this.activePanel = 'card';

    this.params = {
      width: 63,
      height: 88,
      depth: 2,
      mainText: 'CardForge',
      mainTextSize: 8,
      mainTextPositionY: 10,
      mainTextMode: 'emboss',
      mainTextColor: 0x2d2640,
      secondaryText: '',
      secondaryTextSize: 5,
      secondaryTextPositionY: -15,
      secondaryTextColor: 0x6b5f7a,
      frameEnabled: false,
      frameThickness: 2,
      cardColor: 0xffffff
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

      <div class="settings-section" data-section="dimensions">
        <div class="section-title">Dimensions</div>
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

      <div class="settings-section" data-section="text">
        <div class="section-title">Texte principal</div>
        <div class="control-row">
          <span class="control-label">Contenu</span>
          <input type="text" class="control-input" id="mainText" value="${this.params.mainText}" style="width:120px;text-align:left">
        </div>
        <div class="control-row">
          <span class="control-label">Taille</span>
          <input type="number" class="control-input" id="mainTextSize" value="${this.params.mainTextSize}" min="3" max="20">
        </div>
        <div class="control-row">
          <span class="control-label">Position Y</span>
          <input type="number" class="control-input" id="mainTextPositionY" value="${this.params.mainTextPositionY}" min="-50" max="50">
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

      <div class="settings-section" data-section="card-color">
        <div class="section-title">Couleur carte</div>
        <div class="color-grid" id="cardColorGrid">
          <div class="color-btn active" style="background:#ffffff" data-color="0xffffff"></div>
          <div class="color-btn" style="background:#f5f0ff" data-color="0xf5f0ff"></div>
          <div class="color-btn" style="background:#e8e0f7" data-color="0xe8e0f7"></div>
          <div class="color-btn" style="background:#d4c4e8" data-color="0xd4c4e8"></div>
          <div class="color-btn" style="background:#b8a0d9" data-color="0xb8a0d9"></div>
          <div class="color-btn" style="background:#2d2640" data-color="0x2d2640"></div>
          <div class="color-btn" style="background:#4a4458" data-color="0x4a4458"></div>
          <div class="color-btn" style="background:#a8d5ba" data-color="0xa8d5ba"></div>
          <div class="color-btn" style="background:#f4d9a0" data-color="0xf4d9a0"></div>
          <div class="color-btn" style="background:#f0b8c4" data-color="0xf0b8c4"></div>
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

      <div class="export-group">
        <button class="btn-action primary" id="exportSTL">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Telecharger STL
        </button>
        <button class="btn-action secondary" id="exportOBJ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Telecharger OBJ
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
    const inputs = ['width', 'height', 'depth', 'mainText', 'mainTextSize', 'mainTextPositionY'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.handleChange());
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
        this.params.mainTextColor = parseInt(e.target.dataset.color);
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
    document.getElementById('exportSTL')?.addEventListener('click', () => this.onExport('stl'));
    document.getElementById('exportOBJ')?.addEventListener('click', () => this.onExport('obj'));
    document.getElementById('quickExportBtn')?.addEventListener('click', () => this.onExport('stl'));

    // Toolbar controls
    this.attachToolbarEvents();
    this.attachSidebarEvents();
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

        if (panel === 'card') show = ['dimensions', 'frame'].includes(sectionType);
        else if (panel === 'text') show = ['text', 'mode'].includes(sectionType);
        else if (panel === 'style') show = ['card-color', 'frame'].includes(sectionType);

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

  handleChange() {
    this.params = {
      ...this.params,
      width: parseFloat(document.getElementById('width').value),
      height: parseFloat(document.getElementById('height').value),
      depth: parseFloat(document.getElementById('depth').value),
      mainText: document.getElementById('mainText').value,
      mainTextSize: parseFloat(document.getElementById('mainTextSize').value),
      mainTextPositionY: parseFloat(document.getElementById('mainTextPositionY').value)
    };
    this.onUpdate(this.params);
  }

  getParams() {
    return this.params;
  }
}
