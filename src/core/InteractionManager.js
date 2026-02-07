import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';

/**
 * Gère les interactions (sélection, drag & drop)
 */
export class InteractionManager {
    constructor(camera, renderer, scene, controls) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.orbitControls = controls;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.draggableObjects = [];
        this.selectedObject = null;
        this.isDragging = false;
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Plane parallel to card face
        this.offset = new THREE.Vector3();
        this.intersection = new THREE.Vector3();

        this.onSelectCallback = null;
        this.onDragCallback = null;

        this.initInteraction();
    }

    setDraggableObjects(objects) {
        this.draggableObjects = objects;
    }

    addDraggableObject(object) {
        this.draggableObjects.push(object);
    }

    initInteraction() {
        const domEl = this.renderer.domElement;

        domEl.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        domEl.addEventListener('pointermove', (e) => this.onPointerMove(e));
        domEl.addEventListener('pointerup', (e) => this.onPointerUp(e));
    }

    onPointerDown(event) {
        event.preventDefault();

        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Recursive = true to hit children (hitboxes)
        const intersects = this.raycaster.intersectObjects(this.draggableObjects, true);

        if (intersects.length > 0) {
            this.orbitControls.enabled = false;
            // Get the root parent (the text mesh), not the hitbox
            let target = intersects[0].object;
            if (target.userData.isHitBox) {
                target = target.parent;
            }

            this.selectedObject = target;
            this.isDragging = true;

            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                this.offset.copy(this.intersection).sub(this.selectedObject.position);
            }

            this.selectObject(this.selectedObject);
            domEl.style.cursor = 'move';
        }
    }

    onPointerMove(event) {
        event.preventDefault();

        if (this.isDragging && this.selectedObject) {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                // Constrain X and Y, keep Z same as object (or slightly above?)
                // Actually we want to move on the plane Z = object.z
                // Let's update the plane constant to match object Z
                this.plane.constant = -this.selectedObject.position.z;

                // Re-calculate intersection with updated plane
                if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                    this.selectedObject.position.copy(this.intersection.sub(this.offset));
                }

                if (this.onDragCallback) this.onDragCallback(this.selectedObject);
            }
            return;
        }

        // Hover effect
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.draggableObjects, true);
        this.renderer.domElement.style.cursor = intersects.length > 0 ? 'move' : 'auto';
    }

    onPointerUp(event) {
        this.isDragging = false;
        this.orbitControls.enabled = true;
        this.renderer.domElement.style.cursor = 'auto';
    }

    selectObject(object) {
        this.selectedObject = object;
        if (this.onSelectCallback) this.onSelectCallback(object);
    }

    onSelect(callback) {
        this.onSelectCallback = callback;
    }

    onDrag(callback) {
        this.onDragCallback = callback;
    }
}
