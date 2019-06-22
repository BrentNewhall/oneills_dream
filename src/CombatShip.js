import Ship from './Ship';

class CombatShip extends Ship {
    constructor( x, y, width, height ) {
        super();
        this.setDimensions( x, y, width, height );
        this.attackCountdown = 0;
        this.attackCountdownMax = 50;
        this.attackPower = 10;
        this.attackRange = 80;
    }

    /* Returns target if it was hit by an attack; null otherwise. */
    attack() {
        const originalTarget = this.target;
        if( this.target !== null ) {
            if( this.distance(this.target) <= this.attackRange ) {
                if( this.attackCountdown > 0 ) {
                    this.attackCountdown -= 1;
                }
                else {
                    this.attackCountdown = this.attackCountdownMax;
                    this.target.armor -= this.attackPower;
                    if( this.target.armor <= 0 ) {
                        this.target = null;
                        console.log( "Destroyed; original is", originalTarget );
                    }
                    return originalTarget;
                }
            }
            else {
                this.moveTowardsTarget( this.target );
            }
        }
        return null;
    }

    _findNearestTarget( targets ) {
        if( targets === null  ||  targets.length === 0 ) {
            return null;
        }
        const here = this;
        let minDistance = 1000000000;
        let nearestTarget = null;
        targets.forEach( (target) => {
            const d = here.distance(target);
            if( d < minDistance ) {
                minDistance = d;
                nearestTarget = target;
            }
        });
        return nearestTarget;
    }

    findTarget( targets ) {
        if( this.target === null ) {
            const nearestTarget = this._findNearestTarget( targets );
            if( nearestTarget !== null ) {
                this.target = nearestTarget;
            }
        }
    }
}

export default CombatShip;