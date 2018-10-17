import { logMessage } from 'globals';

// Creeps with the supplier role
export class Supplier {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      const supplySite: Structure | null = this.self.pos.findClosestByPath(
        FIND_MY_STRUCTURES,
        {
          // TODO: [STRUCTURE_TOWER, STRUCTURE_EXTENSION].includes(structure.structureType) doesn't work... this explains the multiple ifs
          filter: (structure) => (structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity
        }
      );

      if (supplySite) {
        switch(this.self.transfer(supplySite, RESOURCE_ENERGY)) {
          case ERR_NOT_ENOUGH_RESOURCES:
            this.self.memory.working = false;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(supplySite.pos) === OK) {
              // TODO: Bit more accurate here
              logMessage(`${this.self.name} => Supply Site`);
            }
            break;
        }
      }
    }
    else {
      // TODO: Cache this in memory, perhaps by caching the location of the dropped energy???
      // TODO: Instead of RoomPosition.findInRange (medium CPU cost), use Room.lookForAtArea (low CPU cost)
      const energy: Resource<ResourceConstant> | null = _.max(Game.spawns.Spawn1.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

      if (energy) {
        switch (this.self.pickup(energy)) {
            // case OK:
            //   break;
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
