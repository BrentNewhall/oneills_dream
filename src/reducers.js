function reducers( state, action ) {
    switch( action.type ) {
        case 'ADD_ALUMINUM':
            console.log( "Aluminimum added!" );
            return state;
        default:
            return state;
    }
}

export default reducers;