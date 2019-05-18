import {
  ACTION_ADD_ALUMINUM,
  ACTION_ADD_POPULATION,
  ACTION_PLACING_COLLECTOR,
  ACTION_PLACING_MECHA,
  ACTION_PLACING_COLONY,
  ACTION_ADD_POPULATION
} from './global';

export function actionMined( data ) {
  return { type: ACTION_ADD_ALUMINUM, data };
}

export function actionAddPopulation( data ) {
  return { type: ACTION_ADD_POPULATION, data };
}

export function actionPlacingCollector( placement ) {
  return { type: ACTION_PLACING_COLLECTOR, placement };
}

export function actionPlacingMecha( placement ) {
  return { type: ACTION_PLACING_MECHA, placement };
}

export function actionPlacingColony( placement ) {
  return { type: ACTION_PLACING_COLONY, placement };
}