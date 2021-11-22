class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.playerSpawn = [];
    this.doorData = [];
    this.chestData = [];
    this.monsterData = [];
    this.signData = [];
    
    this.parseMapData();  
    this.createModels();
    this.spawnDoors();
    this.spawnChests();
    this.spawnMonsters();
    this.spawnSigns();
  }   

  parseMapData() {
    this.mapData.forEach(layer => {
      switch(layer.name) {
        case 'spawn':
          this.playerSpawn = [layer.objects[0].x, layer.objects[0].y];
          break;
        case 'door':
          this.layerPropData(this.doorData, layer, this.doorCallback);
          break;
        case 'chest':
          this.layerPropData(this.chestData, layer, this.chestCallback);  
          break; 
        case 'monster':
          this.layerPropData(this.monsterData, layer, this.monsterCallback);
          break;
        case 'sign':
          this.layerPropData(this.signData, layer, this.signCallback);
          break;
     }
   });
  }

  layerPropData(groupArr, layer, callback) {
    layer.objects.forEach((obj) => {
      const newObj = {};
      newObj.x = obj.x;
      newObj.y = obj.y;
      callback(newObj, obj);
      groupArr.push(newObj);    
    });
  }

  doorCallback(newObj, door) {
    if (door.type === 'door') {
      newObj.type = door.type;
      newObj.id = door.name.match(/[^-]+/g)[0];
      newObj.target = door.name.match(/[^-]+/g)[1];
    } else if (door.type === 'levelDoor') {
      newObj.type = door.type;
      if (door.properties) {
        newObj.eventCallback = door.properties[0].value.match(/[^-]+/g)[0];
        newObj.needKey = door.properties[0].value.match(/[^-]+/g)[1];
      }
    } else if (door.type === 'lockedDoor') {
      newObj.type = door.type;
      newObj.id = door.name.match(/[^-]+/g)[0];
      newObj.target = door.name.match(/[^-]+/g)[1];
    } else if (door.type === 'scriptureDoor') {
      newObj.type = door.type;
      newObj.requirements = door.name.match(/[^-]+/g);
      newObj.eventCallback = door.properties[1].value;
      newObj.id = door.properties[0].value.match(/[^-]+/g)[0];
      newObj.target = door.properties[0].value.match(/[^-]+/g)[1];
    }
  }

  chestCallback(newObj, chest) {
    let itemHeld = chest.properties[0].value.match(/[^-]+/g);
    newObj.item = [itemHeld[0], itemHeld[1]];
  }

  monsterCallback(newObj, monster) {
    if (monster.type === 'zombie') {
      newObj.type = monster.type;
    } else if (monster.type === 'golem') {
      newObj.type = monster.type;
    }
  }

  signCallback(newObj, sign) {
    let text = sign.properties[0].value;
    newObj.text = text;
  }
  
  createModels() {
    this.scene.playerModel = new PlayerModel(this.playerSpawn);
  }

  spawnDoors() {
    this.doorData.forEach(door => {
      this.scene.events.emit('createDoor', door);
    });
  }

  spawnChests() {
    this.chestData.forEach(chest => {
      this.scene.events.emit('createChest', chest);
    });
  }

  spawnMonsters() {
    this.monsterData.forEach(monster => {
      this.scene.events.emit('createMonster', monster);
    });
  }

  spawnSigns() {
    this.signData.forEach(sign => {
      this.scene.events.emit('createSign', sign);
    });
  }
}