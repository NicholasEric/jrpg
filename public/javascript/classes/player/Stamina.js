class StaminaContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, stamina) {
    super(scene, x ,y);
    this.x = x;
    this.y = y;
    this.stamina = stamina;
    this.maxStamina = 300;
    this.key = key;

    this.setSize(100,100);
    this.scene.add.existing(this);
    this.createStaminaGraphic();
    this.createBorder();
  }

  createBorder() {
    this.staminaBarBorder = this.scene.add.image(this.x, this.y, this.key);
    this.staminaBarBorder.setScale(0.3);
    this.staminaBarBorder.setScrollFactor(0);
    this.staminaBarBorder.setAngle(-90);
    this.add(this.staminaBarBorder);
  }

  createStaminaGraphic() {
    this.staminaGraph = this.scene.add.graphics();
    this.staminaGraph.setScrollFactor(0);
    this.add(this.staminaGraph);
    this.updateStaminaBar();
  }

  updateStaminaBar() {
    this.staminaGraph.clear();
    this.staminaGraph.fillStyle(0xffffff, 1);
    this.staminaGraph.fillRect(this.x-45, this.y - 4, 85, 10);
    this.staminaGraph.fillGradientStyle(0x055a8c, 0xbcd9ea, 4);
    this.staminaGraph.fillRect(this.x-45, this.y - 4, 85 * (this.stamina / this.maxStamina), 10);
  }

  updateStamina(stamina) {
    this.stamina = stamina;
    this.updateStaminaBar();
  }
}