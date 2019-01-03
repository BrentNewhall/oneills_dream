const world = {
    height: 1000,
    width: 1000,
    miningCountdown: 250,
    aluminumForCollector: 20,
    aluminumForColony: 100,
    collectorImageSize: 32,
    colonyImageSize: 200
}

export const ACTION_ADD_ALUMINUM = 'ADD_ALUMINUM';
export const ACTION_PLACING_COLLECTOR = 'PLACING_COLLECTOR';
export const ACTION_PLACING_COLONY = 'PLACING_COLONY';

export default world;