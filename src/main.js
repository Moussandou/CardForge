import { Scene } from './core/Scene.js';
import { Card } from './core/Card.js';
import { TextManager } from './core/TextManager.js';
import { ControlPanel } from './ui/ControlPanel.js';
import { Exporter } from './export/Exporter.js';
import { InteractionManager } from './core/InteractionManager.js';

/**
 * Application CardForge
 */
class CardForgeApp {
    constructor() {
        this.init();
    }

    async init() {
        const canvas = document.getElementById('canvas');
        const settingsContainer = document.getElementById('settings-panel');

        this.scene = new Scene(canvas);
        this.card = new Card();
        this.textManager = new TextManager();
        this.exporter = new Exporter();

        this.scene.add(this.card.getGroup());

        // Initialize Interaction Manager
        this.interactionManager = new InteractionManager(
            this.scene.camera,
            this.scene.renderer,
            this.scene.scene,
            this.scene.controls
        );

        this.controlPanel = new ControlPanel(
            settingsContainer,
            (params) => this.handleUpdate(params),
            (format) => this.handleExport(format),
            this.scene
        );

        // Callback for selection
        this.interactionManager.onSelect((object) => {
            console.log('Selected:', object.name);
            // Future: update UI with selected object properties
        });

        const initialParams = this.controlPanel.getParams();
        await this.handleUpdate(initialParams);
    }

    async handleUpdate(params) {
        this.card.updateParams({
            width: params.width,
            height: params.height,
            depth: params.depth,
            frameEnabled: params.frameEnabled,
            frameThickness: params.frameThickness,
            color: params.cardColor
        });

        const commonOptions = {
            mode: params.mainTextMode || 'emboss',
            height: params.depth * 0.5,
        };

        // 1. Full Name (Main)
        await this.textManager.updateText('fullName', params.fullName || 'John Doe', {
            ...commonOptions,
            size: params.mainTextSize || 6,
            position: { x: 0, y: params.mainTextPositionY || 10 },
            color: params.mainTextColor || 0x2d2640
        }, this.card.getGroup());

        // 2. Job Title (Secondary)
        await this.textManager.updateText('jobTitle', params.jobTitle || 'CEO & Founder', {
            ...commonOptions,
            size: params.secondaryTextSize || 4,
            position: { x: 0, y: params.secondaryTextPositionY || -5 },
            color: params.secondaryTextColor || 0x6b5f7a
        }, this.card.getGroup());

        // 3. Contact Info (Details) - Phone
        await this.textManager.updateText('phone', params.phone || '', {
            ...commonOptions,
            size: 3,
            position: { x: -20, y: -15 }, // Example position
            color: params.secondaryTextColor || 0x6b5f7a
        }, this.card.getGroup());

        // 4. Email
        await this.textManager.updateText('email', params.email || '', {
            ...commonOptions,
            size: 3,
            position: { x: -20, y: -22 },
            color: params.secondaryTextColor || 0x6b5f7a
        }, this.card.getGroup());

        // 5. Website
        await this.textManager.updateText('website', params.website || '', {
            ...commonOptions,
            size: 3,
            position: { x: -20, y: -29 },
            color: params.secondaryTextColor || 0x6b5f7a
        }, this.card.getGroup());

        // Update draggable objects list handling
        this.interactionManager.setDraggableObjects(this.textManager.getAllMeshes());
    }

    handleExport(format) {
        const group = this.card.getGroup();

        if (format === 'stl') {
            this.exporter.exportSTL(group);
        } else if (format === 'obj') {
            this.exporter.exportOBJ(group);
        }
    }
}

new CardForgeApp();
