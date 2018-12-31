import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.asteroids = [];
    for( let i = 0; i < 10; i++ ) {
      const asteroid = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        size: Math.random() * 30 + 30
      }
      this.asteroids.push( asteroid );
    }
  }

  render() {
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
    })
    return (
      <div className="Space">
        {asteroidObjects}
      </div>
    );
  }
}

export default App;
