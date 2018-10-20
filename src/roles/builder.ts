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

  // TODO: DRY the code
  // TODO: Use guard clauses
  public work() {
    if (this.self.memory.working) {
      // TODO: Maybe instead of closest, find the construction site closest to being completed (so builders focus on one construction site at a time)
      const constructionSiteIds: string[] = Memory.rooms[this.self.room.name].constructionSiteIds;
      if (constructionSiteIds.length > 0) {
        const constructionSite: ConstructionSite | null = Game.getObjectById(constructionSiteIds[0]);

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
        else {
          // Remove the construction site id from the memory
          Memory.rooms[this.self.room.name].constructionSiteIds.splice(0, 1);

          if (this.self.room.controller) {
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
      }
      else {
        if (this.self.room.controller) {
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
