import { logMessage } from 'globals';

// Creeps with the harvester role
export class Harvester extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const moveTo: { x: number, y: number } = this.memory.moveTo;

    if (this.pos.x !== moveTo.x || this.pos.y !== moveTo.y) {
      this.moveTo(moveTo.x, moveTo.y);
      return;
    }

    const source: Source = Game.getObjectById<Source>(this.memory.sourceId)!;

    switch (this.harvest(source)) {
      case ERR_NOT_IN_RANGE:
        logMessage(`${this.name} => Source`);
        break;
    }
  }
}
