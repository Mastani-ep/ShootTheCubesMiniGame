let camera, scene, renderer;
let rightClicked = false;
let controls, time = Date.now();
let objects = [];
let balls = [];
let balls_inter = [];
let box_inter = [];
let emitter = new THREE.Object3D();
let speed = 350;
let clock = new THREE.Clock();
let step = 0;
let cubes_num = 30;
let score = 0;
let ray;
let mask;
let instructions = document.getElementById('instructions');
let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

let shootLeftClick = function (event) {
    switch (event.button) {
        case 0:
            if (rightClicked) {
                shootBall(scene, camera, balls, balls_inter);
            }
            break;
    }
};

let rightClick = function (event) {
    switch (event.button) {
        case 2:
            if (rightClicked) {
                rightClicked = false;
                removeMask(camera);
                break;
            } else {
                rightClicked = true;
                addMask(camera)
                break;
            }
    }
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


if ( havePointerLock ) {
    let element = document.body;
    let pointerlockchange = function () {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controls.enabled = true;
            document.addEventListener('pointerup', rightClick, false);
            document.addEventListener('pointerup', shootLeftClick, false);
        } else {
            document.removeEventListener('pointerup', rightClick, false);
            document.removeEventListener('pointerup', shootLeftClick, false);
            controls.enabled = false;
            instructions.style.display = '';
        }
    };

    let pointerlockerror = function () {
        instructions.style.display = '';
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
    document.addEventListener('shootLeftClick', shootLeftClick, false);

    instructions.addEventListener( 'click', function () {
        instructions.style.display = 'none';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( /Firefox/i.test( navigator.userAgent ) ) {
            let fullscreenchange = function () {
                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);
                    element.requestPointerLock();
                }
            };
            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
        }, false );

} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    scene = new THREE.Scene();

    createSkybox(scene);
    createCubes(scene, objects, box_inter, cubes_num);
    createLights(scene);
    mask = createMask();
    renderer = createRenderer();

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    ray = new THREE.Raycaster();
    ray.ray.direction.set( 0, -1, 0 );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {

    requestAnimationFrame( animate );
    document.getElementById( 'score_num' ).textContent = 'SCORE: ' + ( score ) + '/30' ;
    controls.isOnObject( false );
    ray.ray.origin.copy( controls.getObject().position );
    ray.ray.origin.y -= 10;
    isPLayerOnCube(controls, ray, objects);

    controls.update( Date.now() - time );
    renderer.render( scene, camera );
    time = Date.now();

    updateBallsPos(clock, balls, balls_inter);
    score = checkShotCubes(scene, objects, box_inter, balls, balls_inter, score);

    if(box_inter.length===0){
        document.getElementById( 'victory_name' ).textContent = "YOU WON!!!";
    }
}

init();
animate();