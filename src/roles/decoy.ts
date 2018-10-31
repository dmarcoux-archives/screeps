import { logMessage } from 'globals';

// Creeps with the decoy role
export class Decoy extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const decoyFlag: Flag = Game.flags.Decoy;
    if (!decoyFlag) {
      return;
    }

    this.moveTo(decoyFlag.pos);
  }
}
