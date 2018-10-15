import { logMessage } from 'globals';

// Creeps with the repairer role
export class Repairer {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      const repairSite = this.self.pos.findClosestByPath(
        FIND_STRUCTURES,
        {
          filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        }
      );

      if (repairSite) {
        switch(this.self.repair(repairSite)) {
          case ERR_NOT_ENOUGH_RESOURCES:
            this.self.memory.working = false;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(repairSite.pos) === OK) {
              logMessage(`${this.self.name} => Repair Site`);
            }
            break;
        }
      }
      else {
        // TODO: DRY this (duplicated code from builder)
        // Act as a builder if there is nothing to repair
        const constructionSite = this.self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        if (constructionSite) {
          switch(this.self.build(constructionSite)) {
            case ERR_NOT_ENOUGH_RESOURCES:
              this.self.memory.working = false;
              break;
            case ERR_NOT_IN_RANGE:
              if (this.self.moveTo(constructionSite.pos) === OK) {
                logMessage(`${this.self.name} => Construction Site`);
              }
              break;
          }
        }
      }
    }
    else {
      // TODO: Cache this in memory
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
