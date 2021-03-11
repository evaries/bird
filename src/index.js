import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const gravity = 600;
const flapVelocity = 300;
const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };
const offsetFromBorder = 20;
const pipesToRender = 4;

let bird = null;
let pipes = null;

const pipeOpenedRange = [100, 200];
const pipeBetweenRange = [300, 400];

// loading assets
function preload() {
  // 'this' context -> scene. with a lot of functions and props
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
  this.load.image('pipe', 'assets/pipe.png')
}

// initialise instance
function create() {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = gravity;

  // set all pipes in one group
  pipes = this.physics.add.group()

  for (let i = 0; i < pipesToRender; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe)
  }

  pipes.setVelocityX(-200)

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

// update runs every frames
function update() {
  if (bird.body.y < 0 - bird.body.height || bird.body.y > config.height) {
    restartBirdPosition();
  }

  recyclePipe();
}

function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipe()

  let pipeOpenedDistance = Phaser.Math.Between(...pipeOpenedRange);
  let pipeVerticalPosition = Phaser.Math.Between(0 + offsetFromBorder, config.height - offsetFromBorder - pipeOpenedDistance);
  let pipeBetweenDistance = Phaser.Math.Between(...pipeBetweenRange);

  uPipe.x = rightMostX + pipeBetweenDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeOpenedDistance;
}

function getRightMostPipe() {
  let rightMostX = 0;

  //get each pipe from group to array and find most right pipe
  pipes.getChildren().forEach(pipe => rightMostX = Math.max(pipe.x, rightMostX))

  return rightMostX;
}

function recyclePipe() {
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  })
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity
}

new Phaser.Game(config)