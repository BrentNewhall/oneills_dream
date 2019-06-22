import uuid from 'react-native-uuid';

class Ship {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 64;
        this.height = 64;
        this.target = null;
        this.speed = 1;
        this.armor = 10;
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

    setTarget( newTarget ) {
        if( newTarget.hasOwnProperty("x") ) {
            this.target = newTarget;
        }
    }

    distance( target ) {
        if( target.hasOwnProperty("x")  &&  target.hasOwnProperty("y") ) {
            const x = (this.x + this.width / 2) - (target.x + target.width / 2);
            const y = (this.y + this.height / 2) - (target.y + target.height / 2);
            return Math.hypot( x, y, );
        }
        else {
            return -1;
        }
    }

    atTarget( target, targetDistance ) {
        if( this.distance( target ) <= targetDistance ) {
            return true;
        }
        else {
            return false;
        }
    }

    moveTowardsTarget( target ) {
        if( target !== null  &&  target.hasOwnProperty("x")  &&  target.hasOwnProperty("y") ) {
            let x = (this.x + this.width / 2) - (target.x + target.width / 2);
            let y = (this.y + this.height / 2) - (target.y + target.height / 2);
            const l = Math.sqrt( x * x + y * y );
            x = x / l;
            y = y / l;
            this.x -= x * this.speed;
            this.y -= y * this.speed;
        }
    }
}

export default Ship;