class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key) {
    super(scene, x, y);
    this.scene = scene;
    this.key = key;
    this.currVelocity = 130;
    this.initialVelocity = 130;
    this.maxVelocity = 180;
    this.health = 20;
    this.frameRate = 10;
    this.inventory = [];
    this.currItem = null;
    this.playerAttacking = false;
    this.swordHit = false;
    this.readingSign = false;
    
    this.setSize(32,32);
    this.scene.physics.world.enable(this);

    this.body.setCollideWorldBounds(true);
    this.scene.add.existing(this);

    this.animsGenerated = false;
    this.createAnims();

    this.scene.cameras.main.startFollow(this);

    this.player = new Player(this.scene, 0, 0, key);
    this.add(this.player);

    this.staminaBar = new StaminaContainer(this.scene, 50, 131, 'healthbar', 300);
    this.healthBar = new HealthBarContainer(this.scene, 73, 140, 'healthbar', 20);

    this.weapon = this.scene.add.image(15, 0, 'sword');
    this.weapon.dmg = 1;
    this.weapon.setScale(.3);
    this.scene.add.existing(this.weapon);
    this.scene.physics.world.enable(this.weapon);
    this.add(this.weapon);
    this.weapon.alpha = 0;
  }
  
  createAnims() {
    this.scene.anims.create({
      key: 'junaWalkS',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 0, end: 3 }),
      frameRate: this.frameRate
    });

    this.scene.anims.create({
      key: 'junaWalkNE',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 4, end: 7 }),
      frameRate: this.frameRate
    });

    this.scene.anims.create({
      key: 'junaWalkE',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 8, end: 11 }),
      frameRate: this.frameRate
    });

    this.scene.anims.create({
      key: 'junaWalkSW',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 12, end: 15 }),
      frameRate: this.frameRate
    });

    this.scene.anims.create({
      key: 'junaWalkN',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 16, end: 19 }),
      frameRate: this.frameRate
    });

    this.animsGenerated = true;
  }

  update(cursors) {
    if (this.animsGenerated) {

      if (cursors.shift.isDown) {
        if (this.staminaBar.stamina > 0) {
          this.currVelocity = this.maxVelocity;
          this.staminaBar.stamina--;
          this.player.anims.frameRate = 60;
        } else {
          this.currVelocity = this.initialVelocity;
          this.staminaBar.stamina = 0;
          this.player.anims.frameRate = 10;
        }
      } else if (this.staminaBar.stamina <= this.staminaBar.maxStamina) {
        this.currVelocity = this.initialVelocity;
        this.staminaBar.stamina++;
        this.player.anims.frameRate = 10;
      } else {
        this.staminaBar.stamina = this.staminaBar.maxStamina;
        this.player.anims.frameRate = 10;
      }
      this.staminaBar.updateStaminaBar();

      if (cursors.left.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A))) {
        this.weapon.flipX = false;
        this.body.setVelocityX(-this.currVelocity);
        if (cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W))) {
          this.player.flipX = true;
          this.weapon.flipY = false;
          this.body.setVelocityY(-this.currVelocity);
          this.player.anims.play('junaWalkNE', true);
          this.weapon.setPosition(-15, -15);
        } else if (cursors.down.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))) {
          this.player.flipX = false;
          this.weapon.flipY = true;
          this.body.setVelocityY(this.currVelocity);
          this.player.anims.play('junaWalkSW', true);
          this.weapon.setPosition(-15, 15);
        } else {
          this.player.flipX = true;
          this.weapon.flipY = false;
          this.body.setVelocityY(0);
          this.player.anims.play('junaWalkE', true);
          this.weapon.setPosition(-15, 0);
        }  
      } else if (cursors.right.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D))) {
        this.weapon.flipX = true;
        this.body.setVelocityX(this.currVelocity);
        if (cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W))) {
          this.player.flipX = false;
          this.weapon.flipY = false;
          this.body.setVelocityY(-this.currVelocity);
          this.player.anims.play('junaWalkNE', true);
          this.weapon.setPosition(15, -15);
        } else if (cursors.down.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))) {
          this.player.flipX = true;
          this.weapon.flipY = true;
          this.body.setVelocityY(this.currVelocity);
          this.player.anims.play('junaWalkSW', true);
          this.weapon.setPosition(15, 15);
        } else {
          this.player.flipX = false;
          this.weapon.flipY = false;
          this.body.setVelocityY(0);
          this.player.anims.play('junaWalkE', true);
          this.weapon.setPosition(15, 0);
        }
      } else {
        this.body.setVelocityX(0);
        if (cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W))) {
          this.body.setVelocityY(-this.currVelocity);
          this.player.anims.play('junaWalkN', true);
          this.weapon.setPosition(0, -15);
        } else if (cursors.down.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))) {
          this.body.setVelocityY(this.currVelocity);
          this.player.anims.play('junaWalkS', true);
          this.weapon.setPosition(0, 15);
        } else {
          this.body.setVelocityY(0);
          this.weapon.setPosition(0, 0);
        }
      }
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.playerAttacking) {
      this.weapon.alpha = 1;
      this.playerAttacking = true;
      this.scene.time.delayedCall(150, () => {
        this.weapon.alpha = 0;
        this.playerAttacking = false;
        this.swordHit = false;
      }, [], this);
    }

    if (this.playerAttacking) {
      if (this.weapon.flipX) {
        this.weapon.angle += 10;
      } else {
        this.weapon.angle -= 10;
      }
    }

    this.healthBar.updateHealthBar();
  }
}