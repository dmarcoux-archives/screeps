export enum CreepRole {
  None,
  Harvester,
  Upgrader
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([[CreepRole.Harvester, 5], [CreepRole.Upgrader, 5]]);
