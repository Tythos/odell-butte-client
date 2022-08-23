/**
 * 
 */

require([
    "three.js/build/three",
    "OrbitControls/index",
    "Terrain/index",
    "Entity/index"
], function(THREE, OrbitControls, Terrain, Entity) {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.up.set(0, 0, 1);
    let renderer = new THREE.WebGLRenderer();
    let taskQueue = [
        () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, () => {
            // let g = new THREE.BoxGeometry(1, 1, 1);
            // let m = new THREE.MeshBasicMaterial({
            //     "color": 0x00ff00
            // });
            // scene.add(new THREE.Mesh(g, m));
        }, () => {
            scene.add(camera);
            camera.position.set(1, 2, 3);
            camera.lookAt(0, 0, 0);
        }, () => {
            let t = new Terrain();
            t.loadTopography("Terrain/tile.topography.bin");
            t.loadTexture("Terrain/tile.texture.png");
            t.loadPolygon("Terrain/tile.polygon.kml");
            t.scale.set(0.1, 0.1, 10);
            scene.add(t);
        }, () => {
            let al = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(al);
        }, () => {
            let pl = new THREE.PointLight(0xffffff, 0.5);
            pl.position.set(0, 0, 10);
            scene.add(pl);
        }, () => {
            let ah = new THREE.AxesHelper();
            ah.scale.set(10, 10, 10);
            scene.add(ah);
        }, () => {
            let e = new Entity();
            scene.add(e);
        }
    ];
    window.document.body.appendChild(renderer.domElement);
    let oc = new OrbitControls(camera, renderer.domElement);

    function render() {
        requestAnimationFrame(render);
        oc.update();
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
