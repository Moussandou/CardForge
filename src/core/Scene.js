import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

/**
 * Gestionnaire de scene Three.js
 */
export class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f7fc);

        this.gridVisible = true;
        this.gridHelper = null;

        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();
        this.setupGrid();
        this.setupResize();

        this.animate();
    }

    setupCamera() {
        const container = this.canvas.parentElement;
        const aspect = container.clientWidth / container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.defaultCameraPosition = new THREE.Vector3(0, 50, 150);
        this.camera.position.copy(this.defaultCameraPosition);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        const container = this.canvas.parentElement;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 400;
        this.defaultTarget = new THREE.Vector3(0, 0, 0);
        this.controls.target.copy(this.defaultTarget);
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.position.set(50, 100, 50);
        this.scene.add(directional);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(-50, -50, -50);
        this.scene.add(backLight);
    }

    setupGrid() {
        this.gridHelper = new THREE.GridHelper(200, 20, 0xd4c4e8, 0xe8e0f7);
        this.gridHelper.rotation.x = Math.PI / 2;
        this.gridHelper.position.z = -5;
        this.gridHelper.visible = true;
        this.scene.add(this.gridHelper);
    }

    setupResize() {
        window.addEventListener('resize', () => {
            const container = this.canvas.parentElement;
            const width = container.clientWidth;
            const height = container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }

    setZoom(factor) {
        const targetDistance = this.defaultCameraPosition.length() / factor;
        const direction = this.camera.position.clone().sub(this.controls.target).normalize();
        const newPosition = this.controls.target.clone().add(direction.multiplyScalar(targetDistance));

        gsap.to(this.camera.position, {
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    resetCamera() {
        gsap.to(this.camera.position, {
            x: this.defaultCameraPosition.x,
            y: this.defaultCameraPosition.y,
            z: this.defaultCameraPosition.z,
            duration: 0.5,
            ease: 'power2.out'
        });

        gsap.to(this.controls.target, {
            x: 0, y: 0, z: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    toggleGrid() {
        this.gridVisible = !this.gridVisible;

        if (this.gridVisible) {
            this.gridHelper.visible = true;
            gsap.fromTo(this.gridHelper.material, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        } else {
            gsap.to(this.gridHelper.material, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => { this.gridHelper.visible = false; }
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
