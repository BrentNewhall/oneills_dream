import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import bgImage from './space_bg.jpg'
import StatusBarStateful from './StatusBar'
import world from './global';
import {
  actionMined,
  actionAddPopulation,
  actionPlacingCollector,
  actionPlacingMecha,
  actionPlacingColony,
} from './actions';
import Ship from './Ship';
import Pirate from './Pirate';
import Mecha from './Mecha';
import Fleet from './Fleet';


/* Main game world */

export class World extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      reticle: { x: -30, y: -30, width: world.reticleSize, height: world.reticleSize }
    }
    // Create asteroids
    this.asteroids = [];
    for( let i = 0; i < 60; i++ ) {
      const size = Math.random() * 30 + 40;
      const asteroid = {
        x: Math.random() * world.width,
        y: Math.random() * (world.height * 0.95), // No asteroids near bottom
        width: size,
        height: size,
        aluminum: size,
      }
      this.asteroids.push( asteroid );
    }
    // Create colonies
    this.colonies = [];
    // Create collectors
    this.collectors = [];
    this.selectedCollector = -1;
    this.createCollector( 250, 250 );
    // Mecha
    this.playerMecha = [];
    this.selectedMecha = -1;
    // Pirates
    this.pirates = [];
    // Shuttles
    this.shuttles = [];
    // Fleet
    this.fleet = new Fleet();
    // Explosions
    this.explosions = [];
    // Define functions
    this.bindMethodsToThis = this.bindMethodsToThis.bind( this );
    this.bindMethodsToThis();
    // Set up game loop to run at 60 fps
    setInterval( this.gameLoop, 16 );
  }

  bindMethodsToThis() {
    this.collectorClicked = this.collectorClicked.bind(this);
    this.playerMechaClicked = this.playerMechaClicked.bind(this);
    this.enemyMechaClicked = this.enemyMechaClicked.bind(this);
    //this.pirateClicked = this.pirateClicked.bind(this);
    this.asteroidClicked = this.asteroidClicked.bind(this);
    this.spaceClicked = this.spaceClicked.bind(this);
    //this.shipAtTarget = this.shipAtTarget.bind(this);
    this.clearReticle = this.clearReticle.bind(this);
    //this.pirateAttackTarget = this.pirateAttackTarget.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }

  createCollector( x, y ) {
    let ship = new Ship();
    ship.setDimensions( x, y, world.collectorImageSize, world.collectorImageSize );
    ship.mining = null;
    ship.miningCountdown = 0;
    ship.armor = world.collectorArmor;
    ship.speed = world.collectorSpeed;
    this.collectors.push( ship );
  }

  collectorClicked(e) {
    this.selectedCollector = parseInt( e.currentTarget.alt.substring( 10 ) );
    this.setReticle( this.collectors[this.selectedCollector] );
  }

  playerMechaClicked(e) {
    this.selectedMecha = parseInt( e.currentTarget.alt.substring( 6 ) );
    this.setReticle( this.playerMecha[this.selectedMecha] );
  }

  enemyMechaClicked(e) {
    if( this.selectedMecha !== -1 ) {
      let target = parseInt( e.currentTarget.alt.substring( 6 ) );
      this.playerMecha[this.selectedMecha].setTarget( this.fleet.getShip( target ) );
      this.selectedMecha = -1;
      this.clearReticle();
    }
  }

  pirateClicked(e) {
    if( this.selectedMecha !== -1 ) {
      const selectedPirate = parseInt( e.currentTarget.alt.substring( 7 ) );
      this.playerMecha[this.selectedMecha].target = selectedPirate;
      this.selectedMecha = -1;
      this.clearReticle();
    }
  }

  asteroidClicked(e) {
    if( this.selectedCollector >= 0  &&
        this.selectedCollector < this.collectors.length ) {
      const index = parseInt( e.currentTarget.alt.substring( 9 ) );
      this.collectors[this.selectedCollector].setTarget( this.asteroids[index] );
      this.collectors[this.selectedCollector].mining = -1; // No longer mining
      this.clearReticle();
    }
  }

  spaceClicked(e) {
    this.placeCollectorWhenClicked( e );
    this.placeMechaWhenClicked( e );
    this.placeColonyWhenClicked( e );
    /* // Place collector
    if( this.props.placingCollector ) {
      this.collectors.push({
        x: e.pageX - (world.collectorImageSize / 2),
        y: e.pageY - (world.collectorImageSize / 2),
        target: -1,
        mining: -1,
        miningCountdown: 0
      });
      this.props.actionMined( 0 - world.aluminumForCollector );
      this.props.actionPlacingCollector( false );
      this.forceUpdate();
    }
    // Place colony
    else if( this.props.placingColony ) {
      this.colonies.push({
        x: e.pageX - (world.colonyImageSize / 2),
        y: e.pageY - (world.colonyImageSize / 2)
      });
      this.props.actionMined( 0 - world.aluminumForColony );
      this.props.actionPlacingColony( false );
      this.forceUpdate();
    } */
  }

  placeCollectorWhenClicked( e ) {
    if( this.props.placingCollector ) {
      this.createCollector( e.pageX - (world.collectorImageSize / 2),
                            e.pageY - (world.collectorImageSize / 2) );
      this.props.actionMined( 0 - world.aluminumForCollector );
      this.props.actionPlacingCollector( false );
      this.forceUpdate();
    }
  }

  placeMechaWhenClicked( e ) {
    if( this.props.placingMecha ) {
      let newMecha = new Mecha(
        e.pageX - (world.mechaImageSize / 2),
        e.pageY - (world.mechaImageSize / 2),
      );
      this.playerMecha.push( newMecha );
      this.props.actionMined( 0 - world.aluminumForMecha );
      this.props.actionPlacingMecha( false );
      this.forceUpdate();
    }
  }

  placeColonyWhenClicked( e ) {
    if( this.props.placingColony ) {
      this.colonies.push( {
        x: e.pageX - (world.colonyImageWidth / 2),
        y: e.pageY - (world.colonyImageHeight / 2),
        width: world.colonyImageWidth,
        height: world.colonyImageHeight,
        population: 0,
      } );
      this.props.actionMined( 0 - world.aluminumForColony );
      this.props.actionPlacingColony( false );
      this.forceUpdate();
    }
  }

  setReticle( ship ) {
    this.setState( {
      reticle: {
        x: ship.x,
        y: ship.y,
        width: ship.width,
        height: ship.height,
      }
    });
  }

  clearReticle() {
    this.setState( {
      reticle: { x: -30, y: -30, world: world.reticleSize, height: world.reticleSize }
    });
  }

  gameLoop() {
    /* this.collectors.forEach( (collector) => {
      // Mine aluminum if on an asteroid
      if( collector.mining >= 0 ) {
        collector.miningCountdown -= 1;
        //console.log( "Mining countdown " + collector.miningCountdown );
        if( collector.miningCountdown <= 0 ) {
          this.props.actionMined( 5 );
          this.asteroids[collector.mining].aluminum -= 5;
          // If asteroid is used up, stop mining it
          if( this.asteroids[collector.mining].aluminum < 0 ) {
            this.asteroids[collector.mining].aluminum = 0;
            collector.mining = -1;
          }
          collector.miningCountdown = world.miningCountdown;
          this.forceUpdate();
        }
      }
      // Move towards a target if selected
      if( collector.target >= 0 ) {
        if( ! this.collectorAtTarget(collector, this.asteroids[collector.target]) ) {
          // Move towards target
          const target = this.asteroids[collector.target];
          if( collector.x >= target.x + 2 ) {
            collector.x -= 1;
          }
          else if( collector.x <= target.x + target.size ) {
            collector.x += 1;
          }
          if( collector.y >= target.y + 2 ) {
            collector.y -= 1;
          }
          else if( collector.y <= target.y + target.size ) {
            collector.y += 1;
          }
          this.forceUpdate();
        } else {
          // Reached target
          collector.mining = collector.target;
          collector.target = -1;
          collector.miningCountdown = world.miningCountdown;
        }
      }
    }) */
  }

  render() {
    // Set up asteroid images
    const asteroidObjects = this.asteroids.map( (asteroid, index) => {
      const asteroidStyle = {
        left: asteroid.x,
        top: asteroid.y,
        height: asteroid.width,
        width: asteroid.height,
      }
      let asteroidImage = 'images/asteroid.png';
      if( asteroid.aluminum <= 0 ) {
        asteroidImage = 'images/asteroid-depleted.png';
      }
      return <img style={asteroidStyle} alt={'Asteroid ' + index}
          key={'asteroid' + index} className='asteroid'
          src={asteroidImage} onClick={this.asteroidClicked} />
    });
    // Set up colony images
    const colonyObjects = this.colonies.map( (colony, index) => {
      const colonyStyle = {
        left: colony.x,
        top: colony.y,
        width: world.colonyImageSize,
        height: world.colonyImageSize
      }
      return <img style={colonyStyle} alt={'Colony ' + index}
          key={'colony' + index} className='colony'
          src='images/Colony.png' />
    });
    // Set up collector images
    const collectorObjects = this.collectors.map( (collector, index) => {
      const collectorStyle = {
        left: collector.x,
        top: collector.y
      }
      return <img style={collectorStyle} alt={'Collector ' + index}
          key={'collector' + index} className='collector'
          src='images/collector.png' onClick={this.collectorClicked} />
    });
    // Set up reticule image
    const reticuleStle = {
      left: this.state.reticuleX,
      top: this.state.reticuleY
    }
    const reticuleObject = <img style={reticuleStle} alt='Selector reticule'
        key='Selector reticule' className='reticule'
        src='images/reticule.png' />
    const spaceStyle = {
      backgroundImage: 'url(' + bgImage + ')'
    }
    return (
      <div className="Space" style={spaceStyle}
          onClick={(e) => this.spaceClicked(e)}>
        {asteroidObjects}
        {colonyObjects}
        {collectorObjects}
        {reticuleObject}
        <StatusBarStateful />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return ( <WorldStateful /> );
  }
}

const mapStateToProps = state => ({
  aluminum: state.aluminum,
  placingCollector: state.placingCollector,
  placingColony: state.placingColony
});
const mapDispatchToProps = dispatch => ({
  actionMined: amount => dispatch( actionMined( { amount: amount } ) ),
  actionPlacingCollector: value => dispatch( actionPlacingCollector( value ) ),
  actionPlacingColony: value => dispatch( actionPlacingColony( value ) )
});
const WorldStateful = connect(mapStateToProps, mapDispatchToProps)(World);

export default App;
