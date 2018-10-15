interface CreepMemory {
  role: string;
  room: string;
  sourceId: string;
  working: boolean;
}

// TODO: Is it needed?
interface Memory {
  uuid: number;
  log: any;
}

interface RoomMemory {
  sourceIds: string[];
}
