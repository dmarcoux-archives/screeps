// Creeps with the repairer role
export class Repairer {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      if (this.self.carry.energy === 0) {
        this.self.memory.working = false;
      } else {
        const repairSite = this.self.pos.findClosestByPath(
          FIND_STRUCTURES,
          {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
          }
        );

        if (repairSite && this.self.repair(repairSite) === ERR_NOT_IN_RANGE) {
          if (this.self.moveTo(repairSite.pos) === OK) {
            console.log(`${this.self.name} => Repair Site`);
          }
        }
        else {
          // TODO: DRY this (duplicated code from builder)
          // Act as a builder if there is nothing to repair
          const constructionSite = this.self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

          if (constructionSite && this.self.build(constructionSite) === ERR_NOT_IN_RANGE) {
            if (this.self.moveTo(constructionSite.pos) === OK) {
              console.log(`${this.self.name} => Construction Site`);
            }
          }
        }
      }
    }
    else {
      if (this.self.carry.energy === this.self.carryCapacity) {
        this.self.memory.working = true;
      } else {
        const source = this.self.pos.findClosestByPath(FIND_SOURCES);

        if (source && this.self.harvest(source) === ERR_NOT_IN_RANGE) {
          if (this.self.moveTo(source.pos) === OK) {
            console.log(`${this.self.name} => Source`);
          }
        }
      }
    }
  }
}
