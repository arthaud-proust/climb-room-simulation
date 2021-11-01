// class pour l'animation
class Mover {
    constructor(obj, steps) {

        this.obj = obj;

        this.rawSteps = steps;
        this.defaultStep = 0.1;
        this.handleSteps();

        console.log(this.steps);
        // this.steps = ; 

        this.directions = {
            x:0,
            y:0,
            z:0
        }
    }

    handleSteps() {
        if(this.rawSteps.x && this.rawSteps.y && this.rawSteps.z) {
            if(isNumeric(this.rawSteps.x) && isNumeric(this.rawSteps.y) && isNumeric(this.rawSteps.z)) {
                this.steps = this.rawSteps;
                delete this.rawSteps;
            }
        } else if(isNaN(this.rawSteps)) {
            this.steps = {
                x: this.defaultStep,
                y: this.defaultStep,
                z: this.defaultStep
            };
            delete this.rawSteps;
        } else {
            this.steps = {
                x: this.rawSteps,
                y: this.rawSteps,
                z: this.rawSteps
            };
            delete this.rawSteps;
        }
    }

    setDirection(coord, value) {
        if(this.directions[coord] == value) {
            this.directions[coord] = 0;
        } else {
            this.directions[coord] = value
        }
    }


    update() {
        Object.keys(this.directions).forEach(direction => {
            this.obj.rotation[direction] += this.directions[direction] * this.steps[direction];
        });

    }
}


class Sizer {
    constructor(sizes, align) {
        this.sizes = sizes;
        this.alignments = align ?? {};

        this.alignProps = {
            'middle': uValue=>uValue,
            'start': uValue=>0.5*uValue,
            'end': uValue=>1.5*uValue
        }
    }

    align(unit, value) { 
        this.alignments[unit] = typeof value=="string"?(this.alignProps[value]??1) : value;
    }

    fill(sizes) {
        this.sizes = sizes;
    }

    get(unit) {
        let value = this.sizes[unit] ?? 0;
        return typeof this.alignments[unit] === 'function'?this.alignments[unit](value):value;
    }

    set(unit, value) {
        this.sizes[unit] = value;
    }

    add(unit, value) {
        this.set(unit, this.get(unit)+value);
    }

    times(unit, value) {
        this.set(unit, this.get(unit)*value);
    }

    inOrder(units) {
        var tbl = [];
        for(let unit of units.split(';')) {
            tbl.push(this.get(unit));
        }
        return tbl;
    }
}

module.exports = {Mover, Sizer};