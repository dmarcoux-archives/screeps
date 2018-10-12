export enum CreepRole {
  None,
  Harvester,
  Upgrader
}

// TODO: Could the Map be a type?
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([[CreepRole.Harvester, 2], [CreepRole.Upgrader, 2]]);
