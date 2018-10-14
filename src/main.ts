import { CreepRole } from 'globals';
import { Harvester } from 'roles/harvester';
import { Upgrader } from 'roles/upgrader';
import { Spawner } from 'spawner';
import { ErrorMapper } from 'utils/ErrorMapper';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // TODO: Store expansive operations (Game.creeps ???, etc...)

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // TODO: Use types everywhere

  // TODO: Deal with multiple rooms
  let room: string = '';
  for (const roomName in Game.rooms) {
    room = roomName;
  }

  const spawner: Spawner = new Spawner(room);
  spawner.spawnCreeps();

  // Make creeps work
  for (const creepName in Game.creeps) {
    const creep: Creep = Game.creeps[creepName];

    // TODO: Improve this
    switch(creep.memory.role.valueOf()) {
      case CreepRole.Harvester.valueOf():
        const harvester: Harvester = new Harvester(creep);
        harvester.work();
        break;
      case CreepRole.Upgrader.valueOf():
        const upgrader: Upgrader = new Upgrader(creep);
        upgrader.work();
        break;
    }
  }
});
