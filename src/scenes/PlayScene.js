import Phaser from 'phaser';
import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {

  constructor(config) {
    super('PlayScene', config);

    this.bird = null;
    this.pipes = null;

    this.isPaused = false;
    this.pipeHorizontalDistance = 0;
    this.pipeOpenedRange = [150, 250];
    this.pipeBetweenRange = [500, 550];
    this.flapVelocity = 300;
    this.score = 0;
    this.scoreText = '';

    this.currentDifficulty = '';
    this.difficulties = {
      'easy': {
        pipeOpenedRange: [150, 250],
        pipeBetweenRange: [500, 550]
      },
      'normal': {
        pipeOpenedRange: [130, 220],
        pipeBetweenRange: [450, 500]
      },
      'hard': {
        pipeOpenedRange: [120, 180],
        pipeBetweenRange: [350, 400]
      },

    }
  }

  create() {
    this.currentDifficulty = 'easy';
    super.create()
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
    this.bird.body.gravity.y = 500;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe')
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe')
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe)
    }
    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: '32px', fill: '#000' })
    this.add.text(16, 60, `Best score: ${bestScore || 0}`, { fontSize: '19px', fill: '#000' })
  }

  increaceScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score)
    }
  }

  createPause() {
    const pauseButton = this.add.image(this.config.width - 50, this.config.height - 50, 'pause')
      .setInteractive()
      .setScale(2)
      .setOrigin(0);

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  listenToEvents() {
    if (this.pauseEvent) return;

    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(...this.screenCenter, `Fly in: ${this.initialTime}`, this.fontOption)
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText(`Fly in: ${this.initialTime}`);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty]
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeOpenedRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeBetweenRange);
    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance
  }

  getRightMostPipe() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    })
    return rightMostX;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaceScore();
          this.increaceDificulty();
          this.saveBestScore();
        }
      }
    })
  }

  increaceDificulty() {
    if (this.score === 2) {
      this.currentDifficulty = 'normal'
    }
    if (this.score === 5) {
      this.currentDifficulty = 'hard'
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xfc4103);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart()
      },
      loop: false
    })
  }

  flap() {
    if (this.isPaused) return;
    this.bird.body.velocity.y = -this.flapVelocity;
  }

}

export default PlayScene;