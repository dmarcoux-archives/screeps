export enum CreepRole {
  None,
  Harvester,
  Upgrader,
  Builder,
  Repairer
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([
  [CreepRole.Harvester, 5],
  [CreepRole.Upgrader,  5],
  [CreepRole.Builder,   1],
  [CreepRole.Repairer,  1]
]);

// TODO: Could the Map be a type?
export const RoleBodies: Map<CreepRole, BodyPartConstant[]> = new Map<CreepRole, BodyPartConstant[]>([
  [CreepRole.Harvester, [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Upgrader,  [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Builder,   [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Repairer,  [WORK, WORK, CARRY, MOVE]],
]);
