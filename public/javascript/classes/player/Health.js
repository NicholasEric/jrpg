class HealthBarContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, health) {
    super(scene, x ,y);
    this.x = x;
    this.y = y;
    this.health = health;
    this.maxHealth = 20;
    this.key = key;

    this.setSize(100,100);
    this.scene.add.existing(this);
    this.createHpGraphic();
    this.createBorder();
  }

  createBorder() {
    this.healthBarBorder = this.scene.add.image(this.x, this.y, this.key);
    this.healthBarBorder.setScale(0.7);
    this.healthBarBorder.setScrollFactor(0);
    this.healthBarBorder.setAngle(-90);
    this.add(this.healthBarBorder);

    this.junaIcon = this.scene.add.image(this.x-100, this.y-30, 'art-juna');
    this.junaIcon.setScale(.1);
    this.setScrollFactor(0);
    this.add(this.junaIcon);
  }

  createHpGraphic() {
    this.hpGraph = this.scene.add.graphics();
    this.add(this.hpGraph);
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.hpGraph.clear();
    this.hpGraph.fillStyle(0xffffff, 1);
    this.hpGraph.fillRect(this.x-110, this.y - 7, 204, 20);
    this.hpGraph.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.hpGraph.fillRect(this.x-110, this.y - 7, 204 * (this.health / this.maxHealth), 20);
  }

  updateHealth(health) {
    this.health = health;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
    this.updateHealthBar();
  }
}