interface CreepMemory {
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
  harvestedSourceIds: string[];
  hauledSourceIds: string[];
  sourceIds: string[];
  spawnNames: string[];
  spawnQueue: Array<{ creepRole: CreepRole, memory: {} }>;
  towerIds: string[];
}
