import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import {
  actionMined,
  actionAddPopulation,
  actionPlacingCollector,
  actionPlacingMecha,
  actionPlacingColony
} from './actions';
import world from './global';

/* Displays status bar (amount of aluminum) */

class StatusBar extends Component {
    constructor( props ) {
      super( props );
      // Bind functions
      this.buildCollector = this.buildCollector.bind(this);
      this.buildMecha = this.buildMecha.bind(this);
      this.buildColony = this.buildColony.bind(this);
      this.getTime = this.getTime.bind(this);
    }
  
    buildCollector() {
      this.props.actionPlacingCollector( true );
    }
  
    buildMecha() {
      this.props.actionPlacingMecha( true );
    }
  
    buildColony() {
      this.props.actionPlacingColony( true );
    }

    getTime() {
      let myTime = world.endGameAfterThisSeconds - this.props.time;
      const minutes = Math.floor(myTime / 60);
      const seconds = Math.floor(myTime % 60);
      return minutes + ":" + seconds.toString().padStart(2,'0');
    }
  
    render() {
      let collectorImage = 'collector-icon-disabled.png';
      let mechaImage = 'mecha-icon-disabled.png';
      let colonyImage = 'colony-icon-disabled.png';
      let buildCollectorDisabled = 'disabled';
      let buildMechaDisabled = 'disabled';
      let buildColonyDisabled = 'disabled';
      if( this.props.placingCollector ) {
        collectorImage = 'collector-icon-placing.png';
      }
      else if( this.props.aluminum >= world.aluminumForCollector ) {
        buildCollectorDisabled = '';
        collectorImage = 'collector-icon.png';
      }
      if( this.props.placingMecha ) {
        collectorImage = 'mecha-icon-placing.png';
      }
      else if( this.props.aluminum >= world.aluminumForMecha ) {
        buildMechaDisabled = '';
        mechaImage = 'mecha-icon.png';
      }
      if( this.props.placingColony ) {
        colonyImage = 'colony-icon-placing.png';
      }
      else if( this.props.aluminum >= world.aluminumForColony ) {
        buildColonyDisabled = '';
        colonyImage = 'colony-icon.png';
      }
      return <div className='StatusBar'>
        <span className='actions'>
          <button disabled={buildCollectorDisabled} onClick={this.buildCollector}>
            <img src={'images/' + collectorImage} className='ActionButton'
                alt='Build collector' />
          </button>
          <button disabled={buildMechaDisabled} onClick={this.buildMecha}>
            <img src={'images/' + mechaImage} className='ActionButton'
                alt='Build mecha' />
          </button>
          <button disabled={buildColonyDisabled} onClick={this.buildColony}>
            <img src={'images/' + colonyImage} className='ActionButton'
                alt='Build colony' />
          </button>
        </span>
        <span className='stats'>
          Aluminum: {this.props.aluminum} &nbsp;
          Population: {this.props.population} &nbsp;
          Points: {this.props.points} &nbsp;
          Time: {this.getTime()}
        </span>
      </div>;
    }
  }
  
  const mapStateToProps = state => ({
    aluminum: state.aluminum,
    population: state.population,
    points: state.points,
    placingCollector: state.placingCollector,
    placingMecha: state.placingMecha,
    placingColony: state.placingColony
  });
  const mapDispatchToProps = dispatch => ({
    actionMined: amount => dispatch( actionMined( { amount: amount } ) ),
    actionAddPopulation: amount => dispatch( actionAddPopulation( { amount: amount } ) ),
    actionPlacingCollector: value => dispatch( actionPlacingCollector( value ) ),
    actionPlacingMecha: value => dispatch( actionPlacingMecha( value ) ),
    actionPlacingColony: value => dispatch( actionPlacingColony( value ) )
  });
  const StatusBarStateful = connect(mapStateToProps, mapDispatchToProps)(StatusBar);

  export default StatusBarStateful;