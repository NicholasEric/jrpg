class InventoryScene extends Phaser.Scene {
  constructor() { super('Inventory'); }

  init() {
    this.gameScene = this.scene.get('Game');
  }
  
  create() {
    this.itemGroup = this.add.group();
    this.font = 'pixel';
    this.inventoryButton = new Button(
      this,
      610,
      290,
      'inventory',
      'inventory',
      ['pointerdown', this.gameScene.inventoryClose]
    );

    this.createInventory();
    this.createArrows();
    this.displayInventory();
  }

  createInventory() {
    this.background = this.add.image(320, 160, 'inventoryBg')
    this.background.setSize(640, 320)
    this.background.depth = -1;
    this.background.setTint(0x654321);

    this.gameScene.player.inventory.forEach(itemArr => {
      let item = itemArr[0];
      let itemInfo = itemArr[1];
      let scale = 1;
      let offSetX = 0;
      let offSetY = 0;
      switch(item) {
        case 'key':
          scale = .6;
          break;
        case 'scripture':
          scale = .7;
          offSetY = -20;
          break;
        case 'levelKey':
          scale = .3;
          offSetY = -30;
          break;
      }
      let itemImg = this.add.image(320, 160, item);
      itemImg.text = this.add.bitmapText(0, 0, this.font, `${item} ${itemInfo}`, 16);
      Phaser.Display.Align.In.BottomCenter(itemImg.text, itemImg, offSetX, offSetY);
      itemImg.item = itemArr;
      itemImg.setScale(scale);
      itemImg.setVisible(false);
      itemImg.text.setVisible(false);
      this.itemGroup.add(itemImg);
    });
  }

  createArrows() {
    if (this.gameScene.player.inventory.length > 1) {
      this.leftArrow = new Button(this, 30, 160, 'arrow', 'leftArrow', ['pointerdown', this.leftArrowCallback]);    
      this.rightArrow = new Button(this, 610, 160, 'arrow', 'rightArrow', ['pointerdown', this.rightArrowCallback]);
    }
  }

  leftArrowCallback() {
    this.scene.getCurrItem().setVisible(false);
    this.scene.getCurrItem().text.setVisible(false);
    this.scene.gameScene.player.currItem = this.scene.iterateItemInd(-1); 
    this.scene.displayInventory();
  }

  rightArrowCallback() {
    this.scene.getCurrItem().setVisible(false);
    this.scene.getCurrItem().text.setVisible(false);
    this.scene.gameScene.player.currItem = this.scene.iterateItemInd(1);
    this.scene.displayInventory(); 
  }

  displayInventory() {
    if (this.gameScene.player.inventory.length > 0) {
      if (!this.gameScene.player.currItem) {
        this.gameScene.player.currItem = this.itemGroup.getChildren()[0].item;
      }
      this.getCurrItem().setVisible(true);
      this.getCurrItem().text.setVisible(true);
    }
  }

  getCurrItem() {
    return (this.itemGroup.getChildren().filter(item => item.item === this.gameScene.player.currItem)[0]) || (this.itemGroup.getChildren()[0]);
  }

  iterateItemInd(i) {
    return this.itemGroup.getChildren()[(this.itemGroup.getChildren().findIndex(item => item.item === this.getCurrItem().item) + i + this.itemGroup.getChildren().length) % this.itemGroup.getChildren().length].item;
  }
}