import BaseScene from './BaseScene';

class PauseScene extends BaseScene {

  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      { scene: 'PlayScene', text: 'Continue' },
      { scene: 'MenuScene', text: 'Exit' },
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGameObject = menuItem.textGameObject;
    textGameObject.setInteractive();

    textGameObject.on('pointerover', () => textGameObject.setStyle({ fill: '#fff' }));
    textGameObject.on('pointerout', () => textGameObject.setStyle({ fill: '#CD00FF' }));

    textGameObject.on('pointerup', () => {
      if (menuItem.scene) {
        switch (menuItem.text) {
          case 'Continue':
            this.scene.stop();
            this.scene.resume(menuItem.scene)
            break;
          case 'Exit':
            this.scene.stop('PlayScene');
            this.scene.start(menuItem.scene)
            break;
        }
      }
    });

  }

}

export default PauseScene