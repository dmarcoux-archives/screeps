// Creeps with the builder role
export class Builder extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      // TODO: Maybe instead of closest, find the construction site closest to being completed (so builders focus on one construction site at a time)
      const constructionSiteIds: string[] = Memory.rooms[this.memory.room].constructionSiteIds;

      if (constructionSiteIds.length === 0) {
        // TODO: This is a naive approach to prevent creeps from blocking others
        const idleFlag: Flag | undefined = Game.flags.Idle;
        if (idleFlag) {
          // TODO: Log errors
          this.moveTo(idleFlag.pos);
        }

        return;
      }

      const constructionSite: ConstructionSite | null = Game.getObjectById<ConstructionSite>(constructionSiteIds[0]);

      // TODO: This should be a while so if it's null, then loop until one constructionSite is valid or until the end of the array
      if (constructionSite === null) {
        // Remove the construction site id from the memory
        Memory.rooms[this.memory.room].constructionSiteIds.splice(0, 1);

        return;
      }

      switch(this.build(constructionSite)) {
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          // TODO: Log errors
          this.moveTo(constructionSite.pos);
          break;
      }

      return;
    }

    const storage: StructureStorage | undefined = Game.rooms[this.memory.room].storage;
    // Only go to the storage if it has at least as much energy as the creep can carry
    if (storage && storage.store.energy >= this.carryCapacity) {
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
          // TODO: Log errors
          this.moveTo(storage.pos);
          break;
      }

      return;
    }

    // TODO: Cache this in memory
    // TODO: Instead of RoomPosition.findInRange (medium CPU cost), use Room.lookForAtArea (low CPU cost)
    // TODO: Support multi-spawns
    const spawn: StructureSpawn = Game.spawns[this.room.memory.spawnNames[0]];
    const energy: Resource<ResourceConstant> | null = _.max(spawn.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

    if (energy) {
      switch (this.pickup(energy)) {
        case ERR_FULL:
          this.memory.working = true;
          break;
        case ERR_NOT_IN_RANGE:
          // TODO: Log errors
          this.moveTo(energy.pos);
          break;
      }
    }
  }
}
