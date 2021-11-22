class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame, monster) {
    super(scene, x, y, key, frame);
    this.startX = monster.x;
    this.startY = monster.y;
    this.type = monster.type;
    this.isAttacking = false;
    this.hitPlayer = false;
    this.isDead = false;

    this.scene.physics.world.enable(this);

    this.body.setCollideWorldBounds(true);
    this.scene.add.existing(this);

    switch(this.type) {
      case 'zombie':
        this.health = 5;
        this.maxHealth = 5;
        this.dmg = 1;
        this.frameRate = 8;
        this.atkFrame = 6;
        this.respawnTime = 15000;
        this.deathAnimTime = 2000;
        this.setScale(1.3);
        this.scene.anims.create({
          key: 'zombieWalk',
          frames: this.scene.anims.generateFrameNumbers('zombieWalk', { start: 0, end: 6 }),
          frameRate: this.frameRate
        });
        this.scene.anims.create({
          key: 'zombieAtk',
          frames: this.scene.anims.generateFrameNumbers('zombieAtk', { start: 0, end: 12 }),
          frameRate: this.frameRate
        });
        this.scene.anims.create({
          key: 'zombieDeath',
          frames: this.scene.anims.generateFrameNumbers('zombieDeath', { start: 0, end: 2 }),
          frameRate: 1/4*this.frameRate
        });
        break;
      case 'golem':
        this.health = 10;
        this.maxHealth = 10;
        this.dmg = 2;
        this.frameRate = 6;
        this.atkFrame = 6;
        this.respawnTime = 15000;
        this.deathAnimTime = 2000;
        this.setScale(1.1);
        this.scene.anims.create({
          key: 'arisWalk',
          frames: this.scene.anims.generateFrameNumbers('arisWalk', { start: 0, end: 17 }),
          frameRate: 2*this.frameRate
        });
        this.scene.anims.create({
          key: 'arisAtk',
          frames: this.scene.anims.generateFrameNumbers('arisAtk', { start: 0, end: 7 }),
          frameRate: 4/3*this.frameRate
        });
        this.scene.anims.create({
          key: 'arisDeath',
          frames: this.scene.anims.generateFrameNumbers('arisDeath', { start: 0, end: 5 }),
          frameRate: 1/2*this.frameRate
        });
        break;
    }

    this.createHealthBar();
  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x-26, this.y - 25 , 50, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(this.x-26, this.y - 25, 50 * (this.health / this.maxHealth), 5);
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
    this.updateHealthBar();
    this.healthBar.setVisible(true);
  }

  makeInactive() {
    let deadX = this.x;
    let deadY = this.y;
    this.isDead = true;
    switch(this.type) {
      case 'zombie':
        this.anims.play('zombieDeath', true)
        break;
      case 'golem':
        this.anims.play('arisDeath', true)
        break;
    }
    this.body.checkCollision.none = true;
    this.healthBar.clear();
    this.healthBar.setVisible(false);
    this.scene.time.addEvent({
      delay: this.deathAnimTime/100,
      callback: () => {
        this.x = deadX;
        this.y = deadY;
      },
      callbackScope: this,
      repeat: 100
    });
    this.scene.time.delayedCall(this.deathAnimTime, () => {
      this.setActive(false);
      this.setVisible(false);
      this.isDead = false;
    }, );
  }

  update() {
    if (!this.isDead) {
      this.chasing = false;

      let xDist = Math.round(this.scene.player.x) - Math.round(this.x);
      switch(this.type) {
        case 'zombie':
          if (Math.abs(Math.round(this.scene.player.y) - Math.round(this.y)) < 300) {
            if ((xDist > 70) && (xDist <= 300)) {
              this.flipX = false;
              this.velocity = 50;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.anims.play('zombieWalk', true);
              this.chasing = true;
            } else if ((xDist < -70) && (xDist >= -300)) {
              this.flipX = true;
              this.velocity = 50;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.anims.play('zombieWalk', true);
              this.chasing = true;
            } else if ((xDist >= -70) && (xDist < 0)) {
              this.flipX = true;
              this.anims.play('zombieAtk', true);
              this.velocity = 10;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.chasing = true;
              if (this.frame.name == this.atkFrame && !this.isAttacking) {
                this.isAttacking = true;
                this.scene.time.delayedCall(150, () => {
                  this.hitPlayer = false;
                  this.isAttacking = false
                });
              }
            } else if ((xDist <= 70) && (xDist > 0)) {
              this.flipX = false;
              this.anims.play('zombieAtk', true);
              this.velocity = 10;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.chasing = true;
              if (this.frame.name == this.atkFrame && !this.isAttacking) {
                this.isAttacking = true;
                this.scene.time.delayedCall(150, () => {
                  this.hitPlayer = false;
                  this.isAttacking = false
                });
              }
            }
          }

          if (!this.chasing) {
            if (this.velocity > 0) {
              this.velocity = 30;
              this.scene.physics.moveTo(this, this.startX, this.startY);
            }
          }
          break;
        case 'golem':
          if (Math.abs(Math.round(this.scene.player.y) - Math.round(this.y)) < 300) {
            if ((xDist > 100) && (xDist <= 300)) {
              this.flipX = false;
              this.velocity = 40;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.anims.play('arisWalk', true);
              this.chasing = true;
            } else if ((xDist < -100) && (xDist >= -300)) {
              this.flipX = true;
              this.velocity = 40;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.anims.play('arisWalk', true);
              this.chasing = true;
            } else if ((xDist >= -100) && (xDist < 0)) {
              this.flipX = true;
              this.anims.play('arisAtk', true);
              this.velocity = 20;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.chasing = true;
              if (this.frame.name == this.atkFrame && !this.isAttacking) {
                this.isAttacking = true;
                this.scene.time.delayedCall(150, () => {
                  this.hitPlayer = false;
                  this.isAttacking = false
                });
              }
            } else if ((xDist <= 100) && (xDist > 0)) {
              this.flipX = false;
              this.anims.play('arisAtk', true);
              this.velocity = 20;
              this.scene.physics.moveToObject(this, this.scene.player);
              this.chasing = true;
              if (this.frame.name == this.atkFrame && !this.isAttacking) {
                this.isAttacking = true;
                this.scene.time.delayedCall(150, () => {
                  this.hitPlayer = false;
                  this.isAttacking = false
                });
              }
            }
          }

          if (!this.chasing) {
            if (this.velocity > 0) {
              this.velocity = 40;
              this.scene.physics.moveTo(this, this.startX, this.startY);
            }
          }
          break;
      }
      this.updateHealthBar();
    }
  }
}