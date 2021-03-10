import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
  default: 'arcade',
  arcade: {
    gravity: {y:200}
  }
  },
  scene: {
    preload,
    create,
    update
  }
}

let bird = null; 
let totalDelta = null;

// loading assets
function preload(){
  // 'this' context -> scene. with a lot of functions and props
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
}

// initialise instance
function create(){
  this.add.image(0, 0, 'sky').setOrigin(0, 0)
  bird = this.physics.add.image(config.width / 10, config.height / 2, 'bird').setOrigin(0)
  bird.body.gravity.y = 200;
}

// update frames (60 fps)
function update(time, delta){
totalDelta += delta
}

new Phaser.Game(config)