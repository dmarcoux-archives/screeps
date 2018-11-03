// Creeps with the remote builder role
// TODO: Switch to basic harvester or upgrade role once the spawn and containers are built
//       For this, change memory.
//         - basic harvester: set room to current room, switch role and set sourceId
//         - upgrader: set room to current room, switch role
export class RemoteBuilder extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    // Move to room with the remoteBuild flag
    const remoteBuildFlag: Flag | undefined = Game.flags.RemoteBuild;

    if (!remoteBuildFlag) {
      return;
    }

    // remoteBuildFlag.pos always work, no matter where the creep is (unlike remoteBuildFlag.room)
    if (this.room.name !== remoteBuildFlag.pos.roomName) {
      // TODO: Log errors
      this.moveTo(remoteBuildFlag.pos);
      return;
    }

    if (this.memory.working) {
      const constructionSiteIds: string[] = Memory.rooms[remoteBuildFlag.pos.roomName].constructionSiteIds;

      if (constructionSiteIds.length === 0) {
        return;
      }

      const constructionSite: ConstructionSite | null = Game.getObjectById<ConstructionSite>(constructionSiteIds[0]);

      if (constructionSite === null) {
        // Remove the construction site id from the memory
        Memory.rooms[remoteBuildFlag.pos.roomName].constructionSiteIds.splice(0, 1);

        return;
      }

      switch(this.build(constructionSite)) {
        case ERR_NOT_ENOUGH_RESOURCES:
          this.memory.working = false;
          break;
        case ERR_NOT_IN_RANGE:
          // TODO: Log errors
          this.moveTo(constructionSite.pos);
          break;
      }

      return;
    }

    const source: Source = this.pos.findClosestByRange(FIND_SOURCES)!;

    switch (this.harvest(source)) {
      case ERR_NOT_IN_RANGE:
        // TODO: Log errors
        this.moveTo(source.pos);
        break;
    }

    if (this.carry.energy === this.carryCapacity) {
      this.memory.working = true;
      return;
    }
  }
}
