module.exports = class UseGrabbingOnRouteView {
    constructor(mover) {
        this.mover = mover;

        this.displacement = {
            base: {
                x: 0,
                y: 0
            },
            actual: {
                x: 0,
                y: 0
            }
        };

        this.coords = {
            camera: {},
            lookAt: {}
        };


        this.origin = {
            x:0,
            y:0
        };
        this.enable();
    }

    
    getDistances(e) {
        return {
            x: (e.pageX - this.origin.x),
            y: (e.pageY - this.origin.y)
        };
    }

    enable() {
        document.addEventListener('mousedown', e=>this._onMouseDown(e));
        document.addEventListener('mousemove', e=>this._onMouseMove(e));
        document.addEventListener('mouseup', e=>this._onMouseUp(e));
    }

    _onMouseDown(e) {
        if(RENDERER_EL.dataset.routeView==="true") {
            this.origin = {
                x: e.pageX,
                y: e.pageY
            };
            RENDERER_EL.dataset.grab="true";
        }
    }

    _onMouseMove(e) {
        if(RENDERER_EL.dataset.grab==="true") {
            const distances = this.getDistances(e);
            this.displacement.actual = {
                x: distances.x * 0.5 + this.displacement.base.x,
                y: distances.y * 0.7 + this.displacement.base.y
            };

            switch(this.mover.lookPart) {
                case 'left':
                    this.coords.camera = {
                        x: this.mover.tweenCoords.camera.x - Math.abs(this.displacement.actual.x)/2, // dézoom quand on regarde à droite ou à gauche
                        y: this.mover.tweenCoords.camera.y + this.displacement.actual.y/5, // déplacement vertical
                        z: this.mover.tweenCoords.camera.z + this.displacement.actual.x/1, // déplacement horizontal
                    };
    
                    this.coords.lookAt = {
                        x: this.mover.tweenCoords.lookAt.x,
                        y: this.mover.tweenCoords.lookAt.y + this.displacement.actual.y/2.5,
                        z: this.mover.tweenCoords.lookAt.z - this.displacement.actual.x/5,
                    };
                    break;
                case 'center':
                    this.coords.camera = {
                        x: this.mover.tweenCoords.camera.x - this.displacement.actual.x/1, // déplacement horizontal (inversé)
                        y: this.mover.tweenCoords.camera.y + this.displacement.actual.y/5, // déplacement vertical
                        z: this.mover.tweenCoords.camera.z - Math.abs(this.displacement.actual.x)/2, // dézoom quand on regarde à droite ou à gauche
                    };
    
                    this.coords.lookAt = {
                        x: this.mover.tweenCoords.lookAt.x,
                        y: this.mover.tweenCoords.lookAt.y + this.displacement.actual.y/2.5,
                        z: this.mover.tweenCoords.lookAt.z - this.displacement.actual.x/5,
                    };
                    break;
                case 'right':
                    this.coords.camera = {
                        x: this.mover.tweenCoords.camera.x + Math.abs(this.displacement.actual.x)/2 + this.displacement.actual.y/5, // dézoom quand on regarde à droite ou à gauche (inversé)
                        y: this.mover.tweenCoords.camera.y + this.displacement.actual.y/5, // déplacement vertical
                        z: this.mover.tweenCoords.camera.z - this.displacement.actual.x/1, // déplacement horizontal (inversé)
                    };
    
                    this.coords.lookAt = {
                        x: this.mover.tweenCoords.lookAt.x,
                        y: this.mover.tweenCoords.lookAt.y + this.displacement.actual.y/2.5,
                        z: this.mover.tweenCoords.lookAt.z + this.displacement.actual.x/5,
                    };
                    break;
            }



            this.mover.camera.position.set(
                this.coords.camera.x,
                this.coords.camera.y,
                this.coords.camera.z
            );
            this.mover.camera.lookAt(
                this.coords.lookAt.x,
                this.coords.lookAt.y,
                this.coords.lookAt.z
            );
        }
    }

    _onMouseUp(e) {
        if(RENDERER_EL.dataset.grab==="true") {
            RENDERER_EL.dataset.grab="false";
            this.displacement.base = {...this.displacement.actual};
        };
    }
}