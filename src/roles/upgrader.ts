// Creeps with the upgrader role
export class Upgrader {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      if (this.self.carry.energy === 0) {
        this.self.memory.working = false;
      } else {
        if (this.self.room.controller && this.self.upgradeController(this.self.room.controller) === ERR_NOT_IN_RANGE) {
          if (this.self.moveTo(this.self.room.controller.pos) === OK) {
            console.log(`${this.self.name} => Controller`);
          }
        }
      }
    }
    else {
      if (this.self.carry.energy === this.self.carryCapacity) {
        this.self.memory.working = true;
      } else {
        const source = this.self.pos.findClosestByPath(FIND_SOURCES);

        if (source && this.self.harvest(source) === ERR_NOT_IN_RANGE) {
          if (this.self.moveTo(source.pos) === OK) {
            console.log(`${this.self.name} => Source`);
          }
        }
      }
    }
  }
}
