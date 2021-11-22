class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, type, callback) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.callbacktype = callback[0];
    this.callbackevent = callback[1];
    this.key = key;
    this.type = type;
    this.font = 'pixel';
    
    switch (this.key) {
      case 'inventory':
        this.scale = .5;
        break;
      case 'arrow':
        this.scale = .4;
        break;
      case 'button':
        this.scale = 1.3;
        break;
    }

    this.createBoxImage();
    this.createInputs();

    switch(this.type) {
      case 'inventory':
        this.setScrollFactor(0);
        break;
      case 'leftArrow':
        this.setAngle(90);
        break;
      case 'rightArrow':
        this.setAngle(270);
        break;
      case 'start':
        this.createText('start');
        break;
    }

    this.scene.add.existing(this);
  }

  createBoxImage() {
    this.buttonBox = this.scene.add.image(0, 0, this.key);
    this.buttonBox.setScale(this.scale);
    
    this.hoverTween = this.scene.tweens.add({
      targets: this.buttonBox,
      alpha: 0.7,
      duration: 200,
      paused: true
    });
    
    this.add(this.buttonBox);
  }

  createInputs() {
    this.setSize(this.buttonBox.displayWidth, this.buttonBox.displayHeight);
    this.setInteractive();
    this.on('pointerover', () => {
      this.hoverTween.play();
    });

    this.on('pointerout', () => {
      this.hoverTween.stop();
      this.buttonBox.alpha = 1;
    });

    this.on(this.callbacktype, () => {
      this.callbackevent();
    });
  }

  createText(text) {
    this.text = this.scene.add.bitmapText(0, 0, this.font, text, 20);
    this.text.depth = 2;

    Phaser.Display.Align.In.Center(this.text, this);
  }
}