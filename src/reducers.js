import ACTION_ADD_ALUMINUM from './global';

function reducers( state, action ) {
    switch( action.type ) {
        case ACTION_ADD_ALUMINUM:
            return {
                ...state,
                aluminum: action.data.amount + state.aluminum
            };
        default:
            return state;
    }
}

export default reducers;