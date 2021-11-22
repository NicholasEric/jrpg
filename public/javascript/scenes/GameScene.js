class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');    
  }
    
  create() {
    this.isCreated = true;
    this.cameras.main.fadeOut();
    this.cameras.main.fadeIn(200);

    this.createMap();

    this.createGroups();

    this.createGameManager();

    this.createInput();

    this.createPlayer();

    this.createCollider();

    this.createInventory();
  }

  createGameManager() {
    this.events.on('createDoor', door => {
      this.createDoor(door);
    });

    this.events.on('createChest', chest => {
      this.createChest(chest);
    });

    this.events.on('createMonster', monster => {
      this.createMonster(monster);
    });

    this.events.on('createSign', sign => {
      this.createSign(sign);
    });

    this.events.on('jumpToTarget', door => {
      let targetDoor = this.doors
        .getChildren()
        .filter((obj)=> {
          return door.id === obj.doorData.target;
        });
      this.player.x = targetDoor.x;
      this.player.y = targetDoor.y;
    });

    this.events.on('updatePlayerHealth', health => {
      this.player.healthBar.updateHealth(health);
    });

    this.events.on('updatePlayerStamina', stamina => {
      this.player.staminaBar.updateStamina(stamina);
    });

    this.events.on('monsterAttack', dmg => {
      this.player.health -= dmg;
      this.cameras.main.shake(300, 0.005);
      if (this.player.health === 5) {
        this.player.healthBar.junaIcon.setTint(0xff0000);
      }
      if (this.player.health <= 0) {
        this.events.emit('respawnPlayer');
      } 
      this.events.emit('updatePlayerHealth', this.player.health);
    });

    this.events.on('respawnPlayer', () => {
      if (playingCutScene === 3) {
        this.cameras.main.fadeOut();
        this.cameras.main.fadeIn(3000);
        this.player.x = this.playerModel.x;
        this.player.y = this.playerModel.y;
        this.player.health = 20;
        this.player.healthBar.junaIcon.setTint(0xffffff);
        this.doors
          .getChildren()
          .forEach(obj => {
            if (obj.doorInfo) {
              obj.doorInfo.destroy();
              delete obj.doorInfo;
            }  
          });
      } else {
        this.cameras.main.flash();
        this.cameras.main.fadeOut(1);
        this.monsters.getChildren().forEach(monster => {
          monster.setActive(false);
          monster.body.checkCollision.none = true;
        });
        this.time.delayedCall(2000, () => {
          this.cameras.main.fadeIn(2000);   
          this.backgroundImg = this.add.image(320, 160, 'chapterBg');
          this.backgroundImg.depth = 3;
          this.backgroundImg.setScrollFactor(0);
          this.time.delayedCall(2000, () => {
            this.finalStr = 'Dead End';
            this.finalText = this.add.bitmapText(320, 160, 'pixel', "", 16);
            this.finalText.depth = 4;
            this.finalText.setScrollFactor(0);
            Phaser.Display.Align.In.Center(this.finalText, this.backgroundImg);
            this.finalTextIterator = 0;
            this.finalTextLoop = setInterval(this.setIntervalFinalText.bind(this), 100, ['Dead End']);

            this.time.delayedCall(this.finalStr.length * 100 + 1000, () => {
              this.cameras.main.fadeOut(2000);
              this.time.delayedCall(2000, () => {
                this.scene.remove('Game');
                setTimeout(() => {
                  game.scene.add('Game', GameScene, true);
                }, 2000);
              }, [], this);
            }, [] , this);
          });
        }, [], this);
      }
    });

    this.events.on('updateMonsterHealth', (monster, health) => {
      monster.updateHealth(health);
    });

    this.events.on('monsterAttacked', (monster, dmg) => {
      monster.health -= dmg;
      if (monster.health <= 0) {
        this.events.emit('respawnMonsters', monster);
      }
      this.events.emit('updateMonsterHealth', monster, monster.health);
    });

    this.events.on('respawnMonsters', monster => {
      monster.makeInactive();
      this.time.delayedCall(monster.respawnTime, () => {
        monster.makeActive();
        monster.health = monster.maxHealth;
        monster.x = monster.startX;
        monster.y = monster.startY;
      });
    });

    this.events.on('toArena1', (newCoor, obj) => {
      obj.isOpened = true;
      this.playerModel.x = newCoor.x;
      this.playerModel.y = newCoor.y;
      this.cameras.main.fadeOut(1000);
      this.scene.remove('Cut');
      this.time.delayedCall(3000, () => {
        this.player.x = newCoor.x;
        this.player.y = newCoor.y;
        this.scene.sleep('Game');
        this.scene.add('Cut', CutScene, true); 
      });
    });

    this.events.on('backFromArena1', (newCoor, obj) => {
      obj.isOpened = true;
      this.cameras.main.fadeOut(1000);
      this.scene.remove('Cut');
      this.time.delayedCall(3000, () => {
        this.player.x = newCoor.x;
        this.player.y = newCoor.y;
        this.scene.sleep('Game');
        this.scene.add('Cut', CutScene, true); 
      });
    });

    this.events.on('returnedFromArena1', () => {
      this.cameras.main.fadeIn(2000);
      this.player.inventory.push(['levelKey', '']);
      this.monsters.getChildren().forEach(monster => {
        monster.body.checkCollision.none = true;
        monster.setActive(false);
        monster.setVisible(false);
        monster.healthBar.setVisible(false);
      });
    });

    this.events.on('toChap2', () => {
      this.cameras.main.fadeOut(2000);
      this.time.delayedCall(3000, () => {
        this.cameras.main.fadeIn(2000);   
        this.backgroundImg = this.add.image(320, 160, 'chapterBg');
        this.backgroundImg.depth = 3;
        this.backgroundImg.setScrollFactor(0);
        this.time.delayedCall(3000, () => {
          this.finalStr = 'Chapter 1 End';
          this.finalText = this.add.bitmapText(320, 160, 'pixel', "", 16);
          this.finalText.depth = 4;
          this.finalText.setScrollFactor(0);
          Phaser.Display.Align.In.Center(this.finalText, this.backgroundImg);
          this.finalTextIterator = 0;
          this.finalTextLoop = setInterval(this.setIntervalFinalText.bind(this), 100, ['Chapter 1 End']);

          this.time.delayedCall(this.finalStr.length * 100 + 1000, () => {
            this.cameras.main.fadeOut(2000);
            this.time.delayedCall(2000, () => {
              this.scene.start('Title');
              this.scene.remove('Cut');
              this.scene.remove('Bed');
              this.scene.remove('Inventory');
              this.scene.remove('Game');
              playingCutScene = 0;
              setTimeout(() => {
                game.scene.add('Game', GameScene, false);
                game.scene.add('Cut', CutScene, false);
                game.scene.add('Invetory', InventoryScene, false);
                game.scene.add('Bed', BedScene, false);
              }, 2000);
            }, [], this);
          }, [] , this);
        });
      }, [], this);
    }, [], this);

    

    this.gameManager = new GameManager(this, this.map.objects);
  }

  setIntervalFinalText(str) {
    this.finalText.text += str[0][this.finalTextIterator];
    this.finalTextIterator++;
    if (str[0].length <= this.finalTextIterator) clearInterval(this.finalTextLoop);
  }

  createPlayer() {
    this.player = new PlayerContainer(
      this, 
      this.playerModel.x, 
      this.playerModel.y,
      this.playerModel.img
    );
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMap() {
    this.map = this.make.tilemap({key: 'level1'});
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

  createCollider() {
    this.bgLayer.setCollisionByExclusion([-1]);
    this.wallLayer.setCollisionByExclusion([-1]);
    this.itemBlockedLayer.setCollisionByExclusion([-1]);

    this.physics.add.collider(this.player, this.bgLayer);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.itemBlockedLayer);

    this.physics.add.collider(this.monsters, this.bgLayer);
    this.physics.add.collider(this.monsters, this.itemBlockedLayer);
    this.physics.add.collider(this.monsters, this.wallLayer);

    this.physics.add.overlap(this.player, this.monsters, this.monsterHit, null, this);
    this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, null, this);

    this.doors
      .getChildren()
      .filter(obj => obj.doorData.type === 'door')
      .forEach(obj => {
        this.physics.add.overlap(this.player, obj, () => {
          let newCoor = this.doors.getChildren().filter(targetObj => targetObj.doorData.id === obj.target)[0];
          if (!obj.doorInfo) {this.createDoorInfo(obj, 'E to enter');}
          if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
            this.cameras.main.fadeOut(600);
            this.cameras.main.fadeIn(600);
            this.player.x = newCoor.x;
            this.player.y = newCoor.y;
          }
        });
      });
      
    this.doors
      .getChildren()
      .filter(obj => obj.doorData.type === 'lockedDoor')
      .forEach(obj => {
        this.physics.add.overlap(this.player, obj, () => {
          if (!obj.doorInfo) {
            if (this.player.inventory.findIndex(item => (item[0] === 'key') && (item[1] === obj.doorData.target)) === -1) {
              this.createDoorInfo(obj, `Missing key ${obj.doorData.target}`);
            } else {
              obj.doorData.type = 'door';
              let newDoor = this.createDoor(obj.doorData);
              this.physics.add.overlap(this.player, newDoor, () => {
                let newCoor = this.doors.getChildren().filter(targetObj => targetObj.doorData.id === newDoor.doorData.target)[0];
                if (!newDoor.doorInfo) {this.createDoorInfo(newDoor, 'E to enter');}
                if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
                  this.player.inventory = this.player.inventory.filter(item => (item[0] !== 'key') || (item[1] !== obj.doorData.target));
                  this.player.currItem = null;
                  this.cameras.main.fadeOut(600);
                  this.cameras.main.fadeIn(600);
                  this.player.x = newCoor.x;
                  this.player.y = newCoor.y;
                }
              });
              obj.body.checkCollision.none = true;
            }
          }
        });
      });

    this.doors
      .getChildren()
      .filter(obj => obj.doorData.type === 'scriptureDoor')
      .forEach(obj => {
        this.physics.add.overlap(this.player, obj, () => {
          if (!obj.doorInfo) {
            let scriptureInventory = this.player.inventory
              .filter(item => item[0] === 'scripture')
              .map(item => item[1]);
            if (obj.requirements.every(scriptureNum => scriptureInventory.includes(scriptureNum))) {
              obj.doorData.type = 'door';
              let newDoor = this.createDoor(obj.doorData);
              this.physics.add.overlap(this.player, newDoor, () => {
                let newCoor = this.doors.getChildren().filter(targetObj => targetObj.doorData.id === newDoor.doorData.target)[0];
                if (!newDoor.doorInfo) {this.createDoorInfo(newDoor, 'E to enter');}
                if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
                  this.player.inventory = this.player.inventory.filter(item => (item[0] !== 'scripture') || !(obj.requirements.includes(item[1])));
                  if (!obj.isOpened) {
                    this.events.emit(obj.eventCallback, newCoor, obj);
                    this.player.currItem = null;
                  } else {
                    this.cameras.main.fadeOut(600);
                    this.cameras.main.fadeIn(600);
                    this.player.x = newCoor.x;
                    this.player.y = newCoor.y;
                  }         
                }
              });
              obj.body.checkCollision.none = true;
            } else {
              let missingScriptures = obj.requirements.filter(scriptureNum => !(scriptureInventory.includes(scriptureNum)));
              this.createDoorInfo(obj, `Missing Scripture ${missingScriptures.join('-')}`);
            }
          }
        });
      });
    
    this.doors
      .getChildren()
      .filter(obj => obj.doorData.type === 'levelDoor')
      .forEach(obj => {
        this.physics.add.overlap(this.player, obj, () => {
          if (!obj.doorInfo) {
            if (this.player.inventory.findIndex(item => (item[0] === 'levelKey')) !== -1) {
              this.createDoorInfo(obj, `E to enter`);
              if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
                this.events.emit(obj.doorData.eventCallback);
              }
            } else {
              this.createDoorInfo(obj, `Door is locked`); 
            }
          }              
        });
      });

    this.chests
      .getChildren()
      .forEach(obj => {
        this.physics.add.overlap(this.player, obj, () => {
          if (obj.item[0] === 'key' || obj.item[0] === 'scripture') {
            if (!obj.chestInfo) {this.createChestInfo(obj);}
            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)) && !obj.isOpen) {
              obj.isOpen = true;
              this.player.inventory.push(obj.item);
              obj.setTexture('chipItemSheet',869);
            }
          } else if (obj.item[0] === 'potion') {
            this.player.health += parseInt(obj.item[1]);
            obj.body.checkCollision.none = true;
            obj.destroy();
            this.events.emit('updatePlayerHealth', this.player.health);
          }
          
        });
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

  createDoorInfo(obj, text) {
    obj.doorInfo = new PopUp(this, obj.x, obj.y, text);
  }

  createChestInfo(obj) {
    if (!obj.isOpen) {
      obj.chestInfo = new PopUp(this, obj.x, obj.y, 'O to open');
    } else {
      obj.chestInfo = new PopUp(this, obj.x, obj.y, 'Chest is empty')
    }
  }

  createSignInfo(obj) {
    obj.signInfo = new PopUp(this, obj.x, obj.y, 'R to read');
  }

  createGroups() {
    this.doors = this.physics.add.staticGroup();
    this.chests = this.physics.add.staticGroup();
    this.monsters = this.physics.add.group();
    this.monsters.runChildUpdate = true;
    this.signs = this.physics.add.staticGroup();
  }

  createDoor(door) {
    const doorObj = new Door(
      this,
      door.x,
      door.y,
      door
    );
    this.doors.add(doorObj);
    return doorObj;
  }

  createChest(chest) {
    let frame = 0;
    switch(chest.item[0]) {
      case 'key':
      case 'scripture':
        frame = 861;
        break;
      case 'potion':
        frame = 665;
        break;
    }
    const chestObj = new Chest(
      this,
      chest.x,
      chest.y,
      'chipItemSheet',
      frame,
      chest
    );
    this.chests.add(chestObj);
  }

  createMonster(monster) {
    let monsterObj = this.monsters.getFirstDead();
    if (!monsterObj) {
      let startingKey = [];
      switch(monster.type){
        case 'zombie':
          startingKey[0] = 'zombieWalk';
          startingKey[1] = 0;
          break;
        case 'golem':
          startingKey[0] = 'arisWalk';
          startingKey[1] = 0;
          break;
      }
      monsterObj = new Monster(
        this,
        monster.x,
        monster.y,
        startingKey[0],
        startingKey[1],
        monster
      );
      this.monsters.add(monsterObj);
    }
  }

  createSign(sign) {
    const signObj = new Sign(
      this,
      sign.x,
      sign.y,
      'chipItemSheet',
      sign
    );
    this.signs.add(signObj);
  }

  createInventory() {
    const inventoryButton = new Button(
      this,
      610,
      290,
      'inventory',
      'inventory',
      ['pointerdown', this.inventoryOpen]
    );
  }

  inventoryOpen() {
    this.scene.scene.sleep();
    this.scene.scene.launch('Inventory');
  }

  inventoryClose() {
    this.scene.gameScene.sys.wake();
    this.scene.scene.stop('Inventory');
  }

  monsterHit(player, monster) {
    if (monster.isAttacking && !monster.hitPlayer) {
      monster.hitPlayer = true;
      this.events.emit('monsterAttack', monster.dmg);
    }
  }

  enemyOverlap(weapon, monster) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', monster, weapon.dmg);
    }
  }

  update() {
    if (this.player) {
      if (!this.player.readingSign) {
        this.player.update(this.cursors);
      } else {
        this.player.body.setVelocity(0);
      }
    }

    this.doors
      .getChildren()
      .forEach(obj => {
        if (obj.doorInfo && !obj.body.touching.none) {
          obj.doorInfo.destroy();
          delete obj.doorInfo;
        }  
      });

    this.chests
      .getChildren()
      .forEach(obj => {
        if (obj.chestInfo && !obj.body.touching.none) {
          obj.chestInfo.destroy();
          delete obj.chestInfo;
        }  
      });

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