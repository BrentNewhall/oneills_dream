import ACTION_ADD_ALUMINUM from './global';

function reducers( state, action ) {
    switch( action.type ) {
        case ACTION_ADD_ALUMINUM:
            console.log( action.data.amount + " aluminimum added!" );
            return {
                ...state,
                aluminum: action.data.amount
            };
        default:
            return state;
    }
}

export default reducers;