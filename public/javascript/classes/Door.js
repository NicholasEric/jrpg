class Door extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, door) {
    super(scene, x, y, 'blank');
    this.scene = scene;
    this.doorData = door;

    this.createDoorByType();

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  createDoorByType() {
    switch(this.doorData.type) {
      case 'door':
        this.id = this.doorData.id;
        this.target = this.doorData.target;
        break;
      case 'lockedDoor':
        this.id = this.doorData.id;
        this.target = this.doorData.target;
        break;
      case 'levelDoor':
        break;
      case 'scriptureDoor':
        this.id = this.doorData.id;
        this.target = this.doorData.target;
        this.requirements = this.doorData.requirements;
        this.eventCallback = this.doorData.eventCallback;
        break;
    }
  }
}