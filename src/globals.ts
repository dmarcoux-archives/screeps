// Declared in types.d.ts
export enum CreepRole {
  BasicHarvester = 'BasicHarvester',
  Harvester = 'Harvester',
  Upgrader = 'Upgrader',
  Builder = 'Builder',
  Repairer = 'Repairer',
  Hauler = 'Hauler',
  Supplier = 'Supplier'
}

// TODO: Do not hardcore the body parts, but use Room.energyCapacityAvailable to determine what we can spawn and when it can be spawned (when Room.energyAvailable >= body parts cost)
export const RoleBodies: Map<CreepRole, BodyPartConstant[]> = new Map<CreepRole, BodyPartConstant[]>([
  [CreepRole.BasicHarvester, [WORK, CARRY, CARRY, MOVE, MOVE]],
  [CreepRole.Harvester,      [WORK, WORK, MOVE]],
  [CreepRole.Upgrader,       [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Builder,        [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Repairer,       [WORK, WORK, CARRY, MOVE]],
  [CreepRole.Hauler,         [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
  [CreepRole.Supplier,       [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
]);

// Prefix message with Game.time
export function logMessage(message: string){
  console.log(`${Game.time} | ${message}`);
}
