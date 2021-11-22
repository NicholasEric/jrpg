class UiScene extends Phaser.Scene {
  constructor() { super('Ui'); }

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
      switch(item) {
        case 'key':
          let itemImg = this.add.image(320, 160, 'key');
          itemImg.text = this.add.bitmapText(0, 0, this.font, `key ${itemInfo}`, 16);
          Phaser.Display.Align.In.BottomCenter(itemImg.text, itemImg);
          itemImg.item = itemArr;
          itemImg.setScale(.6);
          itemImg.setVisible(false);
          itemImg.text.setVisible(false);
          this.itemGroup.add(itemImg);
          break;
      }
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
    return this.itemGroup.getChildren().filter(item => item.item === this.gameScene.player.currItem)[0];
  }

  iterateItemInd(i) {
    return this.itemGroup.getChildren()[(this.itemGroup.getChildren().findIndex(item => item.item === this.getCurrItem().item) + i + this.itemGroup.getChildren().length) % this.itemGroup.getChildren().length].item;
  }
}