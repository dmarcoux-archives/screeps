import { CreepRole } from 'globals';

// Creeps with the harvester role
export class Harvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      if (this.self.carry.energy === 0) {
        this.self.memory.working = false;
      } else {
        if (this.self.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          console.log(`${this.self.name}: ${CreepRole[this.self.memory.role]} => Spawn`);
          this.self.moveTo(Game.spawns.Spawn1);
        }
      }
    }
    else {
      if (this.self.carry.energy === this.self.carryCapacity) {
        this.self.memory.working = true;
      } else {
        const source = this.self.pos.findClosestByPath(FIND_SOURCES);

        if (source && this.self.harvest(source) === ERR_NOT_IN_RANGE) {
          console.log(`${this.self.name}: ${CreepRole[this.self.memory.role]} => Source`);
          this.self.moveTo(source.pos);
        }
      }
    }
  }
}
