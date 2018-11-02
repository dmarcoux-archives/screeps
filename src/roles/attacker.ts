import { logMessage } from 'globals';

// Creeps with the attacker role
export class Attacker extends Creep {
  constructor(id: string) {
    super(id);
  }

  // TODO: Do not depend on the presence of the attackFlag to attack hostile structures/creeps in the room where this creep is
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

    let hostileStructure: Structure | null = attackFlag.pos.lookFor(LOOK_STRUCTURES)[0];

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

    const hostileCreep: Creep | null = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (hostileCreep) {
      switch (this.attack(hostileCreep)) {
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          this.moveTo(hostileCreep.pos);
          break;
      }

      return;
    }

    hostileStructure = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);

    if (hostileStructure) {
      switch (this.attack(hostileStructure)) {
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          this.moveTo(hostileStructure.pos);
          break;
      }
    }
  }
}
