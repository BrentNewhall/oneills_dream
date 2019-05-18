import Ship from './Ship';
import world from './global';

class Shuttle extends Ship {
    constructor( targetColony ) {
        super();
        this.setDimensions( 2500, 500, world.shuttle.width, world.shuttle.height );
        this.speed = world.shuttle.speed;
        this.targetColony = targetColony;
        this.offloading = false;
        this.colonyLoading = 100;
    }
}

export default Shuttle;