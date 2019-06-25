import uuid from 'react-native-uuid';

class Colony {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 64;
        this.height = 64;
        this.target = null;
        this.speed = 0;
        this.armor = 100;
        this.id = uuid.v4();
    }

    getID() {
        return this.id;
    }

    setDimensions( x, y, width, height ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export default Colony