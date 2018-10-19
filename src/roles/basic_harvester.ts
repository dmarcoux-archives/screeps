import { logMessage } from 'globals';

// Creeps with the basic harvester role
export class BasicHarvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      // TODO: Don't hardcode the spawn
      switch(this.self.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY)) {
        // Ignore ERR_FULL to try to transfer again next tick
        case ERR_NOT_ENOUGH_RESOURCES:
          this.self.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.self.moveTo(Game.spawns.Spawn1) === OK) {
            logMessage(`${this.self.name} => Spawn`);
          }
          break;
      }
    }
    else {
      if (this.self.carry.energy === this.self.carryCapacity) {
        this.self.memory.working = true;
      }
      else {
        const source: Source | null = Game.getObjectById(this.self.memory.sourceId);

        if (source) {
          switch (this.self.harvest(source)) {
            case ERR_NOT_IN_RANGE:
              if (this.self.moveTo(source.pos) === OK) {
                logMessage(`${this.self.name} => Source`);
              }
              break;
          }
        }
      }
    }
  }
}
