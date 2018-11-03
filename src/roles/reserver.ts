// Creeps with the reserver role
export class Reserver extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const reserveFlag: Flag | undefined = Game.flags.Reserve;

    if (!reserveFlag) {
      return;
    }

    // reserveFlag.pos always work, no matter where the creep is (unlike reserveFlag.room)
    if (this.room.name !== reserveFlag.pos.roomName) {
      // TODO: Log errors
      this.moveTo(reserveFlag.pos);
      return;
    }

    // TODO: Handle other return values?
    switch (this.reserveController(this.room.controller!)) {
      case ERR_INVALID_TARGET:
        // TODO: Check if controller is claimed or only reserved. If only reserved, it can be attacked more
        // The controller is claimed/reserved by another player, so attack it!!!
        // if (this.attackController(this.room.controller!) === OK) {
          // TODO: And set next possible tick to attack in flag's memory, so a creep can be spawn when needed
          // An owned controller cannot be attacked again for the next 1000 ticks and a creep with claim body parts only lives 600 ticks, so suicide to save CPU
          // this.suicide();
        // };
        break;
      case ERR_NOT_IN_RANGE:
        this.moveTo(this.room.controller!.pos);
        break;
    }
  }
}
