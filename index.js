/**
 * 
 */

require(["three.js/build/three"], function(THREE) {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    let taskQueue = [
        () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, () => {
            let g = new THREE.BoxGeometry(1, 1, 1);
            let m = new THREE.MeshBasicMaterial({
                "color": 0x00ff00
            });
            scene.add(new THREE.Mesh(g, m));
        }, () => {
            scene.add(camera);
            camera.position.set(1, 2, 3);
            camera.lookAt(0, 0, 0);
        }
    ];
    window.document.body.appendChild(renderer.domElement);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function taskRunner() {
        if (taskQueue[0]) {
            taskQueue[0]();
            taskQueue.splice(0, 1);
        }
    }

    requestAnimationFrame(render);
    setInterval(taskRunner, 100);

    Object.assign(window, {
        "scene": scene,
        "camera": camera,
        "renderer": renderer
    });
});
