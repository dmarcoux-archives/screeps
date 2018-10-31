import { logMessage } from 'globals';

// Creeps with the builder role
export class Builder extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      // TODO: Maybe instead of closest, find the construction site closest to being completed (so builders focus on one construction site at a time)
      const constructionSiteIds: string[] = Memory.rooms[this.room.name].constructionSiteIds;

      if (constructionSiteIds.length === 0) {
        return;
      }

      const constructionSite: ConstructionSite | null = Game.getObjectById<ConstructionSite>(constructionSiteIds[0]);

      if (constructionSite === null) {
        // Remove the construction site id from the memory
        Memory.rooms[this.room.name].constructionSiteIds.splice(0, 1);

        return;
      }

      switch(this.build(constructionSite)) {
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(constructionSite.pos) === OK) {
            logMessage(`${this.name} => Construction Site`);
          }
          break;
      }

      return;
    }

    const storage: StructureStorage | undefined = Game.rooms[this.memory.room].storage;
    if (storage) {
      switch (this.withdraw(storage, RESOURCE_ENERGY)) {
        case OK:
          if (this.carry.energy === this.carryCapacity) {
            this.memory.working = true;
          }
          break;
        case ERR_FULL:
          this.memory.working = true;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(storage.pos) === OK) {
            logMessage(`${this.name} => Storage`);
          }
          break;
      }

      return;
    }

    // TODO: Cache this in memory
    // TODO: Instead of RoomPosition.findInRange (medium CPU cost), use Room.lookForAtArea (low CPU cost)
    const energy: Resource<ResourceConstant> | null = _.max(Game.spawns.Spawn1.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

    if (energy) {
      switch (this.pickup(energy)) {
        case ERR_FULL:
          this.memory.working = true;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(energy.pos) === OK) {
            logMessage(`${this.name} => Energy`);
          }
          break;
      }
    }
  }
}
