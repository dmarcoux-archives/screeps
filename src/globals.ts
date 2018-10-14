export enum CreepRole {
  None,
  Harvester,
  Upgrader,
  Builder
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([
  [CreepRole.Harvester, 5],
  [CreepRole.Upgrader, 5],
  [CreepRole.Builder, 1]
]);
