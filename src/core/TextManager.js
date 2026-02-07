import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Gestionnaire de texte 3D
 */
export class TextManager {
    constructor() {
        this.font = null;
        this.texts = new Map(); // Stores text meshes by ID
        this.loadFont();
    }

    async loadFont() {
        if (this.font) return this.font;
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

    async updateText(id, content, options, parentGroup) {
        if (!this.font) await this.loadFont();
        if (!content) {
            this.removeText(id, parentGroup);
            return;
        }

        // Cleanup existing mesh for this ID
        if (this.texts.has(id)) {
            this.removeText(id, parentGroup);
        }

        const geometry = new TextGeometry(content, {
            font: this.font,
            size: options.size || 5,
            height: options.height || 1,
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

        const mesh = new THREE.Mesh(geometry, material);

        // Position logic
        const zPos = options.mode === 'emboss' ? options.height : -options.height * 0.5;
        mesh.position.set(options.position?.x || 0, options.position?.y || 0, zPos);

        mesh.name = id;
        mesh.userData = { isEditableText: true, id: id }; // Marker for raycasting/interaction

        // Create Hit Box for easier selection
        const box = geometry.boundingBox;
        const width = box.max.x - box.min.x;
        const height = box.max.y - box.min.y;
        const depth = options.height || 1;

        const hitGeometry = new THREE.BoxGeometry(width + 2, height + 2, depth); // Slightly larger
        const hitMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Invisible
        const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

        // Center hitbox
        hitMesh.position.z = depth / 2;
        hitMesh.userData = { isHitBox: true, parentId: id };

        mesh.add(hitMesh);

        this.texts.set(id, mesh);
        parentGroup.add(mesh);
    }

    removeText(id, parentGroup) {
        const mesh = this.texts.get(id);
        if (mesh) {
            parentGroup.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.texts.delete(id);
        }
    }

    updateColor(id, color) {
        const mesh = this.texts.get(id);
        if (mesh) {
            mesh.material.color.setHex(color);
        }
    }

    getAllMeshes() {
        return Array.from(this.texts.values());
    }
}
