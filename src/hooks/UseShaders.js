const EffectComposer = require('three/examples/jsm/postprocessing/EffectComposer.js').EffectComposer;
const RenderPass = require('three/examples/jsm/postprocessing/RenderPass.js').RenderPass;
const ShaderPass = require('three/examples/jsm/postprocessing/ShaderPass.js').ShaderPass;
const OutlinePass = require('three/examples/jsm/postprocessing/OutlinePass.js').OutlinePass;
const FXAAShader = require('three/examples/jsm/shaders/FXAAShader.js').FXAAShader;


module.exports = class UseShaders {
    constructor (renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    
        this.composer = new EffectComposer( renderer );

        this.renderPass = new RenderPass( scene, camera );
        this.composer.addPass( this.renderPass );
    }
    useOutlineHoverPass() {
        this.outlineHoverPass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera );
        Object.assign(this.outlineHoverPass, {        
            edgeStrength: 1.5,
            edgeGlow: 0.0,
            edgeThickness: 0.1,
            pulsePeriod: 0,
        });
        this.outlineHoverPass.visibleEdgeColor.set('#ffffff');
        this.outlineHoverPass.hiddenEdgeColor.set(0x190a05);
        this.composer.addPass( this.outlineHoverPass );
    }

    useOutlineSelectPass() {
        this.outlineSelectPass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera );
        Object.assign(outlineSelectPass, {
            edgeStrength: 2.5,
            edgeGlow: 0.0,
            edgeThickness: 0.1,
            pulsePeriod: 0,
        });
        this.composer.addPass( this.outlineSelectPass );
    }

    useShaderPass() {
        this.effectFXAA = new ShaderPass( FXAAShader );
        this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
        this.composer.addPass( this.effectFXAA );
    }
}