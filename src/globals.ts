export enum CreepRole {
  Harvester,
  Upgrader,
  Builder,
  Repairer
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([
  [CreepRole.Harvester, 2],
  [CreepRole.Upgrader,  5],
  [CreepRole.Builder,   8],
  [CreepRole.Repairer,  2]
]);

// TODO: Could the Map be a type?
export const RoleBodies: Map<CreepRole, BodyPartConstant[]> = new Map<CreepRole, BodyPartConstant[]>([
  [CreepRole.Harvester, [WORK, WORK, MOVE]],
  [CreepRole.Upgrader,  [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Builder,   [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Repairer,  [WORK, WORK, CARRY, MOVE]],
]);
