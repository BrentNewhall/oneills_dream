import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import StatusBarStateful from './StatusBar'
import world from './global';
import {
  actionMined, actionPlacingCollector, actionPlacingColony
} from './actions';


/* Main game world */

class World extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      reticuleX: -30,
      reticuleY: -30
    }
    // Create asteroids
    this.asteroids = [];
    for( let i = 0; i < 30; i++ ) {
      const size = Math.random() * 30 + 40;
      const asteroid = {
        x: Math.random() * world.width,
        y: Math.random() * (world.height * 0.95), // No asteroids near bottom
        size: size,
        aluminum: size
      }
      this.asteroids.push( asteroid );
    }
    // Create colonies
    this.colonies = [];
    // Create collectors
    this.collectors = [];
    this.collectors.push({
      x: 250,
      y: 250,
      target: -1,
      mining: -1,
      miningCountdown: 0
    });
    this.selectedCollector = -1;
    // Define functions
    this.collectorClicked = this.collectorClicked.bind(this);
    this.collectorAtTarget = this.collectorAtTarget.bind(this);
    this.asteroidClicked = this.asteroidClicked.bind(this);
    this.spaceClicked = this.spaceClicked.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    // Set up game loop to run at 60 fps
    setInterval( this.gameLoop, 16 );
  }

  collectorClicked(e) {
    this.selectedCollector = parseInt( e.currentTarget.alt.substring( 10 ) );
    this.setState( { 
      reticuleX: this.collectors[this.selectedCollector].x,
      reticuleY: this.collectors[this.selectedCollector].y
    } );
  }

  asteroidClicked(e) {
    if( this.selectedCollector >= 0  &&
        this.selectedCollector < this.collectors.length ) {
      const index = parseInt( e.currentTarget.alt.substring( 9 ) );
      this.collectors[this.selectedCollector].target = index;
      this.collectors[this.selectedCollector].mining = -1; // No longer mining
      // Remove reticule
      this.setState( { reticuleX: -30, reticuleY: -30 } );
    }
  }

  // Returns true if collector is within target's bounding box
  collectorAtTarget( collector, target ) {
    if( collector.x >= target.x  &&
        collector.x + 32 <= target.x + target.size  &&
        collector.y >= target.y  &&
        collector.y + 32 <= target.y + target.size ) {
      return true;
    } else {
      return false;
    }
  }

  spaceClicked(e) {
    // Place collector
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
    }
  }

  gameLoop() {
    this.collectors.forEach( (collector) => {
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
    })
  }

  render() {
    // Set up asteroid images
    const asteroidObjects = this.asteroids.map( (asteroid, index) => {
      const asteroidStyle = {
        left: asteroid.x,
        top: asteroid.y,
        height: asteroid.size,
        width: asteroid.size
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
    return (
      <div className="Space" onClick={(e) => this.spaceClicked(e)}>
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
