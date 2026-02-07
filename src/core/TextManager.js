import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Gestionnaire de texte 3D
 * Gère le chargement de police et la création de texte extrudé
 */
export class TextManager {
    constructor() {
        this.font = null;
        this.fontLoaded = false;
        this.loadPromise = this.loadFont();

        this.textMeshes = {
            main: null,
            secondary: null
        };
    }

    async loadFont() {
        const loader = new FontLoader();
        const fontUrl = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

        return new Promise((resolve, reject) => {
            loader.load(
                fontUrl,
                (font) => {
                    this.font = font;
                    this.fontLoaded = true;
                    resolve(font);
                },
                undefined,
                (error) => {
                    console.error('Erreur chargement police:', error);
                    reject(error);
                }
            );
        });
    }

    async createText(text, params, cardGroup) {
        if (!this.fontLoaded) {
            await this.loadPromise;
        }

        const {
            size = 8,
            height = 1,
            positionY = 0,
            mode = 'emboss',
            type = 'main'
        } = params;

        // Supprimer l'ancien mesh
        if (this.textMeshes[type]) {
            cardGroup.remove(this.textMeshes[type]);
            this.textMeshes[type].geometry.dispose();
            this.textMeshes[type].material.dispose();
        }

        if (!text || text.trim() === '') return null;

        const geometry = new TextGeometry(text, {
            font: this.font,
            size: size,
            height: height,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 3
        });

        geometry.computeBoundingBox();
        const centerX = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2;
        geometry.translate(-centerX, 0, 0);

        const material = new THREE.MeshStandardMaterial({
            color: mode === 'emboss' ? 0x333333 : 0xaaaaaa,
            roughness: 0.3,
            metalness: 0.1
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = `text_${type}`;

        // Positionnement selon le mode
        const cardDepth = 1; // Demi-épaisseur de la carte
        if (mode === 'emboss') {
            mesh.position.set(0, positionY, cardDepth);
        } else {
            mesh.position.set(0, positionY, cardDepth - height + 0.2);
        }

        this.textMeshes[type] = mesh;
        cardGroup.add(mesh);

        return mesh;
    }

    async updateMainText(text, params, cardGroup) {
        return this.createText(text, { ...params, type: 'main' }, cardGroup);
    }

    async updateSecondaryText(text, params, cardGroup) {
        return this.createText(text, { ...params, type: 'secondary' }, cardGroup);
    }

    clearAll(cardGroup) {
        Object.keys(this.textMeshes).forEach(key => {
            if (this.textMeshes[key]) {
                cardGroup.remove(this.textMeshes[key]);
                this.textMeshes[key].geometry.dispose();
                this.textMeshes[key].material.dispose();
                this.textMeshes[key] = null;
            }
        });
    }
}
