import { Scene } from './core/Scene.js';
import { Card } from './core/Card.js';
import { TextManager } from './core/TextManager.js';
import { ControlPanel } from './ui/ControlPanel.js';
import { Exporter } from './export/Exporter.js';

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

        this.controlPanel = new ControlPanel(
            settingsContainer,
            (params) => this.handleUpdate(params),
            (format) => this.handleExport(format),
            this.scene
        );

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

        await this.textManager.updateMainText(
            params.mainText,
            {
                size: params.mainTextSize,
                height: params.depth * 0.5,
                positionY: params.mainTextPositionY,
                mode: params.mainTextMode,
                color: params.mainTextColor
            },
            this.card.getGroup()
        );

        await this.textManager.updateSecondaryText(
            params.secondaryText,
            {
                size: params.secondaryTextSize,
                height: params.depth * 0.4,
                positionY: params.secondaryTextPositionY,
                mode: params.mainTextMode,
                color: params.secondaryTextColor
            },
            this.card.getGroup()
        );
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
