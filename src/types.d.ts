interface CreepMemory {
  role: string;
  room: string;
  sourceId: string;
  working: boolean;
}

interface RoomMemory {
  sourceIds: string[];
  spawnNames: string[];
  towerIds: string[];
}
