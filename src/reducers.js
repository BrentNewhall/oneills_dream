import {
    ACTION_ADD_ALUMINUM,
    ACTION_ADD_POPULATION,
    ACTION_PLACING_COLLECTOR,
    ACTION_PLACING_MECHA,
    ACTION_PLACING_COLONY,
    ACTION_ADD_POINTS,
  } from './global';
  
function reducers( state, action ) {
    switch( action.type ) {
        case ACTION_ADD_ALUMINUM:
            return {
                ...state,
                aluminum: action.data.amount + state.aluminum
            };
        case ACTION_ADD_POPULATION:
            return {
                ...state,
                population: action.data.amount + state.population
            }
        case ACTION_PLACING_COLLECTOR:
            return {
                ...state,
                placingCollector: action.placement
            }
        case ACTION_PLACING_MECHA:
            return {
                ...state,
                placingMecha: action.placement
            }
        case ACTION_PLACING_COLONY:
            return {
                ...state,
                placingColony: action.placement
            }
        case ACTION_ADD_POINTS:
            return {
                ...state,
                points: action.points.points + state.points
            }
        default:
            return state;
    }
}

export default reducers;