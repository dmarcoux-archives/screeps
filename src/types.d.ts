interface CreepMemory {
  role: CreepRole;
  room: string;
  working: boolean;
}

declare enum CreepRole {
  None,
  Harvester,
  Upgrader
}

// TODO: Is it needed?
interface Memory {
  uuid: number;
  log: any;
}
