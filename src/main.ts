import { CreepRole } from 'globals';
import { Attacker, BasicHarvester, Builder, Decoy, Harvester, Hauler, Repairer, Supplier, Upgrader } from 'roles';
import { RoomManager } from 'room_manager';
import { ErrorMapper } from 'utils/ErrorMapper';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  for (const creepName in Memory.creeps) {
    if (creepName in Game.creeps) {
      // Creep is present, go to the next creep
      continue;
    }

    // Some creep roles rely on room memory and it needs to be deleted too before deleting the creep memory
    const creepMemory: CreepMemory = Memory.creeps[creepName];
    switch (creepMemory.role) {
      case CreepRole.Harvester:
        const harvestedSourceIdIndex: number = Memory.rooms[creepMemory.room].harvestedSourceIds.indexOf(creepMemory.sourceId);
        Memory.rooms[creepMemory.room].harvestedSourceIds.splice(harvestedSourceIdIndex, 1);
        break;
      case CreepRole.Hauler:
        const hauledSourceIdIndex: number = Memory.rooms[creepMemory.room].hauledSourceIds.indexOf(creepMemory.sourceId);
        Memory.rooms[creepMemory.room].hauledSourceIds.splice(hauledSourceIdIndex, 1);
        break;
    }

    delete Memory.creeps[creepName];
  }

  // Initialize Memory.rooms
  if (!(Memory.rooms)) {
    Memory.rooms = {};
  }

  for (const roomName in Game.rooms) {
    const room: RoomManager = new RoomManager(Game.rooms[roomName]);
    room.setup();
    room.spawnCreeps();
    room.defend();
  }

  // Make creeps work
  for (const creepName in Game.creeps) {
    const creep: Creep = Game.creeps[creepName];
    let creepWithRole;

    // TODO: Improve this
    switch(creep.memory.role) {
      case CreepRole.BasicHarvester:
        creepWithRole = new BasicHarvester(creep.id);
        break;
      case CreepRole.Harvester:
        creepWithRole = new Harvester(creep.id);
        break;
      case CreepRole.Upgrader:
        creepWithRole = new Upgrader(creep.id);
        break;
      case CreepRole.Builder:
        creepWithRole = new Builder(creep.id);
        break;
      case CreepRole.Repairer:
        creepWithRole = new Repairer(creep.id);
        break;
      case CreepRole.Hauler:
        creepWithRole = new Hauler(creep.id);
        break;
      case CreepRole.Supplier:
        creepWithRole = new Supplier(creep.id);
        break;
      case CreepRole.Attacker:
        creepWithRole = new Attacker(creep.id);
        break;
      case CreepRole.Decoy:
        creepWithRole = new Decoy(creep.id);
        break;
    }

    if (creepWithRole) {
      creepWithRole.work();
    }
  }
});
