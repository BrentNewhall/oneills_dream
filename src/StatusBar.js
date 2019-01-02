import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import { actionMined } from './actions';

/* Displays status bar (amount of aluminum) */

class StatusBar extends Component {
    constructor( props ) {
      super( props );
      this.buildColony = this.buildColony.bind(this);
    }
  
    buildColony() {
      alert( "Building colony." );
    }
  
    render() {
      let colonyImage = 'colony-disabled.png';
      let buildColonyDisabled = 'disabled';
      if( this.props.aluminum >= 20 ) {
        buildColonyDisabled = '';
        colonyImage = 'colony.png';
      }
      return <div className='StatusBar'>
        <span className='actions'><button disabled={buildColonyDisabled} onClick={this.buildColony}><img src={'/images/' + colonyImage} className='ActionButton' alt='Build colony' /></button></span>
        <span className='stats'>Aluminum: {this.props.aluminum}</span>
      </div>;
    }
  }
  
  const mapStateToProps = state => ({
    aluminum: state.aluminum
  });
  const mapDispatchToProps = dispatch => ({
    actionMined: amount => dispatch( actionMined( { amount } ) )
  });
  const StatusBarStateful = connect(mapStateToProps, mapDispatchToProps)(StatusBar);

  export default StatusBarStateful;