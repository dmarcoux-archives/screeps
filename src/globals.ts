export enum CreepRole {
  Harvester,
  Upgrader,
  Builder,
  Repairer,
  Hauler
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([
  [CreepRole.Harvester, 2],
  [CreepRole.Upgrader,  5],
  [CreepRole.Builder,   2],
  [CreepRole.Repairer,  2],
  [CreepRole.Hauler,    4],
]);

// TODO: Could the Map be a type?
export const RoleBodies: Map<CreepRole, BodyPartConstant[]> = new Map<CreepRole, BodyPartConstant[]>([
  [CreepRole.Harvester, [WORK, WORK, MOVE]],
  [CreepRole.Upgrader,  [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Builder,   [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Repairer,  [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Hauler,    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
]);
