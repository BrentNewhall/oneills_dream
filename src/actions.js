import ACTION_ADD_ALUMINUM from './global';

export function actionMined( data ) {
    console.log( "About to do an action!" );
    return { type: ACTION_ADD_ALUMINUM, data };
}