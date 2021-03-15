import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {

  constructor(config) {
    super('ScoreScene', {...config, canGoBack: true});
  }

  create() {
    super.create();
    this.createBestScore()
  }

  createBestScore() {
    const bestScore = localStorage.getItem('bestScore');
    this.add.text(...this.screenCenter, `Best score: ${bestScore}`, this.fontOption)
      .setOrigin(0.5);
  }


}

export default ScoreScene;