class Chest extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, chest) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.chest = chest;
    this.item = chest.item;
    this.isOpen = false;
    
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
}