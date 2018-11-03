// Creeps with the decoy role
export class Decoy extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const decoyFlag: Flag | undefined = Game.flags.Decoy;
    if (!decoyFlag) {
      return;
    }

    // TODO: Log errors
    this.moveTo(decoyFlag.pos);
  }
}
