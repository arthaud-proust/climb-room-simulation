const THREE = require('three');
const TWEEN = require('@tweenjs/tween.js');
const OBJLoader = require('three/examples/jsm/loaders/OBJLoader.js').OBJLoader;
const MTLLoader = require('three/examples/jsm/loaders/MTLLoader.js').MTLLoader;
const loader = new THREE.TextureLoader();

module.exports = class {
    constructor(scene, size=500) {
        this.size = size;
        this.cubeSize = 10;
        this.scene = scene;

        // this.ROUTE_COLOR = 0xFFEBCD; 
        this.ROUTE_COLOR = 0xd9c0ad;
        // this.ROUTE_COLOR = 0xC39B53;
        // this.ROUTE_COLOR = 0xF68D2E;
        this.WALL_BASE_OPACITY = 0.1;

        this.routes=[];
        this.obj={
            walls: []
        };

        this.cubes=[];
        this.cubeBase = {
            geometry: new THREE.BoxBufferGeometry( 1, 1, 1 ),
            material: new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
        };
        this.cubeBase.geometry.translate( 0.5, 0.5, 0.5 );


        this.makeGround();
        this.setLight();
    }

    randomOffsetVal(value) {
        return value + Math.floor(Math.random()*100) * 0.00001;
    }

    setLight() {
        const ambiantLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add( ambiantLight);
        // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.3 );
        // hemiLight.position.set( 0, 85, 0 );
        // this.scene.add( hemiLight );

        // const dirLight = new THREE.DirectionalLight( 0xffffff );
        // dirLight.position.set( - 0, 40, 50 );
        // dirLight.castShadow = true;
        // dirLight.shadow.camera.top = 50;
        // dirLight.shadow.camera.bottom = - 25;
        // dirLight.shadow.camera.left = - 25;
        // dirLight.shadow.camera.right = 25;
        // dirLight.shadow.camera.near = 0.1;
        // dirLight.shadow.camera.far = 200;
        // dirLight.shadow.mapSize.set( 1024, 1024 );
        // this.scene.add( dirLight );


        const spotLights = Array(3).fill(null).map(()=>new THREE.SpotLight( 0xFFFFFF, 0.5, 0, Math.PI/3, 1, 10));

        spotLights[0].position.set( this.size/3,85, 3*this.size/4 );
        spotLights[0].target.position.set( this.size/6, 65, 2*this.size/3 );

        spotLights[1].position.set( this.size/2,85, 3*this.size/4 );
        spotLights[1].target.position.set( this.size/2, 80, 2*this.size/3 );

        spotLights[2].position.set( 2*this.size/3,85, 3*this.size/4 );
        spotLights[2].target.position.set( 5*this.size/6, 65, 2*this.size/3 );


        // this.spotLight = spotLight;
        for(let i=0; i< spotLights.length;i++) {


            // spotLights[i].castShadow = true;
            // spotLights[i].shadow.camera.top = 50;
            // spotLights[i].shadow.camera.bottom = - 25;
            // spotLights[i].shadow.camera.left = - 25;
            // spotLights[i].shadow.camera.right = 25;
            // spotLights[i].shadow.camera.near = 0.1;
            // spotLights[i].shadow.camera.far = 200;
            // spotLights[i].shadow.mapSize.set( 8192, 8192 );
            spotLights[i].shadow.mapSize.set( 4096, 4096 );
            // spotLights[i].shadow.mapSize.set( 2048, 2048 );
            // spotLights[i].shadow.mapSize.set( 512, 512 );
            spotLights[i].shadow.camera.near = 0.5;
            spotLights[i].shadow.camera.far = 400;
            spotLights[i].shadow.camera.fov = 2;
            // spotLights[i].shadow.radius = 20;

            // this.scene.add( spotLights[i] );
            // this.scene.add( spotLights[i].target );
        }
        
    }

    addCarpet(coords, size) {
        let carpet = new THREE.Mesh( new THREE.BoxBufferGeometry( ...size),  new THREE.MeshStandardMaterial( { 
            // color: 0x2326CE, 
            color: 0x3336DE, 
            // roughness: 0.5,
            // metalness:1

            // depthWrite: false,
        }));
        carpet.position.set(...coords);
        carpet.geometry.translate( size[0]/2, size[1]/2,size[2]/2);
        carpet.receiveShadow = true;
        this.scene.add( carpet );
    }

    addWall(coords, size) {
        let wall = new THREE.Mesh( new THREE.BoxBufferGeometry( ...size),  new THREE.MeshStandardMaterial( { 
            color: 0xFFFFFF, 
            transparent: true,
            opacity:this.WALL_BASE_OPACITY
            // depthWrite: false,
        }));
        wall.position.set(...coords);
        wall.geometry.translate( size[0]/2, size[1]/2,size[2]/2);
        wall.receiveShadow = true;
        this.obj.walls.push(wall);
        this.scene.add( wall );
    }
    addGround(sizes) {
        var texture = loader.load('/assets/textures/wood_floor/COLOR.jpg');
        texture.center.set(.5, .5);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.rotation = Math.PI/2;
        texture.repeat.set(3,3);

        var normMap = loader.load('/assets/textures/wood_floor/NORM.jpg');
        normMap.center.set(.5, .5);
        normMap.wrapS = THREE.RepeatWrapping;
        normMap.wrapT = THREE.RepeatWrapping;
        normMap.rotation = Math.PI/2;
        normMap.repeat.set(3,3);

        var material = new THREE.MeshPhongMaterial( { 
            // color: 0x9f7550, 
            // depthWrite: false,
            map: texture,
            normalMap: normMap,
            // displacementMap: loader.load('/assets/textures/wood_floor/DISP.png'),
            // needsUpdate:true
        } )

        console.log(material.normalMap);

        const altMaterial = new THREE.MeshStandardMaterial( { 
            // color: 0xFFFFFF, 
            color: 0x998868, 
            // depthWrite: false,
        })

        this.obj.ground = new THREE.Mesh( new THREE.BoxBufferGeometry( sizes[0], sizes[1], sizes[2]),  material);
        // this.obj.ground = new THREE.Mesh( new THREE.BoxBufferGeometry( sizes[0], sizes[1], sizes[2]),  altMaterial);
        // this.obj.ground = new THREE.Mesh( new THREE.BoxBufferGeometry( this.size, 5, 180),  material);
        // this.obj.ground = new THREE.Mesh( new THREE.BoxBufferGeometry( this.size, 5, this.size),  material);
        // this.obj.ground.rotation.x = - Math.PI / 2;
        this.obj.ground.position.x = 0;
        this.obj.ground.position.z = 0;
        this.obj.ground.position.y = 0;
        // this.obj.ground.position.y = -5;
        // this.obj.ground.geometry.translate( this.size/2, -2.5,180/2);
        this.obj.ground.geometry.translate( sizes[0]/2, -sizes[1]/2, sizes[2]/2);
        // this.obj.ground.receiveShadow = true;
        this.obj.ground.receiveShadow = false;

        this.scene.add( this.obj.ground );
    }

    makeGround() {       
        this.addGround([this.size, 5, 174]);
        // this.addWall([-5,-10,-5], [5, 110,this.size+5]); // mur gauche
        // this.addWall([0,0,-5], [this.size,100, 5]); // mur face
        // this.addWall([0,0,this.size-40], [this.size,100, 5]); // mur face
        // this.addWall([this.size,-10,-5], [5, 110,this.size+5]); // mur droit
        // this.addWall([0,100,0], [this.size, 5,this.size]); // plafond
        // this.addCarpet([0,-5,0], [55,5,this.size]);
        // this.addCarpet([55,-5,0], [this.size-55,5,55]);
        // this.addCarpet([this.size-55,-5,55], [55,5,this.size-55]);
    }

    showWalls() {
        const params = {opacity:this.WALL_BASE_OPACITY}
        const tween = new TWEEN.Tween(params)
        .to({opacity:1}, 
            1000
            // 4000
            // 99999999
            )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            for(let i=0; i<this.obj.walls.length; i++) {
                this.obj.walls[i].material.opacity = params.opacity;
            }
        })
        .start()

    }


    loadObj(data, coords=[0,0,0], rotation=[0,0,0]) {
        const obj_loader = new OBJLoader();
        const mtl_loader = new MTLLoader();




        const loadObj = (textured=false)=>{
            obj_loader.load(data.path, ( obj )=>{
  
                const texture_loader = new THREE.TextureLoader();
                this.scene.add( obj );
                let mesh = obj.children[ 0 ];
    
                // if ( mesh instanceof THREE.Mesh ) {
                //     console.log('e');
                //     mesh.geometry.computeVertexNormals(); //add this
                //     mesh.geometry.computeFaceNormals(); //add this
                // }
                if(!textured) {
                    mesh.material = new THREE.MeshStandardMaterial( {
                        color: data.color ?? 'white',
                        
                        // polygonOffset: true,
                        // polygonOffsetFactor: 1, // positive value pushes polygon further away
                        // polygonOffsetUnits: 1
                        
                        // specular: 0x111111,
                        // map: texture_loader.load( './assets/apple_obj/apple_color.jpg' ),
                        // specularMap: texture_loader.load( './assets/apple_obj/apple_specular_map.jpg' ),
                        // normalMap: texture_loader.load( './assets/apple_obj/apple_specular_map.jpg' ),
                        // shininess: 25
                    } );
                } else {
                    // mesh.material = new THREE.MeshStandardMaterial( {
                    //     color: data.color ?? 'white',
                        
                    //     // polygonOffset: true,
                    //     // polygonOffsetFactor: 1, // positive value pushes polygon further away
                    //     // polygonOffsetUnits: 1
                        
                    //     // specular: 0x111111,
                    //     map: texture_loader.load( data.texture ),
                    //     // map: texture_loader.load( './assets/apple_obj/apple_color.jpg' ),
                    //     // specularMap: texture_loader.load( './assets/apple_obj/apple_specular_map.jpg' ),
                    //     // normalMap: texture_loader.load( './assets/apple_obj/apple_specular_map.jpg' ),
                    //     // shininess: 25
                    // } );
                }

        
                // mesh.geometry.translate( 0.5, 0.5, 0.5 );
                mesh.position.x = this.randomOffsetVal(0.2*coords[0]);
                mesh.position.y = this.randomOffsetVal(0.2*coords[1]);
                mesh.position.z = this.randomOffsetVal(0.2*coords[2]);
                mesh.receiveShadow = true;
                mesh.castShadow = true;
                mesh.rotateX(rotation[0]);
                mesh.rotateY(rotation[1]);
                mesh.rotateZ(rotation[2]);
                mesh.scale.set( 20, 20, 20 );
                // mesh.scale.set( 20, 0, 20 );
                
                mesh.data = {
                    ...data,
                    routes: routesData.filter(route=>route.sectors.includes(data.identifier))
                }
                mesh.state = 'initial';
    
                // var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
                // var mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
                // var wireframe = new THREE.LineSegments( geo, mat );
                // mesh.add( wireframe );
    
                this.scene.add(mesh);
                this.routes.push(mesh);
            } );
        }

        console.log(data.path);
        // if(['r1','r2','r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 't1', 't2', 't3'].includes(data.identifier) ) {
            // loadObj(true)
            // if(data.identifier=='r6') {
            mtl_loader.load(data.mtl, (materials)=>{
                obj_loader.setMaterials(materials);
                loadObj(true)
            })
        // } else {
            // loadObj()
        // }
    }

    addClimbRoute(id, part, position, rotation) {
        this.loadObj({
            part,
            color: this.ROUTE_COLOR,
            type: 'route',
            name: `Secteur ${id}`,
            identifier: `r${id}`,
            path: `./assets/objects/voie${id}.obj`,
            mtl: `./assets/objects/voie${id}.mtl`,
            texture: `./assets/objects/textures/voie${id}.jpg`
        }, position, rotation)
    }

    addClimbTraverse(id, part, position, rotation) {
        this.loadObj({
            part,
            color: this.ROUTE_COLOR,
            type: 'traverse',
            name: `Traversée ${id}`,
            identifier: `t${id}`,
            path: `./assets/objects/traverse${id}.obj`,
            mtl: `./assets/objects/traverse${id}.mtl`,
            texture: `./assets/objects/textures/traverse${id}.jpg`
        }, position, rotation)
    }
}