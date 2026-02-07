import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Gestionnaire de texte 3D
 */
export class TextManager {
    constructor() {
        this.font = null;
        this.mainTextMesh = null;
        this.secondaryTextMesh = null;
        this.loadFont();
    }

    async loadFont() {
        const loader = new FontLoader();
        return new Promise((resolve) => {
            loader.load(
                'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
                (font) => {
                    this.font = font;
                    resolve(font);
                }
            );
        });
    }

    async updateMainText(text, options, parentGroup) {
        if (!this.font) await this.loadFont();

        if (this.mainTextMesh) {
            parentGroup.remove(this.mainTextMesh);
            this.mainTextMesh.geometry.dispose();
            this.mainTextMesh.material.dispose();
        }

        if (!text) return;

        const geometry = new TextGeometry(text, {
            font: this.font,
            size: options.size,
            height: options.height,
            curveSegments: 12,
            bevelEnabled: false
        });

        geometry.computeBoundingBox();
        geometry.center();

        const material = new THREE.MeshStandardMaterial({
            color: options.color || 0x2d2640,
            roughness: 0.3,
            metalness: 0.1
        });

        this.mainTextMesh = new THREE.Mesh(geometry, material);
        this.mainTextMesh.position.set(0, options.positionY, options.mode === 'emboss' ? options.height : -options.height * 0.5);
        this.mainTextMesh.name = 'mainText';

        parentGroup.add(this.mainTextMesh);
    }

    async updateSecondaryText(text, options, parentGroup) {
        if (!this.font) await this.loadFont();

        if (this.secondaryTextMesh) {
            parentGroup.remove(this.secondaryTextMesh);
            this.secondaryTextMesh.geometry.dispose();
            this.secondaryTextMesh.material.dispose();
        }

        if (!text) return;

        const geometry = new TextGeometry(text, {
            font: this.font,
            size: options.size,
            height: options.height,
            curveSegments: 12,
            bevelEnabled: false
        });

        geometry.computeBoundingBox();
        geometry.center();

        const material = new THREE.MeshStandardMaterial({
            color: options.color || 0x6b5f7a,
            roughness: 0.3,
            metalness: 0.1
        });

        this.secondaryTextMesh = new THREE.Mesh(geometry, material);
        this.secondaryTextMesh.position.set(0, options.positionY, options.mode === 'emboss' ? options.height : -options.height * 0.5);
        this.secondaryTextMesh.name = 'secondaryText';

        parentGroup.add(this.secondaryTextMesh);
    }

    updateColor(color, isMain = true) {
        const mesh = isMain ? this.mainTextMesh : this.secondaryTextMesh;
        if (mesh) {
            mesh.material.color.setHex(color);
        }
    }
}
