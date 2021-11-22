class TextBox extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, speaker, text, targetCallback) {
    super(scene, x , y);
    this.scene = scene;
    this.key = key;
    this.speaker = speaker;
    this.text = text;
    this.targetCallback = targetCallback;
    this.font = 'pixel';
    
    this.createTextBox();
    this.scene.add.existing(this);
  }
  
  createTextBox() {
    this.createTextBoxImg();
    this.createName();
    this.createMainText();
    this.createInput();
  }

  createTextBoxImg() {
    this.textBoxImg = this.scene.add.image(0 , 0, this.key);
    this.textBoxImg.setInteractive();
    this.textBoxImg.alpha = .8;
    this.add(this.textBoxImg);
  }

  createName() {
    this.speakerName = this.scene.add.bitmapText(0, 0, this.font, this.speaker, 16);
    Phaser.Display.Align.In.TopLeft(this.speakerName, this.textBoxImg, -30, -5);
    this.add(this.speakerName);
  }

  createMainText() {
    this.slicedText = paragraphSlicer(this.text, 43);
    this.currentText = this.scene.add.bitmapText(-250, -20, this.font, "", 12);
    this.add(this.currentText);

    this.textIterator = 0;

    this.textLoop = setInterval(this.setIntervalText.bind(this), 50);
  }

  setIntervalText() {
    this.currentText.text += this.slicedText[this.textIterator];
    this.textIterator++;
    if (this.slicedText.length <= this.textIterator) clearInterval(this.textLoop);
  }

  createInput() {
    this.textBoxImg.setInteractive();
    this.textBoxImg.on('pointerup', () => {
      if (this.textIterator < this.slicedText.length-1 && this.currentText._text !== this.slicedText) {
        clearInterval(this.textLoop);
        this.textIterator = this.slicedText.length-1;
        this.currentText.setText(this.slicedText);
      } else if (this.currentText._text === this.slicedText) {
        this.scene.finish = true;
        this.textBoxImg.removeInteractive();
        this.speakerName.destroy();
        this.textBoxImg.destroy();
        this.currentText.destroy();
        this.targetCallback(); 
      }
    });
  }
}