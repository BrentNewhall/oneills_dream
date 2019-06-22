import Mecha from './Mecha';
import world from './global';

class Fleet {
    constructor() {
        this.mechaList = [];
    }

    getShips() {
        return this.mechaList;
    }

    getShip( index ) {
        if( index >= 0  &&  index < this.mechaList.length ) {
            return this.mechaList[index];
        }
        else {
            return null;
        }
    }

    spawn( time, numColonies, enemies ) {
        if( time !== 0  &&
            time % world.newFleetEveryThisSeconds === 0  &&
            numColonies > 0  &&
            this.mechaList.length === 0 ) {
            let startY = Math.random() * 600;
            for( let i = 0; i < 5; i++ ) {
                const x = -50 - Math.random() * 50;
                const y = startY + Math.random() * 100;
                let newMecha = new Mecha( x, y );
                newMecha.attackPower = 2;
                newMecha.speed = 1;
                newMecha.armor = 20;
                this.mechaList.push( newMecha );
            }
            this.findTargets( enemies );
        }
    }

    findTargets( enemies ) {
        this.mechaList.forEach( (mecha) => {
            mecha.findTarget( enemies );
        });
    }

    cleanupDeadTargets( deadTargets ) {
        deadTargets.forEach( (target) => {
            this.mechaList.forEach( (mecha) => {
                if( mecha.target !== null  &&  mecha.target.getID() === target.getID() ) {
                    mecha.target = null;
                }
            })
        })
    }

    destroy( destroyedMecha ) {
        this.mechaList.forEach( (mecha, index) => {
            if( mecha.getID() === destroyedMecha.getID()  &&  mecha.armor <= 0 ) {
                this.mechaList.splice( index, 1 );
            }
        })
    }

    update( enemies ) {
        let deadTargets = [];
        this.mechaList.forEach( (mecha) => {
            if( mecha.target !== null  &&  ! mecha.atTarget( mecha.target, 50 ) ) {
                mecha.moveTowardsTarget( mecha.target );
            }
            else {
                mecha.findTarget( enemies );
            }
            let result = mecha.attack();
            if( result !== null ) {
                deadTargets.push( result );
            }
        });
        this.cleanupDeadTargets( deadTargets );
        return deadTargets;
    }
}

export default Fleet;