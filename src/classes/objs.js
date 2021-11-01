const {Sizer} = require('./classes');
const THREE = require('three');

class Obj {
    constructor(scene, args={}) {

        this._alignProps = {
            'middle': 1,
            'start': 0.5,
            'end': 1.5
        }

        this.DEFAULT = {
            color: 'gray',
            coords: new Sizer({x:0,y:0,z:0}),
            sizes: new Sizer({h:1, w:1, d:10})
        };

        this.scene = scene;
        this._args = args;
        
        this._handleDefault();
        this._construct();
    }

    _handleDefault() {
        for(const [key, value] of Object.entries(this.default())) {
            this.DEFAULT[key] = value;
        }
    }

    _construct() {
        for(let key of Object.keys(this.DEFAULT)) {
            this[key] = this._args[key] || this.DEFAULT[key];
        }
        this._build();
        console.log('obj added');
    }

    align(unit, value) {
        this.coords.align(unit, value);
        console.log(...this.coords.inOrder('x;y;z'));
        this.mesh.position.set(...this.coords.inOrder('x;y;z'));
    }

    default() {
        // DEFAULT
        return {};
    }

    setGeometry() {
        // DEFAULT
        this.geometry = new THREE.BoxGeometry(...this.sizes.inOrder('w;h;d'));
    }

    setMaterial() {
        // DEFAULT
        this.material = new THREE.MeshStandardMaterial( { roughness: 0 } );
        // this.material = new THREE.MeshPhongMaterial( { color: 0xF0F080, dithering: true } );
        // this.material = new THREE.MeshLambertMaterial();
    }

    setMesh() {
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        this.mesh.castShadow = true; //default is false
        this.mesh.receiveShadow = true; //default
    }

    beforeBuild() {
        return
    }

    afterBuild() {
        return
    }

    _build() {

        this.beforeBuild();
        // MODIFIABLE
        this.setGeometry();
        this.setMaterial();
        this.setMesh();

        // NOT
        this.scene.add( this.mesh );
        this.mesh.position.set(...this.coords.inOrder('x;y;z'));
        this.mesh.material.color.set(this.color);

        this.afterBuild();

        console.log(this);
    }
}





class Box extends Obj {
    setGeometry() {
        this.geometry = new THREE.BoxGeometry(...this.sizes.inOrder('w;h;d'));
    }
}

module.exports = {Obj, Pilier, Box};