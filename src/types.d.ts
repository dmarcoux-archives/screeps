interface CreepMemory {
  moveTo: { x: number, y: number };
  role: string;
  room: string;
  sourceId: string; // For harvesters and haulers
  working: boolean;
}

// Defined in globals.ts
declare enum CreepRole {
  BasicHarvester = 'BasicHarvester',
  Harvester = 'Harvester',
  Upgrader = 'Upgrader',
  Builder = 'Builder',
  Repairer = 'Repairer',
  Hauler = 'Hauler',
  Supplier = 'Supplier'
}

interface RoomMemory {
  constructionSiteIds: string[];
  damagedStructureIds: string[];
  harvestedSourceIds: string[];
  hauledSourceIds: string[];
  sources: Array<{ id: string, containerPositionX: number, containerPositionY: number }>;
  spawnNames: string[];
  spawnQueue: Array<{ creepRole: CreepRole, memory: {} }>;
  towerIds: string[];
}
