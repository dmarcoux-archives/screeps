interface CreepMemory {
  moveTo: { x: number, y: number };
  role: string;
  room: string;
  sourceId: string; // For harvesters and haulers
  working: boolean;
}

// A creep's body has core parts (which are always needed) and extra parts (which are added `maxExtra` times when spawned)
interface CreepBody {
  core: BodyPartConstant[];
  extra: BodyPartConstant[];
  maxExtra: number;
}

// Defined in globals.ts
declare enum CreepRole {
  BasicHarvester = 'BasicHarvester',
  Harvester = 'Harvester',
  Upgrader = 'Upgrader',
  Builder = 'Builder',
  Repairer = 'Repairer',
  Hauler = 'Hauler',
  Supplier = 'Supplier',
  Attacker = 'Attacker',
  Decoy = 'Decoy',
  Claimer = 'Claimer',
  Defender = 'Defender',
  RemoteBuilder = 'RemoteBuilder'
}

interface RoomMemorySource {
  id: string;
  containerPositionX: number;
  containerPositionY: number;
  pathLengthToFromDrop: number;
}

interface RoomMemorySpawnQueue {
  creepRole: CreepRole;
  memory: {};
}

interface RoomMemory {
  constructionSiteIds: string[];
  damagedStructureIds: string[];
  harvestedSourceIds: string[];
  hauledSourceIds: string[];
  sources: RoomMemorySource[];
  spawnNames: string[];
  spawnQueue: RoomMemorySpawnQueue[];
  suppliedStructureIds: string[];
  towerIds: string[];
}
