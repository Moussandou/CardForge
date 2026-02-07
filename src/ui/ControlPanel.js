/**
 * Panneau de contrôle pour les paramètres de la carte (colonne gauche)
 */
export class ControlPanel {
  constructor(container, settingsContainer, onUpdate, onExport) {
    this.container = container;
    this.settingsContainer = settingsContainer;
    this.onUpdate = onUpdate;
    this.onExport = onExport;

    this.params = {
      width: 63,
      height: 88,
      depth: 2,
      mainText: 'CardForge',
      mainTextSize: 8,
      mainTextPositionY: 10,
      mainTextMode: 'emboss',
      secondaryText: '',
      secondaryTextSize: 5,
      secondaryTextPositionY: -15,
      frameEnabled: false,
      frameThickness: 2
    };

    this.render();
    this.renderSettings();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <h1>CardForge</h1>
        <p>Créateur de cartes 3D pour impression</p>
      </div>

      <div class="panel-section">
        <h2>Catégories</h2>
        <div class="tag-list">
          <button class="tag active">Standard</button>
          <button class="tag">Business</button>
          <button class="tag">Gaming</button>
          <button class="tag">Custom</button>
        </div>
      </div>

      <div class="panel-section">
        <h2>Dimensions (mm)</h2>
        <div class="dimension-grid">
          <div class="control-group">
            <label for="width">Largeur</label>
            <input type="number" id="width" value="${this.params.width}" min="20" max="200" step="1">
          </div>
          <div class="control-group">
            <label for="height">Hauteur</label>
            <input type="number" id="height" value="${this.params.height}" min="20" max="200" step="1">
          </div>
          <div class="control-group">
            <label for="depth">Épaisseur</label>
            <input type="number" id="depth" value="${this.params.depth}" min="0.5" max="10" step="0.5">
          </div>
        </div>
      </div>

      <div class="panel-section">
        <h2>Texte Principal</h2>
        <div class="control-group">
          <label for="mainText">Nom</label>
          <input type="text" id="mainText" value="${this.params.mainText}" maxlength="20" placeholder="Entrez votre texte">
        </div>
        <div class="control-group">
          <label for="mainTextSize">Taille</label>
          <input type="number" id="mainTextSize" value="${this.params.mainTextSize}" min="3" max="20" step="1">
        </div>
        <div class="control-group">
          <label for="mainTextPositionY">Position Y</label>
          <input type="number" id="mainTextPositionY" value="${this.params.mainTextPositionY}" min="-50" max="50" step="1">
        </div>
      </div>

      <div class="panel-section">
        <h2>Texte Secondaire</h2>
        <div class="control-group">
          <label for="secondaryText">Sous-titre</label>
          <input type="text" id="secondaryText" value="${this.params.secondaryText}" maxlength="30" placeholder="Optionnel">
        </div>
        <div class="control-group">
          <label for="secondaryTextSize">Taille</label>
          <input type="number" id="secondaryTextSize" value="${this.params.secondaryTextSize}" min="2" max="15" step="1">
        </div>
        <div class="control-group">
          <label for="secondaryTextPositionY">Position Y</label>
          <input type="number" id="secondaryTextPositionY" value="${this.params.secondaryTextPositionY}" min="-50" max="50" step="1">
        </div>
      </div>
    `;
  }

  renderSettings() {
    this.settingsContainer.innerHTML = `
      <div class="settings-section">
        <h3>Mode du texte <span class="chevron">▼</span></h3>
        <div class="mode-tabs">
          <button class="mode-tab ${this.params.mainTextMode === 'emboss' ? 'active' : ''}" data-mode="emboss">Relief</button>
          <button class="mode-tab ${this.params.mainTextMode === 'engrave' ? 'active' : ''}" data-mode="engrave">Gravé</button>
        </div>
      </div>

      <div class="settings-section">
        <h3>Cadre <span class="chevron">▼</span></h3>
        <div class="toggle-group">
          <label class="toggle ${this.params.frameEnabled ? 'active' : ''}" id="frameToggle">
            <input type="checkbox" id="frameEnabled" ${this.params.frameEnabled ? 'checked' : ''}>
          </label>
          <span class="toggle-label">Activer le cadre</span>
        </div>
        <div class="control-group" style="margin-top: 12px;">
          <label for="frameThickness">Épaisseur</label>
          <input type="number" id="frameThickness" value="${this.params.frameThickness}" min="1" max="10" step="0.5">
        </div>
      </div>

      <div class="settings-section">
        <h3>Matériau</h3>
        <div class="color-palette">
          <div class="color-swatch active" style="background: #ffffff" data-color="0xffffff"></div>
          <div class="color-swatch" style="background: #1a1a2e" data-color="0x1a1a2e"></div>
          <div class="color-swatch" style="background: #8b1538" data-color="0x8b1538"></div>
          <div class="color-swatch" style="background: #0f4c75" data-color="0x0f4c75"></div>
          <div class="color-swatch" style="background: #3d5a80" data-color="0x3d5a80"></div>
          <div class="color-swatch" style="background: #2d6a4f" data-color="0x2d6a4f"></div>
          <div class="color-swatch" style="background: #d4a373" data-color="0xd4a373"></div>
          <div class="color-swatch" style="background: #9b5de5" data-color="0x9b5de5"></div>
          <div class="color-swatch" style="background: #f72585" data-color="0xf72585"></div>
          <div class="color-swatch" style="background: #4361ee" data-color="0x4361ee"></div>
        </div>
      </div>

      <div class="export-section">
        <div class="export-buttons">
          <button class="btn-export primary" id="exportSTL">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Export STL
          </button>
          <button class="btn-export secondary" id="exportOBJ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Export OBJ
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const inputIds = [
      'width', 'height', 'depth',
      'mainText', 'mainTextSize', 'mainTextPositionY',
      'secondaryText', 'secondaryTextSize', 'secondaryTextPositionY',
      'frameThickness'
    ];

    inputIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.handleChange());
      }
    });

    // Mode tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.params.mainTextMode = e.target.dataset.mode;
        this.onUpdate(this.params);
      });
    });

    // Frame toggle
    const frameToggle = document.getElementById('frameToggle');
    const frameCheckbox = document.getElementById('frameEnabled');
    if (frameToggle && frameCheckbox) {
      frameToggle.addEventListener('click', () => {
        frameCheckbox.checked = !frameCheckbox.checked;
        frameToggle.classList.toggle('active', frameCheckbox.checked);
        this.handleChange();
      });
    }

    // Export buttons
    document.getElementById('exportSTL')?.addEventListener('click', () => this.onExport('stl'));
    document.getElementById('exportOBJ')?.addEventListener('click', () => this.onExport('obj'));
    document.getElementById('btn-export-stl')?.addEventListener('click', () => this.onExport('stl'));

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Tags
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  handleChange() {
    this.params = {
      width: parseFloat(document.getElementById('width').value),
      height: parseFloat(document.getElementById('height').value),
      depth: parseFloat(document.getElementById('depth').value),
      mainText: document.getElementById('mainText').value,
      mainTextSize: parseFloat(document.getElementById('mainTextSize').value),
      mainTextPositionY: parseFloat(document.getElementById('mainTextPositionY').value),
      mainTextMode: this.params.mainTextMode,
      secondaryText: document.getElementById('secondaryText').value,
      secondaryTextSize: parseFloat(document.getElementById('secondaryTextSize').value),
      secondaryTextPositionY: parseFloat(document.getElementById('secondaryTextPositionY').value),
      frameEnabled: document.getElementById('frameEnabled').checked,
      frameThickness: parseFloat(document.getElementById('frameThickness').value)
    };

    this.onUpdate(this.params);
  }

  getParams() {
    return this.params;
  }
}
