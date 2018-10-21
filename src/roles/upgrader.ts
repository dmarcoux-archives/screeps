import { logMessage } from 'globals';

// Creeps with the upgrader role
export class Upgrader extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    // TODO: Better naming for the different states (working is just too generic for all creeps)
    if (this.memory.working) {
      if (this.room.controller) {
        switch(this.upgradeController(this.room.controller)) {
          case ERR_NOT_ENOUGH_RESOURCES:
            this.memory.working = false;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.moveTo(this.room.controller.pos) === OK) {
              logMessage(`${this.name} => Controller`);
            }
            break;
        }
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
