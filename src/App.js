import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import StatusBarStateful from './StatusBar'
import world from './global';
import { actionMined } from './actions';


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
      const asteroid = {
        x: Math.random() * world.width,
        y: Math.random() * world.height,
        size: Math.random() * 30 + 40
      }
      this.asteroids.push( asteroid );
    }
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

  spaceClicked() {
    if( this.props.placingColony ) {
      alert( "Place colony here!" );
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
      return <img style={asteroidStyle} alt={'Asteroid ' + index}
          key={'asteroid' + index} className='asteroid'
          src='images/asteroid.png' onClick={this.asteroidClicked} />
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
      <div className="Space" onClick={this.spaceClicked}>
        {asteroidObjects}
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
  placingColony: state.placingColony
});
const mapDispatchToProps = dispatch => ({
  actionMined: amount => dispatch( actionMined( { amount: amount } ) )
});
const WorldStateful = connect(mapStateToProps, mapDispatchToProps)(World);

export default App;
