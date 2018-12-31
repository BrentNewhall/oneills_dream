import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    // Create asteroids
    this.asteroids = [];
    for( let i = 0; i < 10; i++ ) {
      const asteroid = {
        x: Math.random() * 500,
        y: Math.random() * 500,
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
          src='images/collector.png' />
    });
    return (
      <div className="Space">
        {asteroidObjects}
        {collectorObjects}
      </div>
    );
  }
}

export default App;
