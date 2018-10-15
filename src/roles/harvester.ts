import { logMessage } from 'globals';

// Creeps with the harvester role
// TODO: - They drop the energy on the ground (room controller level 1) or in a container (room controller level 2+)
export class Harvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    // TODO: Could this check be done only once, just after spawning?
    if (!(this.self.memory.sourceId)) {
      const busySourceIds: string[] = _.filter(Memory.creeps, (memory) => memory.role === this.self.memory.role && memory.room === this.self.memory.room && memory.sourceId).map((memory) => memory.sourceId);
      // TODO: Could it be more efficient?
      const freeSourceIds: string = Memory.rooms[this.self.memory.room].sourceIds.filter((value) => !busySourceIds.includes(value))[0];

      this.self.memory.sourceId = freeSourceIds;
    }

    const source: Source | null = Game.getObjectById(this.self.memory.sourceId);

    if (source) {
      switch (this.self.harvest(source)) {
        // TODO: Is this needed?
        // case OK:
        //   this.self.memory.working = true;
        //   break;
        case ERR_NOT_IN_RANGE:
          if (this.self.moveTo(source.pos) === OK) {
            logMessage(`${this.self.name} => Source`);
          }
          break;
      }
    }
  }
}
