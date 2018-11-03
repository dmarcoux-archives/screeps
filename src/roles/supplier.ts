// Creeps with the supplier role
export class Supplier extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      const suppliedStructureIds: string[] = Memory.rooms[this.memory.room].suppliedStructureIds;

      if (suppliedStructureIds.length === 0) {
        // TODO: This is a naive approach to prevent creeps from blocking others
        const idleFlag: Flag | undefined = Game.flags.Idle;
        if (idleFlag) {
          // TODO: Log errors
          this.moveTo(idleFlag.pos);
        }

        return;
      }

      const suppliedStructure: Structure = Game.getObjectById<Structure>(suppliedStructureIds[0])!;

      switch(this.transfer(suppliedStructure, RESOURCE_ENERGY)) {
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          // TODO: Log errors
          this.moveTo(suppliedStructure.pos);
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
          // TODO: Log errors
          this.moveTo(storage.pos);
          break;
      }

      return;
    }

    // TODO: Cache this in memory, perhaps by caching the location of the dropped energy???
    // TODO: Instead of RoomPosition.findInRange (medium CPU cost), use Room.lookForAtArea (low CPU cost)
    // TODO: Support multi-spawns
    const spawn: StructureSpawn = Game.spawns[this.room.memory.spawnNames[0]];
    const energy: Resource<ResourceConstant> | null = _.max(spawn.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

    if (energy) {
      switch (this.pickup(energy)) {
          // case OK:
          //   break;
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
