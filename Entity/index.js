/**
 * 
 */

define(function(require, exports, module) {
    const THREE = require("three.js/build/three");

    class Entity extends THREE.Mesh {
        constructor() {
            super();
        }
    }

    return Object.assign(Entity, {});
});
