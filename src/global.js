const world = {
    height: 2400,
    width: 1000,
    miningCountdown: 50,
    aluminumForCollector: 20,
    aluminumForMecha: 5, //25
    aluminumForColony: 1, //100
    collectorSpeed: 1,
    collectorImageSize: 32,
    collectorArmor: 50,
    reticleSize: 32,
    colonyImageWidth: 265,
    colonyImageHeight: 208,
    pirate: {
        attackCountdown: 50,
        attackPower: 10,
        speed: 0.2,
        imageSize: 61,
        armor: 50,
    },
    newPirateEveryThisSeconds: 10, //60
    mechaAttackCountdown: 50,
    mechaAttackPower: 10,
    mechaImageSize: 101,
    mechaSpeed: 1.5,
    mechaArmor: 100,
    explosionSize: 64,
    explosionLength: 16,
    shuttle: {
        width: 64,
        height: 27,
        speed: 1,
    },
    newFleetEveryThisSeconds: 15,
    endGameAfterThisSeconds: 30,
}

export const ACTION_ADD_ALUMINUM = 'ADD_ALUMINUM';
export const ACTION_ADD_POPULATION = 'ADD_POPULATION';
export const ACTION_PLACING_COLLECTOR = 'PLACING_COLLECTOR';
export const ACTION_PLACING_COLONY = 'PLACING_COLONY';
export const ACTION_PLACING_MECHA = 'PLACING_MECHA';
export const ACTION_ADD_POINTS = 'ADD_POINTS';

export default world;