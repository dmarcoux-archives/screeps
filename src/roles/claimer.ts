import { logMessage } from 'globals';

// Creeps with the claimer role
export class Claimer extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      const constructionSiteIds: string[] = Memory.rooms[this.memory.room].constructionSiteIds;

      if (constructionSiteIds.length === 0) {
        // TODO: This is a naive approach to prevent creeps from blocking others
        const idleFlag: Flag = Game.flags.Idle;
        if (idleFlag) {
          this.moveTo(idleFlag.pos);
        }

        return;
      }

      const constructionSite: ConstructionSite | null = Game.getObjectById<ConstructionSite>(constructionSiteIds[0]);

      if (constructionSite === null) {
        // Remove the construction site id from the memory
        Memory.rooms[this.memory.room].constructionSiteIds.splice(0, 1);

        return;
      }

      switch(this.build(constructionSite)) {
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(constructionSite.pos) === OK) {
            logMessage(`${this.name} => Construction Site`);
          }
          break;
      }

      return;
    }

    const claimFlag: Flag = Game.flags.Claim;

    if (!claimFlag) {
      if (this.carry.energy === this.carryCapacity) {
        this.memory.working = true;
        return;
      }

      const source: Source = Game.getObjectById<Source>(this.memory.sourceId)!;

      switch (this.harvest(source)) {
        case ERR_NOT_IN_RANGE:
          if (this.moveTo(source.pos) === OK) {
            logMessage(`${this.name} => Source`);
          }
          break;
      }

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
        this.memory.working = true;
        // TODO: This will break in a room which doesn't sources
        this.memory.sourceId = this.pos.findClosestByPath(FIND_SOURCES)!.id;

        // TODO: Call in a squad of miners and builders to build the spawn and other structures
        break;
      case ERR_NOT_IN_RANGE:
        this.moveTo(this.room.controller!.pos);
        break;
    }
  }
}
