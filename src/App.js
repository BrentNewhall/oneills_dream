import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spritesheet from 'react-responsive-spritesheet';
import ReactAudioPlayer from 'react-audio-player';
import './App.css';

import bgImage from './earth_edge.jpg'
import StatusBarStateful from './StatusBar'
import world, { options } from './global';
import {
  actionMined,
  actionAddPopulation,
  actionPlacingCollector,
  actionPlacingMecha,
  actionPlacingColony,
  actionAddPoints,
} from './actions';
import Ship from './Ship';
import Shuttle from './Shuttle';
import Pirate from './Pirate';
import Mecha from './Mecha';
import Fleet from './Fleet';


function OptionsComponent( props ) {
  return <div id="options">
    <h2>Options</h2>
    <div className="options-box">
      <label><input type="checkbox" onChange={(e) => props.clickedOptionBGMusic(e)} defaultChecked={props.options.playBGmusic} /> Play music</label><br />
      <label><input type="checkbox" onChange={(e) => props.clickedOptionSoundFX(e)} defaultChecked={props.options.playSoundFX} /> Play sound effects</label>
    </div>
  </div>
}
function TitleScreen(props) {
  const gameOver = props.points > 0 ? <div><h2>Game Over</h2><p>You ended the game with <span className="game-over-points">{props.points}</span> points.</p></div> : [];
  return <div id="title-screen">
    <h1>O'Neill's Dream</h1>
    {gameOver}
    <button onClick={() => { props.startGame(); }}>Start Game</button>
    <OptionsComponent clickedOptionBGMusic={props.clickedOptionBGMusic} clickedOptionSoundFX={props.clickedOptionSoundFX} options={props.options} />
    <h2>Credits</h2>
    <p>Game written by <a href="http://brentnewhall.com">Brent P. Newhall</a></p>
    <p>Music from <a href="https://filmmusic.io">Filmmusic.io</a>: "The Complex" by <a href="https://incompetech.com">Kevin MacLeod</a>, licensed <a href="http://creativecommons.org/licenses/by/4.0/">CC BY</a></p>
  </div>
}

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
    this.resetGame();
    // Miscellaneous
    this.showTitleScreen = true;
    this.bgMusic = [];
    // Define functions
    this.bindMethodsToThis = this.bindMethodsToThis.bind( this );
    this.bindMethodsToThis();
    // Set up game loop to run at 60 fps
    setInterval( this.gameLoop, 16 );
  }

  bindMethodsToThis() {
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.clickedOptionBGMusic = this.clickedOptionBGMusic.bind(this);
    this.clickedOptionSoundFX = this.clickedOptionSoundFX.bind(this);
    this.collectorClicked = this.collectorClicked.bind(this);
    this.playerMechaClicked = this.playerMechaClicked.bind(this);
    this.enemyMechaClicked = this.enemyMechaClicked.bind(this);
    this.pirateClicked = this.pirateClicked.bind(this);
    this.asteroidClicked = this.asteroidClicked.bind(this);
    this.spaceClicked = this.spaceClicked.bind(this);
    this.clearReticle = this.clearReticle.bind(this);
    this.createPirates = this.createPirates.bind(this);
    this.pirateAttackTarget = this.pirateAttackTarget.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }

  // ********** Start game

  resetGame() {
    this.startTime = new Date();
    this.time = 0;
    this.points = 0;
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
    // Create colonies
    this.colonies = [];
    // Explosions
    this.explosions = [];
    this.props.actionMined( 0 - this.props.aluminum );
    
  }

  startGame() {
    this.showTitleScreen = false;
    this.resetGame();
    if( options.playBGmusic ) {
      document.getElementById("audio-player").play();
    }
    this.forceUpdate();
  }

  checkForGameOver( time ) {
    if( time >= world.endGameAfterThisSeconds ||
        ( this.collectors.length === 0  &&  this.playerMecha.length === 0  &&  this.colonies.length === 0 ) ) {
      this.showTitleScreen = true;
      document.getElementById("audio-player").pause();
    }
  }

  // ********** Options

  clickedOptionBGMusic( event ) {
    options.playBGmusic = event.target.checked;
  }

  clickedOptionSoundFX( event ) {
    options.playSoundFX = event.target.checked;
  }

  // ********** Click events

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
      this.playerMecha[this.selectedMecha].setTarget( this.pirates[selectedPirate] );      
      this.selectedMecha = -1;
      this.clearReticle();
    }
  }

  asteroidClicked(e) {
    if( this.selectedCollector >= 0  &&
        this.selectedCollector < this.collectors.length ) {
      const index = parseInt( e.currentTarget.alt.substring( 9 ) );
      this.collectors[this.selectedCollector].setTarget( this.asteroids[index] );
      this.collectors[this.selectedCollector].mining = null; // No longer mining
      this.clearReticle();
    }
  }

  spaceClicked(e) {
    this.placeCollectorWhenClicked( e );
    this.placeMechaWhenClicked( e );
    this.placeColonyWhenClicked( e );
  }

  placeCollectorWhenClicked( e ) {
    if( this.props.placingCollector ) {
      this.createCollector( e.pageX - (world.collectorImageSize / 2),
                            e.pageY - (world.collectorImageSize / 2) );
      this.props.actionMined( 0 - world.aluminumForCollector );
      this.props.actionPlacingCollector( false );
      this.props.actionAddPoints( world.aluminumForCollector * 2 );
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
      this.props.actionAddPoints( world.aluminumForMecha * 2 );
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
      this.props.actionAddPoints( world.aluminumForColony * 5 );
      this.forceUpdate();
    }
  }

  // ********** Reticle

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

  // ********** Shuttles

  createShuttle( seconds ) {
    if( this.colonies.length > 0  &&  seconds % 10 === 0  &&  this.shuttles.length === 0 ) {
      const targetColony = parseInt( Math.random() * this.colonies.length );
      const newShuttle = new Shuttle( targetColony );
      this.shuttles.push( newShuttle );
    }
  }

  shuttleOffload( shuttle ) {
    shuttle.colonyLoading--;
    if( shuttle.colonyLoading <= 0 ) {
      this.colonies[shuttle.targetColony].population += 100;
      this.props.actionAddPopulation( 100 );
      this.props.actionAddPoints( 100 );
    }
  }

  moveShuttleTowardsEarth( shuttle, shuttleIndex ) {
    const earth = { x: 2500, y: 500, width: 16, height: 16 };
    if( shuttle.distance( earth ) <= 32 ) {
      this.shuttles.splice( shuttleIndex, 1 );
    }
    else {
      shuttle.moveTowardsTarget( earth );
      this.forceUpdate();
    }
  }

  updateShuttles() {
    this.shuttles.forEach( (shuttle, shuttleIndex) => {
      if( shuttle.targetColony !== null  &&  ! shuttle.offloading ) {
        if( shuttle.distance( this.colonies[shuttle.targetColony] ) <= 50 ) {
          shuttle.offloading = true;
        }
        else {
          shuttle.moveTowardsTarget( this.colonies[shuttle.targetColony] );
          this.forceUpdate();
        }
      }
      else if( shuttle.offloading ) {
        if( shuttle.colonyLoading <= 0 ) {
          this.moveShuttleTowardsEarth( shuttle, shuttleIndex );
          this.forceUpdate();
        }
        else {
          this.shuttleOffload( shuttle );
        }
      }
    });
  }

  // ********** Pirates

  createPirates( time ) {
    if( time !== 0  &&  time % world.newPirateEveryThisSeconds === 0 ) {
      if( this.pirates.length === 0 ) {
        const y = parseInt(Math.random() * world.height / 10);
        const pirate = new Pirate();
        pirate.setDimensions( -50, y, world.pirate.imageSize, world.pirate.imageSize );
        pirate.attackCountdownMax = world.pirate.attackCountdown;
        pirate.attackCountdown = 0;
        pirate.attackPower = world.pirate.attackPower
        pirate.armor = world.pirate.armor;
        pirate.speed = world.pirate.speed;
        this.pirates.push( pirate );
      }
    }
  }

  pirateAttackTarget( pirate ) {
    if( pirate.distance( this.collectors[pirate.target] ) < 90 ) {
      if( pirate.attackCountdown > 0 ) {
        pirate.attackCountdown -= 1;
      }
      else {
        pirate.attackCountdown = world.pirate.attackCountdown;
        this.collectors[pirate.target].armor -= world.pirate.attackAmount;
        this.addExplosion( this.explosions,
          this.collectors[pirate.target] );
        if( this.collectors[pirate.target].armor <= 0 ) {
          this.collectors.splice( pirate.target, 1 );
          this.selectedCollector = -1;
          pirate.target = -2;
          this.forceUpdate();
        }
      }
    }
  }

  // ********** Collectors

  createCollector( x, y ) {
    let ship = new Ship();
    ship.setDimensions( x, y, world.collectorImageSize, world.collectorImageSize );
    ship.mining = null;
    ship.miningCountdown = 0;
    ship.armor = world.collectorArmor;
    ship.speed = world.collectorSpeed;
    this.collectors.push( ship );
  }

  collectorMineAluminum( collector ) {
    // Mine aluminum if on asteroid
    if( collector.mining !== null ) {
      collector.miningCountdown -= 1;
      if( collector.miningCountdown <= 0 ) {
        this.props.actionMined( 1 );
        collector.mining.aluminum -= 1;
        // If asteroid is used up, stop mining it
        if( collector.mining.aluminum <= 0 ) {
          collector.mining.aluminum = 0;
          collector.mining = null;
        }
        collector.miningCountdown = world.miningCountdown;
        this.forceUpdate();
      }
    }
  }

  collectorMoveTowardsTarget( collector ) {
    if( collector.target !== null ) {
      if( ! collector.atTarget( collector.target, 5 ) ) {
        collector.moveTowardsTarget( collector.target );
        this.forceUpdate();
      }
      else {
        // Reached target
        collector.mining = collector.target;
        collector.target = null;
        collector.miningCountdown = world.miningCountdown;
      }
    }
  }

  // ********** Explosions

  addExplosion( explosions, target ) {
    explosions.push({
      x: target.x + (target.width / 2) - (world.explosionSize / 2) + (Math.random() * 40 - 20),
      y: target.y + (target.height / 2) - (world.explosionSize / 2) + (Math.random() * 40 - 20),
      counter: world.explosionLength,
    });
  }

  updateExplosions( explosions ) {
    explosions.slice().reverse().forEach( (explosion, index) => {
      explosions.counter -= 1;
      if( explosions.counter <= 0 ) {
        explosions.splice( index, 1 );
      }
    });
  }

  mechaAttackTarget( mecha, pirates ) {
    if( mecha.target !== null ) {
      if( mecha.distance( pirates[mecha.target] ) < 50 ) {
        pirates.splcie( mecha.target, 1 );
        mecha.target = -1;
      }
      else {
        mecha.moveTowardsTarget( pirates[mecha.target] );
      }
    }
  }

  startAttack( attacker, defenders, defenderIndex ) {
    const defender = defenders[defenderIndex];
    if( attacker.attackCountdown > 0 ) {
      attacker.attackCountdown -= 1;
    }
    else {
      this.addExplosion( this.explosions, defender );
      attacker.attackCountdown = attacker.attackCountdownMax;
      defender.armor -= attacker.attackPower;
      if( defender.armor <= 0 ) {
        defenders.splice( defenderIndex, 1 );
        if( attacker.type === 'pirate' ) {
          attacker.target = null;
        }
        if( defender.type === 'collector' ) {
          this.selectedCollector = -1;
        }
        this.forceUpdate();
      }
    }
  }

  attack( attacker, defenders, defenderIndex ) {
    if( defenders.length <= attacker.target ) {
      attacker.target = null;
      return;
    }
    const defender = defenders[defenderIndex];
    if( attacker.target !== null ) {
      if( attacker.distance( defender) <= 50 ) {
        this.startAttack( attacker, defenders, defenderIndex );
      }
      else {
        attacker.moveTowardsTarget( defender );
      }
    }
  }

  updatePopulation() {
    const population = this.colonies.reduce( (acc, curr) => {
      return acc + curr;
    });
    this.setState( { population} );
  }

  gameLoop() {
    // If title/game over screens are displayed, suspend game loop
    if( this.showTitleScreen ) {  return;  }
    this.collectors.forEach( (collector) => {
      this.collectorMineAluminum( collector );
      this.collectorMoveTowardsTarget( collector );
    });
    this.time = parseInt(((new Date()) - this.startTime) / 1000);
    this.checkForGameOver( this.time );
    // Update mecha
    this.playerMecha.forEach( (mecha) => {
      //this.mechaAttackTarget( mecha, this.pirates );
      //this.attack( mecha, this.pirates, mecha.target );
      let attackResult = mecha.attack();
      if( attackResult !== null ) {
        this.fleet.cleanupDeadTargets( [ attackResult ] );
      }
    });
    // Pirates
    this.createPirates( this.time );
    this.pirates.forEach( (pirate, index) => {
      // Find a target
      pirate.findTarget( this.collectors );
      if( pirate.leave() ) {
        this.pirates.splice( index, 1 );
        this.forceUpdate();
      }
      else if( pirate.target !== null ) {
        pirate.moveTowardsTarget( pirate.target );
        this.forceUpdate();
        const result = pirate.attack();
        if( result !== null ) {
          this.collectors.forEach( (c,i) => {
            if( c === result ) {
              this.collectors.splice( i, 1 );
              pirate.leaving = true;
            }
          })
        }
      }
    });
    // Fleet
    this.fleet.spawn( this.time, this.colonies.length, this.playerMecha );
    let attackResult = this.fleet.update( this.playerMecha );
    if( attackResult.length > 0 ) {
      attackResult.forEach( (attackedMecha) => {
        this.playerMecha.forEach( (m,i) => {
          if( m === attackedMecha ) {
            this.addExplosion( this.explosions, m );
            if( m.armor <= 0 ) {
              this.playerMecha.splice( i, 1 );
            }
          }
        });
      });
    }
    // Shuttles and explosions
    this.createShuttle( this.time );
    this.updateShuttles();
    this.updateExplosions( this.explosions );
  }

  getImagesForObject( objects, name, image, clickEvent ) {
    return objects.map( (o, index) => {
      let style = {
        left: o.x,
        top: o.y,
        width: o.width,
        height: o.height,
      }
      let img = image;
      if( name === "asteroid"  &&  o.hasOwnProperty("aluminum")  &&  o.aluminum <= 0 ) {
        img = 'images/asteroid-depleted.png';
      }
      else if( name === 'shuttle'  &&  o.hasOwnProperty("offloading")  &&  o.offloading ) {
        style.transform = "rotate(180deg)";
      }
      return <img style={style} alt={name + ' ' + index}
          key={index} className={name}
          src={img} onClick={clickEvent} />
    })
  }

  getExplosionImages( explosions) {
    return explosions.map( (explosion, index) => {
      return <Spritesheet image={'images/explosion.png'} key={index}
        widthFrame={64} heightFrame={64} steps={16} fps={12}
        className={'explosion'}
        style={{left: explosion.x, top: explosion.y, width: world.explosionSize, height: world.explosionSize}} />;
    });
  }

  getImagesForRender() {
    const asteroids = this.getImagesForObject( this.asteroids, "asteroid", "images/asteroid.png", this.asteroidClicked );
    const colonies = this.getImagesForObject( this.colonies, "colony", "images/colony.png", this.colonyClicked );
    const collectors = this.getImagesForObject( this.collectors, "collector", "images/ball.png", this.collectorClicked );
    const mecha = this.getImagesForObject( this.playerMecha, "mecha", "images/player_mecha.png", this.playerMechaClicked );
    const reticles = this.getImagesForObject( [this.state.reticle], "reticle", "images/reticule.png", null );
    const pirates = this.getImagesForObject( this.pirates, "pirate", "images/pirate.png", this.pirateClicked );
    const shuttles = this.getImagesForObject( this.shuttles, "shuttle", "images/transport.png", null );
    const fleet = this.getImagesForObject( this.fleet.getShips(), "enemy", "images/enemy_mecha.png", this.enemyMechaClicked );
    const explosions = this.getExplosionImages( this.explosions );
    const space = { backgroundImage: "url(" + bgImage + ")" };
    return { asteroids, colonies, collectors, mecha, reticles, pirates, shuttles, fleet, explosions, space };
  }

  render() {
    const images = this.getImagesForRender();
    const titleScreen = this.showTitleScreen ? <TitleScreen startGame={this.startGame} points={this.props.points} clickedOptionBGMusic={this.clickedOptionBGMusic} clickedOptionSoundFX={this.clickedOptionSoundFX} options={options} /> : [];
    return (
      <div className="Space" style={images.space}
          onClick={(e) => this.spaceClicked(e)}>
        {titleScreen}
        {images.asteroids}
        {images.colonies}
        {images.collectors}
        {images.mecha}
        {images.reticles}
        {images.pirates}
        {images.shuttles}
        {images.fleet}
        {images.explosions}
        <StatusBarStateful time={this.time} />
        <ReactAudioPlayer src="audio/the-complex-by-kevin-macleod.mp3" id="audio-player" loop={true} volume={0.3} controls />
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
  population: state.population,
  points: state.points,
  placingCollector: state.placingCollector,
  placingMecha: state.placingMecha,
  placingColony: state.placingColony
});
const mapDispatchToProps = dispatch => ({
  actionMined: amount => dispatch( actionMined( { amount: amount } ) ),
  actionAddPoints: points => dispatch( actionAddPoints( { points } ) ),
  actionAddPopulation: amount => dispatch( actionAddPopulation( { amount: amount } ) ),
  actionPlacingCollector: value => dispatch( actionPlacingCollector( value ) ),
  actionPlacingMecha: value => dispatch( actionPlacingMecha( value ) ),
  actionPlacingColony: value => dispatch( actionPlacingColony( value ) )
});
const WorldStateful = connect(mapStateToProps, mapDispatchToProps)(World);

export default App;
