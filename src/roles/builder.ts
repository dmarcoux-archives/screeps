import { logMessage } from 'globals';

// Creeps with the builder role
// TODO: Build roads between sources and spawn
// TODO: Build roads between sources and room controller
// TODO: Build walls/ramparts to block room entrances/exits and around controller
// TODO: Build towers (one next to spawn, others...???)
// TODO: Build extensions (next to a road close to the spawn)
export class Builder {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      const constructionSite: ConstructionSite | null = this.self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

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
      else if (this.self.room.controller) {
        switch(this.self.upgradeController(this.self.room.controller)) {
          case ERR_NOT_ENOUGH_RESOURCES:
            this.self.memory.working = false;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(this.self.room.controller.pos) === OK) {
              logMessage(`${this.self.name} => Controller`);
            }
            break;
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
