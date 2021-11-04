import * as THREE from 'three';
import World from './classes/world';
import * as TWEEN from '@tweenjs/tween.js';
const UseShaders = require('./hooks/UseShaders');
const UseSceneMovement = require('./hooks/UseSceneMovement');

global.WORLD_SIZE=214;
global.FOV=40;
global.FAR=500;
global.NEAR = 10;
global.SINGLE_SECTOR_VIEW_DISTANCE = {
    'traverse': 60,
    'route': -30
};
global.RENDERER_EL = document.getElementById('renderer');
global.TRANSITION_FIRST_DURATION = 1000;
global.TRANSITION_PART_DURATION = 1000;
global.TRANSITION_SECTOR_DURATION = 500;
global.MAX_X_DISPLACEMENT = 50;
global.MAX_Y_DISPLACEMENT = 80;

var 
    camera, 
    scene, 
    renderer,
    shaders,
    world,
    sceneMover
;


function init() {

    // create render element
    let 
        pixelRatio = window.devicePixelRatio,
        AA = pixelRatio > 1?false:true
    ;  
    renderer = new THREE.WebGLRenderer( { 
        antialias: AA,
        powerPreference: "high-performance"
    } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;

    RENDERER_EL.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x202023 );

    camera = new THREE.PerspectiveCamera( 
        FOV, 
        window.innerWidth / window.innerHeight,
        NEAR,
        FAR
    );
    scene.add( camera );
    shaders = new UseShaders(renderer, scene, camera);
    shaders.useShaderPass();

    world = new World(scene, WORLD_SIZE);

    sceneMover = new UseSceneMovement(camera, renderer, world);

    camera.position.set(
        sceneMover.tweenCoords.camera.x,
        sceneMover.tweenCoords.camera.y,
        sceneMover.tweenCoords.camera.z
    );
    camera.lookAt( 
        sceneMover.tweenCoords.lookAt.x,
        sceneMover.tweenCoords.lookAt.y,
        sceneMover.tweenCoords.lookAt.z,
    );

    // left part
    var nRoutes = 6;
    for ( let i = 0; i < nRoutes; i ++ ) {
        world.addClimbRoute(nRoutes-i, 'left', [0,0,30+(i+1)*120]);
    }

    // center part
    world.addClimbTraverse(1, 'center', [25,0,0], [0, -Math.PI/2, 0]);
    world.addClimbRoute(7, 'center', [25+300,0,0], [0, -Math.PI/2, 0]);
    world.addClimbTraverse(2, 'center', [25+300+120,0,0], [0, -Math.PI/2, 0]);
    world.addClimbRoute(8, 'center', [25+300+120+230,0,0], [0, -Math.PI/2, 0]);
    world.addClimbTraverse(3, 'center', [25+300+120+230+120,0,0], [0, -Math.PI/2, 0]);
    
    // right part    
    world.addClimbRoute(9, 'right', [25+300+120+230+120+250+25,0,0], [0, -Math.PI, 0]);
    var nRoutes = 7;
    for ( let i = 1; i < nRoutes; i ++ ) {
        world.addClimbRoute(9+i, 'right', [25+300+120+230+120+250+25,0,30+(i)*120], [0, -Math.PI, 0]);
    }

    window.addEventListener( 'resize', onWindowResize );

    camera.layers.enableAll();
    sceneMover.firstAnimation();
   
    render();
    onWindowResize();
}

function onWindowResize() {
    let rect = renderer.domElement.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize( rect.width, rect.height );

    shaders.composer.setSize( rect.width, rect.height );

    shaders.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
}


function render() { renderer.render( scene, camera ) }

function animate() {
    TWEEN.update();

    shaders.composer.render();

    requestAnimationFrame( animate );
}

window.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
})