class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }
   
  preload() {
    this.createLoadingScreen();
    this.loadImages();
    this.loadAudio();
    this.loadFont()
    this.loadSpritesheets();
    this.loadTileMap();
    this.loadDialogue();
  }

  createLoadingScreen() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x666666, 0.8);
    progressBox.fillRect(160, 230, 320, 50);

    const width = 640;
    const height = 360;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 90,
      text: 'Loading...',
        style: {
          font: '20px monospace',
          fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
            
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 45,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
            
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 - 10,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
 
    assetText.setOrigin(0.5, 0.5);
            
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x222222, 1);
      progressBar.fillRect(170, 240, 300 * value, 30);
    });
            
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });
 
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
            
  }

   
  loadImages() {
    this.load.image('dialogueBox', '/assets/images/dialogue-box.png');
    this.load.image('popUp', '/assets/images/popUp.png');
    this.load.image('chipTileset', '/assets/level/chip_tileset.png');
    this.load.image('inventory', '/assets/images/inventory.png');
    this.load.image('key', '/assets/images/key.png');
    this.load.image('arrow', '/assets/images/arrow.png');
    this.load.image('healthbar', '/assets/images/healthbar.png');
    this.load.image('art-juna', '/assets/images/art-juna.png');
    this.load.image('sword', '/assets/images/sword.png');
    this.load.image('sign', '/assets/images/sign.png');
    this.load.image('junaBg', '/assets/images/junaBg.png');
    this.load.image('button', '/assets/images/button.png');
    this.load.image('aris', '/assets/images/aris.png');
    this.load.image('arisFace', '/assets/images/arisFace.png');
    this.load.image('blank', '/assets/images/blank.png');
    this.load.image('scripture', '/assets/images/scripture.png');
    this.load.image('levelKey', '/assets/images/levelKey.png');

    this.load.image('3dGrid', '/assets/images/3dGrid.jpg');
    this.load.image('inventoryBg', '/assets/images/inventoryBg.jpg');
    this.load.image('classBg', '/assets/images/classBg.jpg');
    this.load.image('handBg', '/assets/images/handBg.jpg');
    this.load.image('arisBg', '/assets/images/arisBg.jpg');
    this.load.image('bedBg', '/assets/images/bedBg.jpg');
    this.load.image('doorWithSwordBg', '/assets/images/doorWithSwordBg.jpg');
    this.load.image('holeBg', '/assets/images/hole.jpg');
    this.load.image('chapterBg', '/assets/images/chapterBg.jpg');
    this.load.image('tunnelBg', '/assets/images/tunnelBg.jpg');
    this.load.image('undergroundBg', '/assets/images/undergroundBg.jpg');
    this.load.image('junaPonderBg', '/assets/images/junaPonderBg.jpg');
    this.load.image('fallBg', '/assets/images/fallBg.jpg');
    this.load.image('keyBg', '/assets/images/keyBg.jpg');
  }

  loadAudio() {
  }

  loadFont() {
    this.load.bitmapFont('pixel', '/assets/fonts/press-start-2p.png', '/assets/fonts/press-start-2p.xml');
  }

  loadSpritesheets() {
    this.load.spritesheet('junaSpritesheet', '/assets/images/juna-spritesheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('chipItemSheet', '/assets/level/chip_tileset.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('zombieWalk', '/assets/images/zombieWalk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('zombieAtk', '/assets/images/zombieAtk.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('zombieDeath', '/assets/images/zombie7.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('arisWalk', '/assets/images/arisWalk.png', { frameWidth: 45, frameHeight: 90 });
    this.load.spritesheet('arisAtk', '/assets/images/arisAttack.png', { frameWidth: 45, frameHeight: 90 });
    this.load.spritesheet('arisDeath', '/assets/images/arisDeath.png', { frameWidth: 60, frameHeight: 90 });
  }
  
  loadTileMap() {
    this.load.tilemapTiledJSON('bedroom', '/assets/level/bedroom.json');
    this.load.tilemapTiledJSON('level1', '/assets/level/level1-test.json');
  }

  loadDialogue() {
    this.load.json('prologue', '/assets/dialogue/prologue.json');
    this.load.json('prologue2', '/assets/dialogue/prologue2.json');
    this.load.json('arena1', '/assets/dialogue/arena1.json');
    this.load.json('backFromArena1', '/assets/dialogue/backFromArena1.json');
  }
   
  create() {
    //this.scene.start('Game');
    this.scene.start('Title');
    //this.scene.start('Cut');
    //this.scene.start('Bed');
  }
}