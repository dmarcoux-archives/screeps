import { logMessage } from 'globals';

// Creeps with the attacker role
export class Attacker extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const attackFlag: Flag = Game.flags.Attack;

    if (!attackFlag) {
      return;
    }

    // attackFlag.pos always work, no matter where the creep is (unlike attackFlag.room)
    if (this.room.name !== attackFlag.pos.roomName) {
      this.moveTo(attackFlag.pos);
      return;
    }

    // Find target at flag's position and attack it
    const hostileStructure: Structure = attackFlag.pos.lookFor(LOOK_STRUCTURES)[0];

    if (hostileStructure) {
      switch (this.attack(hostileStructure)) {
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          this.moveTo(hostileStructure.pos);
          break;
      }

      return;
    }

    // TODO: Find hostile creeps or other structures and attack them
  }
}
