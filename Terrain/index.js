/**
 * 
 */

define(function(require, exports, module) {
    const THREE = require("three.js/build/three");
    const tl = new THREE.TextureLoader();

    class Terrain extends THREE.Mesh {
        constructor() {
            super();
        }

        loadTopography(topoPath) {
            fetch(topoPath)
                .then(response => response.blob())
                .then(blob => blob.arrayBuffer())
                .then(this.onBufferLoaded.bind(this));
        }

        /**
         * Buffer data is signed short integer values, immediately processed
         * into an Int16Array. The first two values are the height (J) and
         * width (I), respectively. The remaining values are j/i samples of
         * altitude, in meters. So, [2] is the first point (i=0, j=0), [3] is
         * the second point (i=1, j=0), etc.
         * 
         * @param {ArrayBuffer} buffer 
         */
        onBufferLoaded(buffer, normalize=true) {
            let topoData = new Int16Array(buffer);
            let J = topoData[0];
            let I = topoData[1];
            let N = J * I;
            if (this.geometry) {
                this.geometry.dispose();
            }
            this.geometry = new THREE.PlaneGeometry(I, J, I, J);
            let pa = this.geometry.attributes.position.array;
            let min = null;
            let max = null;
            for (let j = 0; j < J; j += 1) {
                for (let i = 0; i < I; i += 1) {
                    let offset = i + j * I;
                    let z = topoData[2 + offset];
                    pa[3 * offset + 2] = z;
                    min = min === null ? z : Math.min(min, z);
                    max = max === null ? z : Math.max(max, z);
                }
            }
            if (normalize) {
                for (let n = 2; n < 3 * N; n += 3) {
                    pa[n] = (pa[n] - min) / (max - min);
                }
            }
        }

        loadTexture(textPath) {
            if (this.material) {
                this.material.dispose();
            }
            this.material = new THREE.MeshStandardMaterial({
                "color": 0xffffff,
                "side": THREE.DoubleSide,
                "map": tl.load(textPath)
            });
        }

        loadPolygon(kmlPath) {
            fetch(kmlPath)
                .then(response => response.text())
                .then(this.onMarkupLoaded.bind(this));
        }

        onMarkupLoaded(rawKml) {
            // pass through DOM parser as xml
            let dp = new DOMParser();
            let xml = dp.parseFromString(rawKml, "text/xml");

            // determine polygon vertices
            let polygon = xml.querySelector("Polygon");
            let coordinates = polygon.querySelector("coordinates");
            let parts = coordinates.textContent.trim().split(/\s+/g);
            let lons = parts.map(p => parseFloat(p.split(/,/g)[0]));
            let lats = parts.map(p => parseFloat(p.split(/,/g)[1]));

            // scale by dimensions
            let lonMin = Math.min(...lons);
            let lonMax = Math.max(...lons);
            let latMin = Math.min(...lats);
            let latMax = Math.max(...lats);
            this.scale.x = 0.1 / (lonMax - lonMin)
            this.scale.y = 0.1 / (latMax - latMin);
        }
    }

    return Object.assign(Terrain, {
        "__url__": "",
        "__semver__": "",
        "__license__": "",
        "__deps__": {},
        "__tests__": []
    });
});
