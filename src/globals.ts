// Declared in types.d.ts
export enum CreepRole {
  BasicHarvester = 'BasicHarvester',
  Harvester = 'Harvester',
  Upgrader = 'Upgrader',
  Builder = 'Builder',
  Repairer = 'Repairer',
  Hauler = 'Hauler',
  Supplier = 'Supplier',
  Attacker = 'Attacker',
  Decoy = 'Decoy'
}

export const CreepSpawnPriority: CreepRole[] = [
  CreepRole.BasicHarvester,
  CreepRole.Harvester,
  CreepRole.Hauler,
  CreepRole.Upgrader,
  CreepRole.Builder,
  CreepRole.Repairer,
  CreepRole.Supplier,
  CreepRole.Attacker,
  CreepRole.Decoy
]

export const BodyPartSpawnOrder: BodyPartConstant[] = [
  TOUGH,
  CARRY,
  WORK,
  CLAIM,
  MOVE,
  ATTACK,
  RANGED_ATTACK,
  HEAL
]

// TODO: Adapt number of extra parts for haulers depending on the distance they need to cover
export const RoleBodies: Map<CreepRole, CreepBody> = new Map<CreepRole, CreepBody>([
  [CreepRole.BasicHarvester, { core: [WORK, CARRY, MOVE], extra: [CARRY, MOVE], maxExtra: 1 }],
  [CreepRole.Harvester,      { core: [WORK, WORK, MOVE], extra: [WORK], maxExtra: 3 }],
  [CreepRole.Upgrader,       { core: [WORK, CARRY, CARRY, MOVE, MOVE], extra: [WORK, CARRY, CARRY, MOVE, MOVE], maxExtra: 3 }],
  [CreepRole.Builder,        { core: [WORK, CARRY, MOVE], extra: [], maxExtra: 0 }],
  [CreepRole.Repairer,       { core: [WORK, CARRY, MOVE], extra: [], maxExtra: 0 }],
  [CreepRole.Hauler,         { core: [CARRY, MOVE, CARRY, MOVE], extra: [CARRY, MOVE], maxExtra: 1 }],
  [CreepRole.Supplier,       { core: [CARRY, MOVE, CARRY, MOVE], extra: [CARRY, MOVE], maxExtra: 1 }],
  [CreepRole.Attacker,       { core: [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK], extra: [TOUGH, TOUGH, MOVE, ATTACK], maxExtra: 4 }],
  [CreepRole.Decoy,          { core: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE], extra: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE], maxExtra: 1 }]
]);

// Prefix message with Game.time
export function logMessage(message: string){
  console.log(`${Game.time} | ${message}`);
}
