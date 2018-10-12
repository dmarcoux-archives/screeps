// Creeps with the upgrader role
export class Upgrader {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      console.log(this.self.name + ' WORKING');

      if (this.self.carry.energy === 0) {
        console.log(this.self.name + ' ENERGY EMPTY');

        this.self.memory.working = false;
      } else {
        if (this.self.room.controller && this.self.upgradeController(this.self.room.controller) === ERR_NOT_IN_RANGE) {
          console.log(this.self.name + ' MOVING TO CONTROLLER');
          this.self.moveTo(this.self.room.controller.pos);
        }
      }
    }
    else {
      console.log(this.self.name + ' NOT WORKING');

      if (this.self.carry.energy === this.self.carryCapacity) {
        console.log(this.self.name + ' ENERGY FULL');

        this.self.memory.working = true;
      } else {
        const source = this.self.pos.findClosestByPath(FIND_SOURCES);

        if (source && this.self.harvest(source) === ERR_NOT_IN_RANGE) {
          console.log(this.self.name + ' MOVING TO SOURCE');
          this.self.moveTo(source.pos);
        }
      }
    }
  }
}
