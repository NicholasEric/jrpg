class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;

    this.scene.physics.world.enable(this);

    this.scene.add.existing(this);

  }
}