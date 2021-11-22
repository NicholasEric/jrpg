class BedScene extends Phaser.Scene {
  constructor() { super('Bed'); }
  
  create() {
    this.cameras.main.fadeOut();
    this.cameras.main.fadeIn(1500);

    this.createMap(); 
    this.parseMapData();
    this.createPlayer();
    this.createLevelDoor();
    this.createSigns();
    this.createCollider();
  }

  createMap() {
    this.map = this.make.tilemap({key: 'bedroom'});
    this.tiles = this.map.addTilesetImage("[Base]BaseChip_pipo", 'chipTileset', 32, 32, 0, 0);

    this.bgLayer = this.map.createLayer('bg', this.tiles, 0, 0);
    this.wallLayer = this.map.createLayer('wall', this.tiles, 0, 0);
    this.floorLayer = this.map.createLayer('floor', this.tiles, 0, 0);
    this.itemLayer = this.map.createLayer('item', this.tiles, 0, 0);
    this.itemBlockedLayer = this.map.createLayer('itemBlocked', this.tiles, 0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
  }

  parseMapData() {
    this.levelDoorModel = this.map.objects[0].objects[0];
    this.playerModel = this.map.objects[2].objects[0];
    this.signModel = this.map.objects[1].objects;
  }

  createPlayer() {
    this.player = new PlayerContainer(
      this, 
      this.playerModel.x, 
      this.playerModel.y,
      'junaSpritesheet'
    );
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createCollider() {
    this.bgLayer.setCollisionByExclusion([-1]);
    this.wallLayer.setCollisionByExclusion([-1]);
    this.itemBlockedLayer.setCollisionByExclusion([-1]);

    this.physics.add.collider(this.player, this.bgLayer);
    this.physics.add.collider(this.player, this.blockedLayer);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.itemBlockedLayer);

    this.physics.add.overlap(this.player, this.levelDoor, () => {
      if (!this.doorInfo) {this.createDoorInfo(this.levelDoor, 'E to enter');}
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        this.cameras.main.fadeOut(600);
        this.time.delayedCall(600, () => {
          this.scene.remove('Cut');
          this.time.delayedCall(100, () => { 
            this.scene.add('Cut', CutScene, true);
          })
        });
      }
    });

    this.signs
      .getChildren()
      .forEach(obj => {
        this.physics.add.overlap(this.player, obj, () => {
          if (!obj.signInfo) {this.createSignInfo(obj);}
          if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R))) {
            if (!this.player.readingSign) {
              this.player.readingSign = true;
              obj.showText();
            } else {
              this.player.readingSign = false;
              obj.delText();
            }
          }
        });
      });
  }

  createLevelDoor() {
    this.levelDoor = new Door(this, this.levelDoorModel.x, this.levelDoorModel.y, this.levelDoorModel); 
  }

  createSigns() {
    this.signs = this.physics.add.staticGroup();
    this.signModel.forEach(signModel => {
      const signObj = new Sign(
        this,
        signModel.x,
        signModel.y,
        'chipItemSheet',
        {text: signModel.properties[0].value}
      );
      this.signs.add(signObj);
    })
  }

  createDoorInfo(obj, text) {
    this.doorInfo = new PopUp(this, obj.x, obj.y, text);
  }

  createSignInfo(obj) {
    obj.signInfo = new PopUp(this, obj.x, obj.y, 'R to read');
  }

  update() {
    if (this.player) {
      if (!this.player.readingSign) {
        this.player.update(this.cursors);
      } else {
        this.player.body.setVelocity(0);
      }
    }

    if (this.doorInfo && !this.levelDoor.body.touching.none) {
      this.doorInfo.destroy();
      delete this.doorInfo;
    } 

    this.signs
      .getChildren()
      .forEach(obj => {
        if (obj.signInfo && !obj.body.touching.none) {
          obj.signInfo.destroy();
          delete obj.signInfo;
        }  
      });
  }
}