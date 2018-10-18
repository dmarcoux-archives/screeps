export enum CreepRole {
  Harvester = 'Harvester',
  Upgrader = 'Upgrader',
  Builder = 'Builder',
  Repairer = 'Repairer',
  Hauler = 'Hauler',
  Supplier = 'Supplier'
}

// TODO: Do not depend on elements in the map to determine the spawn order
// TODO: Do not hardcode the number of creeps needed per role. Adapt it to the room and the needs
export const Roles: Map<CreepRole, number> = new Map<CreepRole, number>([
  [CreepRole.Harvester, 2],
  [CreepRole.Hauler,    2],
  [CreepRole.Upgrader,  5],
  [CreepRole.Builder,   5],
  [CreepRole.Repairer,  2],
  [CreepRole.Supplier,  1]
]);

// TODO: Do not hardcore the body parts, but use Room.energyCapacityAvailable to determine what we can spawn and when it can be spawned (when Room.energyAvailable >= body parts cost)
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
