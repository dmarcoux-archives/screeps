// Creeps with the harvester role
export class Harvester extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const moveTo: { x: number, y: number } = this.memory.moveTo;

    if (this.pos.x !== moveTo.x || this.pos.y !== moveTo.y) {
      // TODO: Log errors
      this.moveTo(moveTo.x, moveTo.y);
      return;
    }

    const source: Source = Game.getObjectById<Source>(this.memory.sourceId)!;

    // TODO: Log errors
    this.harvest(source);
  }
}
