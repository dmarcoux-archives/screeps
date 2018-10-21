import { logMessage } from 'globals';

// Creeps with the repairer role
export class Repairer extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    if (this.memory.working) {
      const damagedStructureIds: string[] = Memory.rooms[this.memory.room].damagedStructureIds;

      if (damagedStructureIds.length > 0) {
        const damagedStructure: Structure | null = Game.getObjectById(damagedStructureIds[0]);
        if (damagedStructure) {
          switch(this.repair(damagedStructure)) {
            case ERR_NOT_ENOUGH_RESOURCES:
              this.memory.working = false;
              break;
            case ERR_NOT_IN_RANGE:
              if (this.moveTo(damagedStructure.pos) === OK) {
                logMessage(`${this.name} => Damaged Structure`);
              }
              break;
          }
        }
        else {
          // TODO: DRY this (duplicated code from builder)
          // Act as a builder if there is nothing to repair
          const constructionSite: ConstructionSite | null = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

          if (constructionSite) {
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
          }
        }
      }
    }
    else {
      // TODO: Cache this in memory
      // TODO: Instead of RoomPosition.findInRange (medium CPU cost), use Room.lookForAtArea (low CPU cost)
      const energy: Resource<ResourceConstant> | null = _.max(Game.spawns.Spawn1.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (resource) => resource.resourceType === RESOURCE_ENERGY }), (resource) => resource.amount);

      if (energy) {
        switch (this.pickup(energy)) {
            // case OK:
            //   break;
          case ERR_FULL:
            this.memory.working = true;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.moveTo(energy.pos) === OK) {
              logMessage(`${this.name} => Energy`);
            }
            break;
        }
      }
    }
  }
}
