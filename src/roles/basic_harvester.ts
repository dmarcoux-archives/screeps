import { logMessage } from 'globals';

// Creeps with the basic harvester role
export class BasicHarvester extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      // TODO: Support multi-spawns
      const spawn: StructureSpawn = Game.spawns[this.room.memory.spawnNames[0]];

      switch(this.transfer(spawn, RESOURCE_ENERGY)) {
        // Ignore ERR_FULL to try to transfer again next tick
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(spawn) === OK) {
            logMessage(`${this.name} => Spawn`);
          }
          break;
      }

      return;
    }

    const source: Source = Game.getObjectById<Source>(this.memory.sourceId)!;

    switch (this.harvest(source)) {
      case ERR_NOT_IN_RANGE:
        if (this.moveTo(source.pos) === OK) {
          logMessage(`${this.name} => Source`);
        }
        break;
    }

    if (this.carry.energy === this.carryCapacity) {
      this.memory.working = true;
      return;
    }
  }
}
