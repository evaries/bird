import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
  default: 'arcade'
  },
  scene: {
    preload,
    create
  }
}

// loading assets
function preload(){
  // 'this' context -> scene with a lot of functions and props
  this.load.image('sky', 'assets/sky.png')
}

// initialise instance
function create(){
  this.add.image(0, 0, 'sky').setOrigin(0, 0)

}

new Phaser.Game(config)