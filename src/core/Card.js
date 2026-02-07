import * as THREE from 'three';

/**
 * Classe représentant une carte 3D
 * Gère la géométrie de base et les paramètres dimensionnels
 */
export class Card {
    constructor() {
        this.group = new THREE.Group();

        this.params = {
            width: 63,
            height: 88,
            depth: 2,
            frameEnabled: false,
            frameThickness: 2
        };

        this.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.4,
            metalness: 0.1
        });

        this.buildGeometry();
    }

    buildGeometry() {
        this.clearGroup();

        const { width, height, depth, frameEnabled, frameThickness } = this.params;

        // Base de la carte
        const baseGeometry = new THREE.BoxGeometry(width, height, depth);
        const baseMesh = new THREE.Mesh(baseGeometry, this.material);
        baseMesh.name = 'cardBase';
        this.group.add(baseMesh);

        // Cadre optionnel
        if (frameEnabled) {
            this.addFrame(width, height, depth, frameThickness);
        }
    }

    addFrame(width, height, depth, thickness) {
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.3,
            metalness: 0.2
        });

        const frameDepth = depth + 0.5;

        // Cadre haut
        const topFrame = new THREE.BoxGeometry(width + thickness * 2, thickness, frameDepth);
        const topMesh = new THREE.Mesh(topFrame, frameMaterial);
        topMesh.position.set(0, height / 2 + thickness / 2, 0);
        topMesh.name = 'frameTop';
        this.group.add(topMesh);

        // Cadre bas
        const bottomMesh = topMesh.clone();
        bottomMesh.position.set(0, -height / 2 - thickness / 2, 0);
        bottomMesh.name = 'frameBottom';
        this.group.add(bottomMesh);

        // Cadre gauche
        const sideFrame = new THREE.BoxGeometry(thickness, height, frameDepth);
        const leftMesh = new THREE.Mesh(sideFrame, frameMaterial);
        leftMesh.position.set(-width / 2 - thickness / 2, 0, 0);
        leftMesh.name = 'frameLeft';
        this.group.add(leftMesh);

        // Cadre droit
        const rightMesh = leftMesh.clone();
        rightMesh.position.set(width / 2 + thickness / 2, 0, 0);
        rightMesh.name = 'frameRight';
        this.group.add(rightMesh);
    }

    clearGroup() {
        while (this.group.children.length > 0) {
            const child = this.group.children[0];
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
            this.group.remove(child);
        }
    }

    updateParams(newParams) {
        Object.assign(this.params, newParams);
        this.buildGeometry();
    }

    getGroup() {
        return this.group;
    }

    getMesh() {
        return this.group;
    }
}
