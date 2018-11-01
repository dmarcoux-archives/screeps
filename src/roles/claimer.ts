import { logMessage } from 'globals';

// Creeps with the claimer role
export class Claimer extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const claimFlag: Flag = Game.flags.Claim;

    if (!claimFlag) {
      return;
    }

    // claimFlag.pos always work, no matter where the creep is (unlike claimFlag.room)
    if (this.room.name !== claimFlag.pos.roomName) {
      this.moveTo(claimFlag.pos);
      return;
    }

    // TODO: Handle other return values?
    switch (this.claimController(this.room.controller!)) {
      case OK:
        // TODO: Destroy all hostile structures before creating construction site for spawn (otherwise it will fail if there's already an enemy spawn)
        const hostileStructures: Structure[] = this.room.find<Structure>(FIND_HOSTILE_STRUCTURES);
        for (const hostileStructure of hostileStructures) {
          // TODO: This doesn't handle ERR_BUSY (Hostile creeps are in the room)
          hostileStructure.destroy();
        }

        this.room.createConstructionSite(claimFlag.pos, STRUCTURE_SPAWN);
        claimFlag.remove();

        // TODO: Call in a squad of miners and builders to build the spawn and other structures
        break;
      case ERR_INVALID_TARGET:
        // The controller is claimed/reserved by another player, so attack it!!!
        this.attackController(this.room.controller!);
      case ERR_NOT_IN_RANGE:
        this.moveTo(this.room.controller!.pos);
        break;
    }
  }
}
