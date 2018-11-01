import { logMessage } from 'globals';

// Creeps with the attacker role
export class Attacker extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    // TODO: Code this
    const attackerFlag: Flag = Game.flags.Attacker;
    if (!attackerFlag) {
      return;
    }

    // attackerFlag.pos always work, no matter where the creep is (unlike attackerFlag.room)
    if (this.room.name !== attackerFlag.pos.roomName) {
      this.moveTo(attackerFlag.pos);
      return;
    }

    // Find target at flag's position and attack it
    const hostileStructure: Structure = attackerFlag.pos.lookFor(LOOK_STRUCTURES)[0];

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
