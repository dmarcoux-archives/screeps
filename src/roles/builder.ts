// Creeps with the builder role
export class Builder {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      if (this.self.carry.energy === 0) {
        this.self.memory.working = false;
      } else {
        const constructionSite = this.self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        if (constructionSite && this.self.build(constructionSite) === ERR_NOT_IN_RANGE) {
          console.log(`${this.self.name} => Construction Site`);
          this.self.moveTo(constructionSite.pos);
        }
        else if (this.self.room.controller && this.self.upgradeController(this.self.room.controller) === ERR_NOT_IN_RANGE) {
            console.log(`${this.self.name} => Controller`);
            this.self.moveTo(this.self.room.controller.pos);
        }
      }
    }
    else {
      if (this.self.carry.energy === this.self.carryCapacity) {
        this.self.memory.working = true;
      } else {
        const source = this.self.pos.findClosestByPath(FIND_SOURCES);

        if (source && this.self.harvest(source) === ERR_NOT_IN_RANGE) {
          console.log(`${this.self.name} => Source`);
          this.self.moveTo(source.pos);
        }
      }
    }
  }
}
