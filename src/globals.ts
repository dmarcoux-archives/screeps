export enum CreepRole {
  Harvester = 'Harvester',
  Upgrader = 'Upgrader',
  Builder = 'Builder',
  Repairer = 'Repairer',
  Hauler = 'Hauler',
  Supplier = 'Supplier'
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([
  [CreepRole.Harvester, 2],
  [CreepRole.Upgrader,  6],
  [CreepRole.Builder,   2],
  [CreepRole.Repairer,  2],
  [CreepRole.Hauler,    2],
  [CreepRole.Supplier,  1],
]);

// TODO: Could the Map be a type?
export const RoleBodies: Map<CreepRole, BodyPartConstant[]> = new Map<CreepRole, BodyPartConstant[]>([
  [CreepRole.Harvester, [WORK, WORK, MOVE]],
  [CreepRole.Upgrader,  [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Builder,   [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Repairer,  [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Hauler,    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
  [CreepRole.Supplier,  [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
]);

// Prefix message with Game.time
export function logMessage(message: string){
  console.log(`${Game.time} | ${message}`);
}
