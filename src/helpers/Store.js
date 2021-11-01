module.exports = class Store {
    constructor(baseStore) {
        for( const [key, value] of Object.entries(baseStore)) {
            this.set(key, value);
        }
    }

    checkKeyArg(key) {
        if(key==='get') throw new Error('key attribute cannot be "get"');
        if(key==='set') throw new Error('key attribute cannot be "set"');
        if(key==='checkKeyArg') throw new Error('key attribute cannot be "checkKeyArg"');
    }

    set(key, value) {
        this.checkKeyArg(key);
        this[key] = value;
    }

    get(key) {
        this.checkKeyArg(key);
        return this[key];
    }
}