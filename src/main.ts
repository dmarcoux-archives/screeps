import { CreepRole } from 'globals';
import { Builder } from 'roles/builder';
import { Harvester } from 'roles/harvester';
import { Hauler } from 'roles/hauler';
import { Repairer } from 'roles/repairer';
import { Upgrader } from 'roles/upgrader';
import { Spawner } from 'spawner';
import { ErrorMapper } from 'utils/ErrorMapper';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
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

    // Initialize Memory.rooms
    if (!(Memory.rooms)) {
      Memory.rooms = {};
    }

    // Store source ids in memory if it's not already stored for this room
    // TODO: This needs to be manually deleted in-game to reset (whenever I change the keys)
    if (!(Memory.rooms[roomName])) {
      Memory.rooms[roomName] = { sourceIds: Game.rooms[roomName].find(FIND_SOURCES).map((source) => source.id) };
    }
  }

  const spawner: Spawner = new Spawner(room);
  spawner.spawnCreeps();

  // Make creeps work
  for (const creepName in Game.creeps) {
    const creep: Creep = Game.creeps[creepName];
    let creepWithRole;

    // TODO: Improve this
    switch(creep.memory.role) {
      case CreepRole.Harvester:
        creepWithRole = new Harvester(creep);
        break;
      case CreepRole.Upgrader:
        creepWithRole = new Upgrader(creep);
        break;
      case CreepRole.Builder:
        creepWithRole = new Builder(creep);
        break;
      case CreepRole.Repairer:
        creepWithRole = new Repairer(creep);
        break;
      case CreepRole.Hauler:
        creepWithRole = new Hauler(creep);
        break;
    }

    if (creepWithRole) {
      creepWithRole.work();
    }
  }
});
