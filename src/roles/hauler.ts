import { logMessage } from 'globals';

// TODO: Haulers can sometime block the harvester from getting to the container. They must never stand on the container
// Creeps with the hauler role
export class Hauler extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      // TODO: Don't hardcode the spawn
      switch(this.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY)) {
        case ERR_FULL:
          // TODO: Transfer to container or storage if available
          this.drop(RESOURCE_ENERGY);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(Game.spawns.Spawn1) === OK) {
            logMessage(`${this.name} => Spawn`);
          }
          break;
      }

      return;
    }

    const source: Source = Game.getObjectById<Source>(this.memory.sourceId)!;

    // TODO: The container id should be stored in memory and retrieved with Game.getObjectById
    const container: StructureContainer | null = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, { filter: (structure) => structure.structureType === STRUCTURE_CONTAINER })[0];

    if (container) {
      switch (this.withdraw(container, RESOURCE_ENERGY)) {
        case OK:
          if (this.carry.energy === this.carryCapacity) {
            this.memory.working = true;
          }
          break;
        case ERR_FULL:
          this.memory.working = true;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(container.pos) === OK) {
            logMessage(`${this.name} => Container`);
          }
          break;
      }

      return;
    }

    // TODO: Cache the location of the energy?
    const energy: Resource<ResourceConstant> | null = _.max(source.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

    if (energy) {
      switch (this.pickup(energy)) {
        case OK:
          if (this.carry.energy === this.carryCapacity) {
            this.memory.working = true;
          }
          break;
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
