import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // TODO: Spawn creeps

  // TODO: Upgrade controller

  // Make creeps work
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];

    if (creep.memory.working) {
      console.log(creepName + ' WORKING');

      if (creep.carry.energy === 0) {
        console.log(creepName + ' ENERGY EMPTY');

        creep.memory.working = false;
      } else {
        if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          console.log(creepName + ' MOVING TO SPAWN');
          creep.moveTo(Game.spawns.Spawn1);
        }
      }
    }
    else {
      console.log(creepName + ' NOT WORKING');

      if (creep.carry.energy === creep.carryCapacity) {
        console.log(creepName + ' ENERGY FULL');

        creep.memory.working = true;
      } else {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);

        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          console.log(creepName + ' MOVING TO SOURCE');
          creep.moveTo(source.pos);
        }
      }
    }
  }
});
