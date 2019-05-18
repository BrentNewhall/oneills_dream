import CombatShip from './CombatShip';
import world from './global';

class Mecha extends CombatShip {
    constructor( x, y ) {
        super( x, y, world.mechaImageSize, world.mechaImageSize );
        this.attackCountdown = 0;
        this.attackCountdownMax = world.mechaAttackCountdown;
        this.attackPower = world.mechaAttackPower;
        this.armor = world.mechaArmor;
        this.speed = world.mechaSpeed;
    }
}

export default Mecha;