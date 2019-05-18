const world = {
    height: 2400,
    width: 1000,
    miningCountdown: 250,
    aluminumForCollector: 20,
    aluminumForMecha: 5, //25
    aluminumForColony: 1, //100
    collectorSpeed: 1,
    collectorImageSize: 32,
    collectorArmor: 50,
    reticleSize: 32,
    colonyImageWidth: 265,
    colonyImageHeight: 208,
    pirateAttackCountdown: 50,
    pirateAttackPower: 10,
    pirateSpeed: 0.2,
    pirateImageSize: 61,
    pirateArmor: 50,
    newPirateEveryThisSeconds: 10, //60
    mechaAttackCountdown: 50,
    mechaAttackPower: 10,
    mechaImageSize: 101,
    mechaSpeed: 1.5,
    mechaArmor: 100,
    explosionSize: 64,
    explosionLength: 16,
    shuttleWidth: 64,
    shuttleHeight: 27,
    shuttleSpeed: 1,
    newFleetEveryThisSeconds: 15,
}

export const ACTION_ADD_ALUMINUM = 'ADD_ALUMINUM';
export const ACTION_ADD_POPULATION = 'ADD_POPULATION';
export const ACTION_PLACING_COLLECTOR = 'PLACING_COLLECTOR';
export const ACTION_PLACING_COLONY = 'PLACING_COLONY';
export const ACTION_PLACING_MECHA = 'PLACING_MECHA';

export default world;