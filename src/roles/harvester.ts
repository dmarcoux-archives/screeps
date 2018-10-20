import { logMessage } from 'globals';

// Creeps with the harvester role
export class Harvester {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    const moveTo: { x: number, y: number } = this.self.memory.moveTo;

    if (this.self.pos.x === moveTo.x && this.self.pos.y === moveTo.y) {
      const source: Source | null = Game.getObjectById(this.self.memory.sourceId);

      if (source) {
        switch (this.self.harvest(source)) {
          case ERR_NOT_IN_RANGE:
            logMessage(`${this.self.name} => Source`);
            break;
        }
      }
    }
    else {
      this.self.moveTo(moveTo.x, moveTo.y);
    }
  }
}
