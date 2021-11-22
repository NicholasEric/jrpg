class PopUp extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text) {
    super(scene, x , y);
    this.scene = scene;
    this.text = text;
    this.key = 'popUp';
    this.font = 'pixel';
    
    this.createPopUp();
    this.scene.add.existing(this);
  }
  
  createPopUp() {
    this.createText();
  }

  createText() {
    this.popUpText = this.scene.add.bitmapText(-48, -64, this.font, this.text, 10);
    this.add(this.popUpText);
  }
}