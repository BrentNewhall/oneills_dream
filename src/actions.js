import { ACTION_ADD_ALUMINUM, ACTION_PLACING_COLONY } from './global';

export function actionMined( data ) {
  return { type: ACTION_ADD_ALUMINUM, data };
}

export function actionPlacingColony( placement ) {
  return { type: ACTION_PLACING_COLONY, placement };
}