import { logMessage } from 'globals';

// Creeps with the harvester role
// TODO: - They drop the energy on the ground (room controller level 1) or in a container (room controller level 2+)
export class Harvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    let source: Source | null;
    if (this.self.memory.sourceId) {
      source = Game.getObjectById(this.self.memory.sourceId);
    }
    else {
      source = this.self.pos.findClosestByPath(FIND_SOURCES);
    }

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
