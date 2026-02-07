import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';

/**
 * Gestionnaire d'export STL/OBJ
 */
export class Exporter {
    constructor() {
        this.stlExporter = new STLExporter();
        this.objExporter = new OBJExporter();
    }

    /**
     * Fusionne toutes les géométries d'un groupe en une seule
     */
    mergeGeometries(group) {
        const geometries = [];

        group.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const clonedGeometry = child.geometry.clone();
                clonedGeometry.applyMatrix4(child.matrixWorld);
                geometries.push(clonedGeometry);
            }
        });

        if (geometries.length === 0) return null;

        return BufferGeometryUtils.mergeGeometries(geometries);
    }

    /**
     * Export en STL
     */
    exportSTL(group, filename = 'cardforge_card') {
        group.updateMatrixWorld(true);

        const mergedGeometry = this.mergeGeometries(group);
        if (!mergedGeometry) {
            console.error('Aucune géométrie à exporter');
            return;
        }

        const tempMesh = new THREE.Mesh(mergedGeometry);
        const result = this.stlExporter.parse(tempMesh, { binary: true });

        this.downloadFile(result, `${filename}.stl`, 'application/octet-stream');

        mergedGeometry.dispose();
    }

    /**
     * Export en OBJ
     */
    exportOBJ(group, filename = 'cardforge_card') {
        group.updateMatrixWorld(true);

        const result = this.objExporter.parse(group);
        this.downloadFile(result, `${filename}.obj`, 'text/plain');
    }

    /**
     * Télécharge un fichier
     */
    downloadFile(content, filename, mimeType) {
        const blob = content instanceof ArrayBuffer
            ? new Blob([content], { type: mimeType })
            : new Blob([content], { type: mimeType });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }
}
