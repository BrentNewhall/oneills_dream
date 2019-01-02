import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import { actionMined, actionPlacingColony } from './actions';
import world from './global';

/* Displays status bar (amount of aluminum) */

class StatusBar extends Component {
    constructor( props ) {
      super( props );
      this.buildColony = this.buildColony.bind(this);
    }
  
    buildColony() {
      this.props.actionPlacingColony( true );
    }
  
    render() {
      let colonyImage = 'colony-icon-disabled.png';
      let buildColonyDisabled = 'disabled';
      if( this.props.placingColony ) {
        colonyImage = 'colony-icon-placing.png';
      }
      else if( this.props.aluminum >= world.aluminumForColony ) {
        buildColonyDisabled = '';
        colonyImage = 'colony-icon.png';
      }
      return <div className='StatusBar'>
        <span className='actions'><button disabled={buildColonyDisabled} onClick={this.buildColony}><img src={'/images/' + colonyImage} className='ActionButton' alt='Build colony' /></button></span>
        <span className='stats'>Aluminum: {this.props.aluminum}</span>
      </div>;
    }
  }
  
  const mapStateToProps = state => ({
    aluminum: state.aluminum,
    placingColony: state.placingColony
  });
  const mapDispatchToProps = dispatch => ({
    actionMined: amount => dispatch( actionMined( { amount } ) ),
    actionPlacingColony: value => dispatch( actionPlacingColony( value ) )
  });
  const StatusBarStateful = connect(mapStateToProps, mapDispatchToProps)(StatusBar);

  export default StatusBarStateful;