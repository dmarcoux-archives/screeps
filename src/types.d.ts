interface CreepMemory {
  role: string;
  room: string;
  sourceId: string;
  working: boolean;
}

interface RoomMemory {
  sourceIds: string[];
  towerIds: string[];
}
