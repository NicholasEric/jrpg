class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.createBackground();
    this.createButtons();
    this.cameras.main.fadeOut();
    this.cameras.main.fadeIn(1000);
  }

  createBackground() {
    this.bg = this.add.image(320, 160, 'tunnelBg');
    this.bg.setScale(.5, .5);

    this.junaBg = this.add.image(320, 160, 'junaBg');
    
    this.bgTween = this.tweens.add({
      targets: this.bg,
      scaleX: 1.2,
      scale: 1.2,
      duration: 30000,
      paused: false,
      repeat: -1,
      yoyo: true,
      ease: 'quadratic'
    });
  }

  createButtons() {
    this.playButton = new Button(this, 90, 270, 'button', 'start', ['pointerup', this.startGame]);
  }

  startGame() {
    this.scene.cameras.main.fadeOut(2000);
    this.scene.time.delayedCall(3000, () => {
      this.scene.cameras.main.fadeIn(2000);   
      this.scene.backgroundImg = this.scene.add.image(320, 160, 'chapterBg');
      this.scene.backgroundImg.depth = 3;
      this.scene.backgroundImg.setScrollFactor(0);
      this.scene.time.delayedCall(3000, () => {
        this.scene.finalStr = 'Prologue';
        this.scene.finalText = this.scene.add.bitmapText(320, 160, 'pixel', "", 16);
        this.scene.finalText.depth = 4;
        this.scene.finalText.setScrollFactor(0);
        Phaser.Display.Align.In.Center(this.scene.finalText, this.scene.backgroundImg);
        this.scene.finalTextIterator = 0;
        this.scene.finalTextLoop = setInterval(this.scene.setIntervalFinalText.bind(this), 100, ['Prologue']);

        this.scene.time.delayedCall(this.scene.finalStr.length * 100 + 1000, () => {
          this.scene.cameras.main.fadeOut(1000);
          this.scene.time.delayedCall(1000, () => {
            this.scene.scene.start('Cut');
          }, [], this);
        }, [] , this);
      });
    }, [], this);
  }

  setIntervalFinalText(str) {
    this.scene.finalText.text += str[0][this.scene.finalTextIterator];
    this.scene.finalTextIterator++;
    if (str[0].length <= this.scene.finalTextIterator) clearInterval(this.scene.finalTextLoop);
  }

}