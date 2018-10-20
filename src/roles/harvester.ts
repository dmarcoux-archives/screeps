import { logMessage } from 'globals';

// Creeps with the harvester role
export class Harvester extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const moveTo: { x: number, y: number } = this.memory.moveTo;

    if (this.pos.x === moveTo.x && this.pos.y === moveTo.y) {
      const source: Source | null = Game.getObjectById(this.memory.sourceId);

      if (source) {
        switch (this.harvest(source)) {
          case ERR_NOT_IN_RANGE:
            logMessage(`${this.name} => Source`);
            break;
        }
      }
    }
    else {
      this.moveTo(moveTo.x, moveTo.y);
    }
  }
}
