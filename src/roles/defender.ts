import { logMessage } from 'globals';

// Creeps with the defender role
export class Defender extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const defendFlag: Flag | undefined = Game.flags.Defend;

    if (!defendFlag) {
      return;
    }

    // defendFlag.pos always work, no matter where the creep is (unlike defendFlag.room)
    if (this.room.name !== defendFlag.pos.roomName) {
      this.moveTo(defendFlag.pos);
      return;
    }

    // Find hostile creep in range of flag's position and attack it
    const hostileCreep: Creep | null = defendFlag.pos.findInRange(FIND_HOSTILE_CREEPS, 2)[0];

    if (!hostileCreep ) {
      if (this.pos !== defendFlag.pos) {
        this.moveTo(defendFlag.pos);
      }

      return;
    }

    switch (this.attack(hostileCreep)) {
      case OK:
        break;
      case ERR_NOT_IN_RANGE:
        this.moveTo(hostileCreep.pos);
        break;
    }
  }
}
