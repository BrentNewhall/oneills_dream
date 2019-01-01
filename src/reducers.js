import ACTION_ADD_ALUMINUM from './global';

function reducers( state, action ) {
    switch( action.type ) {
        case ACTION_ADD_ALUMINUM:
            console.log( "Aluminimum added!" );
            return state;
        default:
            return state;
    }
}

export default reducers;