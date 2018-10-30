import { logMessage } from 'globals';

// Creeps with the decoy role
export class Decoy extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    // TODO: Don't hardcode flag name, store it in memory
    const decoyFlag: Flag = Game.flags['Decoy'];
    if (!decoyFlag) {
      return;
    }

    this.moveTo(decoyFlag.pos);
  }
}
