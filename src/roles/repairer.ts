import { logMessage } from 'globals';

// Creeps with the repairer role
export class Repairer extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      const damagedStructureIds: string[] = Memory.rooms[this.memory.room].damagedStructureIds;

      if (damagedStructureIds.length === 0) {
        // TODO: This is a naive approach to prevent creeps from blocking others
        const idleFlag: Flag = Game.flags['Idle'];
        if (idleFlag) {
          this.moveTo(idleFlag.pos);
        }

        return;
      }

      const damagedStructure: Structure = Game.getObjectById<Structure>(damagedStructureIds[0])!;
      switch(this.repair(damagedStructure)) {
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(damagedStructure.pos) === OK) {
            logMessage(`${this.name} => Damaged Structure`);
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
