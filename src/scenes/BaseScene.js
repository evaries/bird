import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  constructor(key, config) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOption = { fontSize: `${this.fontSize}px`, fill: '#CD00FF' }
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0);

    if (this.config.canGoBack) {
      this.createBackButton()
    }
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;
    menu.forEach(menuItem => {
      const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
      menuItem.textGameObject = this.add.text(...menuPosition, menuItem.text, this.fontOption).setOrigin(0.5, 1)
      lastMenuPositionY += this.lineHeight
      setupMenuEvents(menuItem);
    })
  }

  createBackButton() {
    const backButton = this.add.image(this.config.width - 50, this.config.height - 50, 'back')
      .setInteractive()
      .setScale(1.5)
      .setOrigin(0);

    backButton.on('pointerup', () => {
      this.scene.start('MenuScene')
    })
  }

}

export default BaseScene;