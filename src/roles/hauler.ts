import { logMessage } from 'globals';

// Creeps with the hauler role
export class Hauler {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      // TODO: Don't hardcode the spawn
      switch(this.self.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY)) {
        case ERR_FULL:
          // TODO: Transfer to container or storage if available
          this.self.drop(RESOURCE_ENERGY);
          break;
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
      // TODO: Cache this in memory
      // TODO: Assign creep to a source, so it doesn't go back and forth between sources
      const energy: Resource<ResourceConstant> | null = this.self.pos.findClosestByPath(
        FIND_DROPPED_RESOURCES,
        {
          filter: (resource) => resource.resourceType === RESOURCE_ENERGY
        }
      );

      if (energy) {
        switch (this.self.pickup(energy)) {
          case OK:
            if (this.self.carry.energy === this.self.carryCapacity) {
              this.self.memory.working = true;
            }
            break;
          case ERR_FULL:
            this.self.memory.working = true;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(energy.pos) === OK) {
              logMessage(`${this.self.name} => Energy`);
            }
            break;
        }
      }
    }
  }
}
