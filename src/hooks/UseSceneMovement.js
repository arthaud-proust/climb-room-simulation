const THREE = require('three');
const TWEEN = require('@tweenjs/tween.js');
const UseGrabbingOnRouteView = require('./UseGrabbingOnRouteView');

module.exports = class UseSceneMovement {
    constructor(camera, renderer, world) {
        this.camera = camera;
        this.renderer = renderer;
        this.world = world;

        this.tweenCoords = {
            camera: {
                x:  WORLD_SIZE/2, 
                y: 200, 
                z: WORLD_SIZE*2
            },
            lookAt: {
                x: WORLD_SIZE/2, 
                y: 20, 
                z: WORLD_SIZE/2
            }
        };

        this.leftArrow = document.getElementById('leftArrow');
        this.rightArrow = document.getElementById('rightArrow');

        this.lookPart = 'left';
        this.lookCoords= new Map([
            ['left', { camera:{x: WORLD_SIZE/2+60, y: 28, z: WORLD_SIZE/2+40}, lookAt:{x: 0, y: 45, z: WORLD_SIZE/2-30} }],
            ['center', { camera:{x: WORLD_SIZE/2, y: 60, z: WORLD_SIZE/2+75}, lookAt:{x: WORLD_SIZE/2, y: 45, z: 0} }],
            ['right', { camera:{x: WORLD_SIZE/2-60, y: 48, z: WORLD_SIZE/2+40}, lookAt:{x: WORLD_SIZE, y: 45, z: WORLD_SIZE/2-10} }]
        ]);
        this.parts = Array.from( this.lookCoords.keys() );

        this.grabbingOnRouteView = new UseGrabbingOnRouteView(this);
        this.selectedObject = null;

        this.animations = {};
    }


    firstAnimation() {
        this.animations.first = new TWEEN.Tween({ camera: this.tweenCoords.camera, lookAt: this.tweenCoords.lookAt })
        .to(this.lookCoords.get(this.lookPart), TRANSITION_FIRST_DURATION)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            this.camera.position.set(
                this.tweenCoords.camera.x,
                this.tweenCoords.camera.y,
                this.tweenCoords.camera.z
            );
            this.camera.lookAt(
                this.tweenCoords.lookAt.x,
                this.tweenCoords.lookAt.y,
                this.tweenCoords.lookAt.z
            );
        })
        .onComplete(()=>{
            this.renderer.domElement.addEventListener("click", e=>this._onclick(e), true);
            window.addEventListener('wheel', this._onWindowScroll);

            if(window.adminVersion) {
                document.getElementById('addRoute').classList.add('show')
                document.getElementById('addRoute').href = window.adminUrls.create();
            };

            this.rightArrow.classList.add('show');

            this.rightArrow.addEventListener('click', ()=>this._handleRightArrow());
            this.leftArrow.addEventListener('click', ()=>this._handleLeftArrow());

        })
        .delay(500)
        .start()
    }

    _handleRightArrow() { 
        if(this.rightArrow.classList.contains('show')) this.moveToPart(+1); 
    }
    _handleLeftArrow() { 
        if(this.leftArrow.classList.contains('show')) this.moveToPart(-1); 
    }


    moveToPart(n) {
        RENDERER_EL.dataset.routeView = false;
        let 
            nActualPart = this.parts.indexOf(this.lookPart),
            nNextPart = nActualPart + n
        ;

        // ne sort pas du nombres de parties à regarder
        if(nNextPart < 0 || nNextPart > this.parts.length-1) return;

        if(nNextPart==0) {
            this.leftArrow.classList.remove('show');
            this.rightArrow.classList.add('show');
        } else if(nNextPart==this.parts.length-1) {
            this.leftArrow.classList.add('show');
            this.rightArrow.classList.remove('show');
        } else {
            this.leftArrow.classList.add('show');
            this.rightArrow.classList.add('show');
        }

        if(window.adminVersion) document.getElementById('addRoute').classList.add('show');
        this.lookPart = this.parts[nNextPart];

        console.log({...this.lookCoords.get(this.lookPart)});
        this.animations.part = new TWEEN.Tween({ camera: this.tweenCoords.camera, lookAt: this.tweenCoords.lookAt })
            .to(this.lookCoords.get(this.parts[nNextPart]), TRANSITION_PART_DURATION)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.camera.position.set(
                    this.tweenCoords.camera.x,
                    this.tweenCoords.camera.y,
                    this.tweenCoords.camera.z
                );
                this.camera.lookAt(
                    this.tweenCoords.lookAt.x,
                    this.tweenCoords.lookAt.y,
                    this.tweenCoords.lookAt.z
                );
            })
            .start()
    }
    
    moveToSector(selection) {
        console.log({...this.lookCoords.get('center')});
        const sector = selection;
        this.grabbingOnRouteView.displacement.base = {
            x:0,
            y:0
        };
        RENDERER_EL.dataset.routeView = sector.data.type==="route";
        RENDERER_EL.dataset.sector = sector.data.identifier;

        document.getElementById('partControls').classList.remove('show');
        document.getElementById('addRoute').classList.remove('show');

        document.getElementById('sectorName').innerText = sector.data.name;

        const routeCtx = route=> `style="background:${this.getDataColor(route.color)[0]}; color:${this.getDataColor(route.color)[1]}">${route.type=='bloc'?'Bloc ':''}${route.diff}`;

        const rts = window.adminVersion?
            sector.data.routes.map(route=>`<a class="sectorRoute" href="${adminUrls.edit(route.id)}" ${routeCtx(route)}</a>`).join(''):
            sector.data.routes.map(route=>`<span class="sectorRoute" ${routeCtx(route)}</span>`).join('');
        document.getElementById('sectorRoutes').innerHTML = sector.data.routes.length==0?'Aucune voie ou bloc':rts;

        document.getElementById('sectorContainer').classList.add('show');
        document.getElementById('sectorClose').addEventListener('click', ()=>{
            // shaders.outlineSelectPass.selectedObjects = [ ];
            // shaders.outlineHoverPass.selectedObjects = [ ];
            document.getElementById('sectorContainer').classList.remove('show');
            document.getElementById('partControls').classList.add('show');
            this.lookPart = sector.data.part;
            console.log(sector.data);
            this.tweenCoords.camera = this.grabbingOnRouteView.coords.camera;
            this.tweenCoords.lookAt = this.grabbingOnRouteView.coords.lookAt;
            this.grabbingOnRouteView.displacement.base = {
                x:0,
                y:0
            };
            this.moveToPart(0);
        })

        console.log(sector)
        this.lookPart = sector.data.part;

        const boundBox = new THREE.Box3().setFromObject( sector );
        let cd = { 
            camera: {
                x: boundBox.getCenter().x,
                y: boundBox.getCenter().y*0.6,
                z: boundBox.getCenter().z
            },
            lookAt: { // fonctionne
                x: boundBox.getCenter().x, // centre de l'objet "sector"
                y: boundBox.getCenter().y,
                z: boundBox.getCenter().z
            }
        }
        switch(sector.rotation.y) {
            case 0:
                cd.camera.x += SINGLE_SECTOR_VIEW_DISTANCE[sector.data.type] + boundBox.getSize().y*1.1;
                break;
            case -Math.PI/2:
                cd.camera.z += SINGLE_SECTOR_VIEW_DISTANCE[sector.data.type] + boundBox.getSize().y*1.1;
                break;
            default:
                cd.camera.x -= SINGLE_SECTOR_VIEW_DISTANCE[sector.data.type] + boundBox.getSize().y*1.1;
                break;
        }

        this.grabbingOnRouteView.coords.camera = cd.camera;
        this.grabbingOnRouteView.coords.lookAt = cd.lookAt;

        this.animations.sector = new TWEEN.Tween({ camera: this.tweenCoords.camera, lookAt: this.tweenCoords.lookAt })
            .to(cd, TRANSITION_SECTOR_DURATION)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.camera.position.set(
                    this.tweenCoords.camera.x,
                    this.tweenCoords.camera.y,
                    this.tweenCoords.camera.z
                );
                this.camera.lookAt( 
                    this.tweenCoords.lookAt.x,
                    this.tweenCoords.lookAt.y,
                    this.tweenCoords.lookAt.z
                );
            })
            .start()
    }

    getDataColor(colorName) {
        return typeof colorsData[colorName.toLowerCase()] != 'undefined'?colorsData[colorName.toLowerCase()] : ['#FFFFFF', '#000000'];
    }

    _onclick(event) {
        if(RENDERER_EL.dataset.routeView==="true") return;

        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects(this.world.routes, true); //array

        if (intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            this.moveToSector(this.selectedObject);
        }
    }
    
    _onWindowScroll(event) {
        if (event.deltaY < 0) {
            console.log('scrolling up');
        } else if (event.deltaY > 0) {
            console.log('scrolling down');
        }
    }
}