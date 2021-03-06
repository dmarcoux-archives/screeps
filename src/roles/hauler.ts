// TODO: Haulers can sometime block the harvester from getting to the container. They must never stand on the container
// Creeps with the hauler role
export class Hauler extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      // TODO: Support multi-spawns
      const spawn: StructureSpawn = Game.spawns[this.room.memory.spawnNames[0]];
      const storage: StructureStorage | undefined = Game.rooms[this.memory.room].storage;

      if (spawn.energy < spawn.energyCapacity || !storage) {
        switch (this.transfer(spawn, RESOURCE_ENERGY)) {
          // TODO: Is ERR_NOT_ENOUGH_RESOURCES needed?
          case OK:
          case ERR_NOT_ENOUGH_RESOURCES:
            this.memory.working = false;
            break;
          case ERR_FULL:
            this.drop(RESOURCE_ENERGY);
            break;
          case ERR_NOT_IN_RANGE:
            // TODO: Log errors
            this.moveTo(spawn);
            break;
        }

        return;
      }

      switch (this.transfer(storage, RESOURCE_ENERGY)) {
        // TODO: Is ERR_NOT_ENOUGH_RESOURCES needed?
        case OK:
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_FULL:
          this.drop(RESOURCE_ENERGY);
          break;
        case ERR_NOT_IN_RANGE:
          // TODO: Log errors
          this.moveTo(storage);
          break;
      };

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
          // TODO: Log errors
          this.moveTo(container.pos);
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
          // TODO: Log errors
          this.moveTo(energy.pos);
          break;
      }
    }
  }
}
