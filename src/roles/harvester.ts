// Creeps with the harvester role
export class Harvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      console.log(`${this.self.name} is working`);

      if (this.self.carry.energy === 0) {
        console.log(`${this.self.name} energy empty`);
        this.self.memory.working = false;
      } else {
        if (this.self.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          console.log(`${this.self.name} is moving to spawn`);
          this.self.moveTo(Game.spawns.Spawn1);
        }
      }
    }
    else {
      console.log(`${this.self.name} is not working`);

      if (this.self.carry.energy === this.self.carryCapacity) {
        console.log(`${this.self.name} energy full`);
        this.self.memory.working = true;
      } else {
        const source = this.self.pos.findClosestByPath(FIND_SOURCES);

        if (source && this.self.harvest(source) === ERR_NOT_IN_RANGE) {
          console.log(`${this.self.name} is moving to source`);
          this.self.moveTo(source.pos);
        }
      }
    }
  }
}
