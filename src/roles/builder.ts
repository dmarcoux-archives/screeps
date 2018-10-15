// Creeps with the builder role
// TODO: Build roads between sources and spawn
// TODO: Build roads between sources and room controller
// TODO: Build walls/ramparts
// TODO: Build towers
export class Builder {
  private self: Creep;

  constructor(creep: Creep) {
    this.self = creep;
  }

  public work() {
    if (this.self.memory.working) {
      const constructionSite = this.self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

      if (constructionSite) {
        switch(this.self.build(constructionSite)) {
          case ERR_NOT_ENOUGH_RESOURCES:
            this.self.memory.working = false;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(constructionSite.pos) === OK) {
              console.log(`${this.self.name} => Construction Site`);
            }
            break;
        }
      }
      else if (this.self.room.controller) {
        switch(this.self.upgradeController(this.self.room.controller)) {
          case ERR_NOT_ENOUGH_RESOURCES:
            this.self.memory.working = false;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(this.self.room.controller.pos) === OK) {
              console.log(`${this.self.name} => Controller`);
            }
            break;
        }
      }
    }
    else {
      // TODO: Cache this in memory
      // TODO: Assign creep to a source, so it doesn't go back and forth between sources
      let energy: Resource<ResourceConstant> | null;
      energy = this.self.pos.findClosestByPath(
        FIND_DROPPED_RESOURCES,
        {
          filter: (resource) => resource.resourceType === RESOURCE_ENERGY && resource.amount >= this.self.carryCapacity
        }
      );
      if (energy) {
        switch (this.self.pickup(energy)) {
            // case OK:
            //   break;
          case ERR_FULL:
            this.self.memory.working = true;
            break;
          case ERR_NOT_IN_RANGE:
            if (this.self.moveTo(energy.pos) === OK) {
              console.log(`${this.self.name} => Energy`);
            }
            break;
        }
      }
    }
  }
}
