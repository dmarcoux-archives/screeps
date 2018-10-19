import { logMessage } from 'globals';

// Creeps with the harvester role
// TODO: - They drop the energy on the ground (room controller level 1) or in a container (room controller level 2+)
export class Harvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
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
