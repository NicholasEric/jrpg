let playingCutScene = 0;

const cutScenes = [
  'prologue',
  'prologue2',
  'arena1',
  'backFromArena1'
]

const paragraphSlicer = (paragraph, maxLen) => {
  let finalText = "";   
  for (let i = 0; i < paragraph.length; i += maxLen) {
    finalText += paragraph.slice(i, maxLen+i);
    
    if (paragraph[maxLen+i-1] !== ' ' && i + maxLen <= paragraph.length) {
      finalText += '-';
    }
    finalText += '\n';
  }
  return finalText;
}