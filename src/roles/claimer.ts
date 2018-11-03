import { logMessage } from 'globals';

// Creeps with the claimer role
export class Claimer extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    const claimFlag: Flag | undefined = Game.flags.Claim;

    if (!claimFlag) {
      return;
    }

    // claimFlag.pos always work, no matter where the creep is (unlike claimFlag.room)
    if (this.room.name !== claimFlag.pos.roomName) {
      this.moveTo(claimFlag.pos);
      return;
    }

    // A construction site for a spawn is created once the controller belongs to me. It's not possible to do it on the same tick that the controller is claimed.
    if (this.room.controller!.my) {
      this.room.createConstructionSite(claimFlag.pos, STRUCTURE_SPAWN);

      // Place flag to call remote builders to build the spawn and other structures in this room
      // TODO: Check for errors
      this.room.createFlag(claimFlag.pos, 'RemoteBuild');
      const remoteBuildFlag: Flag = Game.flags.RemoteBuild;
      // These remote builders will come from the same room as the claimer
      remoteBuildFlag.memory.assignedRoom = this.memory.room;

      claimFlag.remove();

      return;
    }

    // TODO: Handle other return values?
    switch (this.claimController(this.room.controller!)) {
      case OK:
        // Destroy all hostile structures before creating construction site for spawn (otherwise it will fail if there's already an enemy spawn)
        const hostileStructures: Structure[] = this.room.find<Structure>(FIND_HOSTILE_STRUCTURES);
        for (const hostileStructure of hostileStructures) {
          // TODO: This doesn't handle ERR_BUSY (Hostile creeps are in the room)
          hostileStructure.destroy();
        }
        break;
      case ERR_INVALID_TARGET:
        // The controller is claimed/reserved by another player, so attack it!!!
        if (this.attackController(this.room.controller!) === OK) {
          // An owned controller cannot be attacked again for the next 1000 ticks and a creep with claim body parts only lives 600 ticks, so suicide to save CPU
          this.suicide();
        };
      case ERR_NOT_IN_RANGE:
        this.moveTo(this.room.controller!.pos);
        break;
      case ERR_GCL_NOT_ENOUGH:
        logMessage(`GCL is not enough to claim room ${this.room.name}`);
        break;
    }
  }
}
