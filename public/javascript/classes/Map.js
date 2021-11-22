class Map {
  constructor(scene, mapKey, tilesetName, tileKey) {
    this.scene = scene;
    this.mapKey = mapKey;
    this.tilesetName = tilesetName;
    this.tileKey = tileKey;
    this.layer = {};

    this.createMap();
    this.createMapLayer();
    this.mapSettings();
  }

  createMap() {
    this.map = this.scene.make.tilemap({ key: this.mapKey });
    this.tiles = this.map.addTilesetImage(this.tilesetName, this.tileKey, 32, 32, 0, 0);
  }

  createMapLayer() {
    for (let layerProp in staticMapLayerConfig) {
      this.layer[layerProp] = this.map.createLayer(staticMapLayerConfig[layerProp], this.tiles, 0, 0);
    };
  }

  mapSettings() {
    this.map.layers.forEach((layer) => {
      if (groupPropertyVal(layer, 'isBlocked')) {
        this.layer[propFromObjVal(staticMapLayerConfig, layer.name)].setCollisionByExclusion([-1]);
      }
    });

    this.scene.physics.world.bounds.width = this.map.widthInPixels;
    this.scene.physics.world.bounds.height = this.map.heightInPixels;

    this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }
}