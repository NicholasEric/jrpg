class Sign extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, sign) {
    super(scene, x, y, key, 235);
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.sign = sign;
    this.text = sign.text;
    this.font = 'pixel';
       
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  showText() {
    this.textShown = true;
    let slicedText = paragraphSlicer(this.text, 19);

    this.signBoard = this.scene.add.image(this.x, this.y+60, 'sign');
    this.signBoard.setScale(.04);
    this.signBoard.depth = 1;

    this.signBoardText = this.scene.add.bitmapText(this.x, this.y, this.font, slicedText, 10);
    this.signBoardText.depth = 2;
    Phaser.Display.Align.In.Center(this.signBoardText, this.signBoard, 0, -80);
  }

  delText() {
    this.signBoard.destroy();
    this.signBoardText.destroy();
  }
}