import { logMessage } from 'globals';

// Creeps with the hauler role
export class Hauler {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    // TODO: Could this check be done only once, just after spawning?
    if (!(this.self.memory.sourceId)) {
      // TODO: This is limiting the number of haulers per source to 1. Multiple haulers per source might be better, if needed???
      // alternative?: const countSourceIds: Dictionary<number> = _.countBy(_.filter(Memory.creeps, (memory) => memory.role === this.self.memory.role && memory.room === this.self.memory.room && memory.sourceId).map((memory) => memory.sourceId));
      const busySourceIds: string[] = _.filter(Memory.creeps, (memory) => memory.role === this.self.memory.role && memory.room === this.self.memory.room && memory.sourceId).map((memory) => memory.sourceId);
      // TODO: Could it be more efficient?
      const freeSourceIds: string = Memory.rooms[this.self.memory.room].sourceIds.filter((value) => !busySourceIds.includes(value))[0];

      this.self.memory.sourceId = freeSourceIds;
    }

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
      const source: Source | null = Game.getObjectById(this.self.memory.sourceId);

      if (source) {
        // TODO: The container id should be stored in memory and retrieved with Game.getObjectById
        const container: StructureContainer | null = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, { filter: (structure) => structure.structureType === STRUCTURE_CONTAINER })[0];

        if (container) {
          switch (this.self.withdraw(container, RESOURCE_ENERGY)) {
            case OK:
              if (this.self.carry.energy === this.self.carryCapacity) {
                this.self.memory.working = true;
              }
              break;
            case ERR_FULL:
              this.self.memory.working = true;
              break;
            case ERR_NOT_IN_RANGE:
              if (this.self.moveTo(container.pos) === OK) {
                logMessage(`${this.self.name} => Container`);
              }
              break;
          }
        }
        else {
          // TODO: Cache the location of the energy?
          const energy: Resource<ResourceConstant> | null = _.max(source.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

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
  }
}
