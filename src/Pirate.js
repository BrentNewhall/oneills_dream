import CombatShip from './CombatShip';

class Pirate extends CombatShip {
    constructor() {
        super();
        this.leaving = false;
        this.origin = { x: -120, y: this.y, width: 80, height: 80 };
    }

    leave() {
        if( this.leaving ) {
            if( this.atTarget( this.origin, 50 ) ) {
                return true;
            }
            else {
                this.moveTowardsTarget( this.origin );
                return false;
            }
        }
    }
}

export default Pirate;