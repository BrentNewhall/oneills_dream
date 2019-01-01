export function actionMined( data ) {
    console.log( "About to do an action!" );
    return { type: 'ADD_ALUMINUM', data };
}