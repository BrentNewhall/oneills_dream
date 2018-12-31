import React, { Component } from 'react';
import './App.css';

import world from './global';

class App extends Component {
  constructor( props ) {
    super( props );
    // Create asteroids
    this.asteroids = [];
    for( let i = 0; i < 10; i++ ) {
      const asteroid = {
        x: Math.random() * world.width,
        y: Math.random() * world.height,
        size: Math.random() * 30 + 30
      }
      this.asteroids.push( asteroid );
    }
    // Create collectors
    this.collectors = [];
    this.collectors.push({
      x: 250,
      y: 250
    });
    // Create selection reticule
    this.reticule = { x: -50, y: -50 };
    // Define functions
    this.collectorClicked = this.collectorClicked.bind(this);
  }

  collectorClicked(e) {
    const collectorIndex = parseInt( e.currentTarget.alt.substring( 10 ) );
    this.reticule.x = this.collectors[collectorIndex].x;
    this.reticule.y = this.collectors[collectorIndex].y;
    this.forceUpdate();
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
          src='images/asteroid.png' />
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
      left: this.reticule.x,
      top: this.reticule.y
    }
    const reticuleObject = <img style={reticuleStle} alt='Selector reticule'
        key='Selector reticule' className='reticule'
        src='images/reticule.png' />
    return (
      <div className="Space">
        {asteroidObjects}
        {collectorObjects}
        {reticuleObject}
      </div>
    );
  }
}

export default App;
