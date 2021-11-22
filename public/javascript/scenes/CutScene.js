class CutScene extends Phaser.Scene {
  constructor() { super('Cut'); }
  create() {
    this.jsonData = this.cache.json.get(cutScenes[playingCutScene]);
    this.subscene = this.jsonData.subscene;
    this.currSubsceneIndex = 0;
    this.currDialogueIndex = 0;
    this.currSpeakers = {};

    this.createBackground();
    this.createEvents();
    this.createSpeakers();
    this.createTweens();
    this.playCutScene(); 
  }

  createBackground() {
    let scaleX = 1;
    let scaleY = 1;

    if (this.backgroundImg) this.backgroundImg.destroy();
    switch(this.subscene[this.currSubsceneIndex].bg) {
      case 'classBg':
        scaleX = .8;
        scaleY = .8;
        break;
      case 'handBg':
        scaleX = .8;
        scaleY = .5;
        break;
      case 'tunnelBg':
        scaleX = .5;
        scaleY = .5;
        break;
      case 'undergroundBg':
        scaleX = 1;
        scaleY = 1;
        break;
      case 'junaPonderBg':
        scaleX = 1;
        scaleY = 1;
        break;
      case 'fallBg':
        scaleX = 2;
        scaleY = .8;
        break; 
    }
    this.backgroundImg = this.add.image(320, 160, this.subscene[this.currSubsceneIndex].bg);
    this.backgroundImg.depth = -2;
    this.backgroundImg.setScale(scaleX, scaleY);
  }

  createEvents() {
    this.events.on('displayCutScene', () => {
    this.currPlayingData = this.subscene[this.currSubsceneIndex].dialogue[this.currDialogueIndex];
        
    if (this.currPlaying) {
      this.currPlaying.destroy();
    }

    switch(this.subscene[this.currSubsceneIndex].type) {
      case '1-1':
      case '1_1':
        switch(this.currPlayingData.speaker) {
          case this.subscene[this.currSubsceneIndex].speakers[0]:
            try {
              if (this.currPlayingData.speaker !== this.subscene[this.currSubsceneIndex].dialogue[this.currDialogueIndex-1].speaker) {
                this.zoomInTween1.play();
                this.zoomOutTween2.play(); 
              }  
            } catch(e) {}
            break;
          case this.subscene[this.currSubsceneIndex].speakers[1]:
            try {
              if (this.currPlayingData.speaker !== this.subscene[this.currSubsceneIndex].dialogue[this.currDialogueIndex-1].speaker) {
                this.zoomInTween2.play();
                this.zoomOutTween1.play();
              }     
            } catch(e) {}
            break;
        }
    }

    this.currPlaying = new TextBox(
      this, 
      320, 
      250, 
      'dialogueBox', 
      this.currPlayingData.speaker, 
      this.currPlayingData.text,
      this.iterateCutscene
    );

    });

    this.events.on('fadeIn', () => {
      this.cameras.main.fadeIn(1000);
    });

    this.events.on('fadeOutBed', () => {
      this.cameras.main.fadeOut(1000);
      this.time.delayedCall(1000, () => {
        this.scene.start('Bed');
      }, [] , this);
    });

    this.events.on('fadeOutGame', () => {
      this.cameras.main.fadeOut(2000);
      this.time.delayedCall(3000, () => {
        this.cameras.main.fadeIn(2000);   
        this.backgroundImg.setTexture('chapterBg');
        this.time.delayedCall(3000, () => {
          this.finalStr = 'Chapter 1: Tunnel';
          this.finalText = this.add.bitmapText(320, 160, 'pixel', "", 16);
          Phaser.Display.Align.In.Center(this.finalText, this.backgroundImg);
          this.finalTextIterator = 0;
          this.finalTextLoop = setInterval(this.setIntervalFinalText.bind(this), 100, ['Chapter 1: Tunnel']);

          this.time.delayedCall(this.finalStr.length * 100 + 1000, () => {
            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1000, () => {
              this.scene.start('Game');
            }, [], this);
          }, [] , this);
        });
      }, [], this);
    }, [], this);
  
    this.events.on('returnGame', () => {
      this.cameras.main.fadeOut(2000);
      this.time.delayedCall(3000, () => {
        this.scene.stop('Cut');
        this.scene.wake('Game');
        this.scene.get('Game').cameras.main.fadeIn(2000);
      }, [], this);
    });

    this.events.on('returnFromArena1', () => {
      this.cameras.main.fadeOut(2000);
      this.time.delayedCall(3000, () => {
        this.scene.stop('Cut');
        this.scene.wake('Game');
        this.scene.get('Game').events.emit('returnedFromArena1');
      }, [], this);
    });

   
  }

  setIntervalFinalText(str) {
    this.finalText.text += str[0][this.finalTextIterator];
    this.finalTextIterator++;
    if (str[0].length <= this.finalTextIterator) clearInterval(this.finalTextLoop);
  }

  createSpeakers() {
    this.subscene[this.currSubsceneIndex].speakers.forEach(speaker => {
      let spriteX = 0;
      let spriteY = 0;
      let scale = 1;
      let key = '';
      switch(this.subscene[this.currSubsceneIndex].type) {
        case '1-1':
          switch(speaker) {
            case "Juna":
              spriteX = 160;
              spriteY = 120; 
              scale = .2;
              key = 'art-juna'
              break;
            case "Aris":
              spriteX = 480;
              spriteY = 150; 
              scale = .4;
              key = 'aris'
              break;
          }
          this.currSpeakers[speaker] = this.add.image(spriteX, spriteY, key);
          this.currSpeakers[speaker].setScale(scale);
          this.currSpeakers[speaker].depth = -1;
          break;
        case '1_1':
          switch(speaker) {
            case "Juna":
              scale = .2;
              key = 'art-juna'
              break;
            case "Aris":
              scale = .6;
              key = 'aris'
              break;
          }
          this.currSpeakers[speaker] = this.add.image(320, 160, key);
          this.currSpeakers[speaker].setScale(scale);
          this.currSpeakers[speaker].depth = -1;
          break;
      }    
    });
  }

  createTweens() {
    if (this.subscene[this.currSubsceneIndex].type === '1-1') {
      this.zoomOutTween1 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[0]],
        alpha: 0.5,
        duration: 200,
        paused: true
      });
  
      this.zoomOutTween2 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[1]],
        alpha: 0.5,
        duration: 200,
        paused: true
      });
  
      this.zoomInTween1 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[0]],
        alpha: 1,
        duration: 200,
        paused: true
      });
  
      this.zoomInTween2 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[1]],
        alpha: 1,
        duration: 200,
        paused: true
      });

      this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[1]].alpha = 0.5;
    } else if (this.subscene[this.currSubsceneIndex].type === '1_1') {  
      this.zoomOutTween2 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[1]],
        alpha: 0,
        duration: 100,
        paused: true
      });
  
      this.zoomInTween1 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[0]],
        alpha: 1,
        duration: 100,
        paused: true
      });

      this.zoomOutTween1 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[0]],
        alpha: 0,
        duration: 100,
        paused: true
      });
  
      this.zoomInTween2 = this.tweens.add({
        targets: this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[1]],
        alpha: 1,
        duration: 100,
        paused: true
      });

      this.currSpeakers[this.subscene[this.currSubsceneIndex].speakers[1]].alpha = 0;
    }
  }

  playCutScene() {
    this.events.emit(this.jsonData.startCall);
    this.events.emit('displayCutScene');
  }

  iterateCutscene() {
    this.scene.currDialogueIndex++;
    if (this.scene.currDialogueIndex < this.scene.subscene[this.scene.currSubsceneIndex].dialogue.length) {
      this.scene.events.emit('displayCutScene');
    } else {
      this.scene.currSubsceneIndex++;
      this.scene.currDialogueIndex = 0;

      if (this.scene.currSubsceneIndex < this.scene.subscene.length) {
        this.scene.cameras.main.flash(2000);
        this.scene.recreateSprites();
        this.scene.time.delayedCall(3000, () => {
          this.scene.events.emit('displayCutScene');
        }, [], this);
      } else {
        this.scene.events.emit(this.scene.jsonData.endCall);         
        playingCutScene++;
      }
    }
  }

  recreateSprites() {
    this.subscene[this.currSubsceneIndex-1].speakers.forEach(speaker => {
      if (this.currSpeakers !== {}) {
        this.currSpeakers[speaker].destroy();
      }
    });
    this.currSpeakers = {};

    this.createSpeakers();
    this.createTweens();
    this.createBackground();
  }
}