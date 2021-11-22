const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 320,
    scene : [
      BootScene,
      TitleScene,
      CutScene,
      BedScene,
      GameScene,
      InventoryScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: {
          y: 0
        }
      }
    },
    pixelArt: true,
    roundPixels: true
  };
  
const game = new Phaser.Game(config);