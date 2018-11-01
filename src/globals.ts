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
  Decoy = 'Decoy',
  Claimer = 'Claimer',
  Defender = 'Defender'
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
  CreepRole.Decoy,
  CreepRole.Claimer,
  CreepRole.Defender
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
  [CreepRole.Upgrader,       { core: [WORK, CARRY, CARRY, MOVE, MOVE], extra: [WORK, CARRY, MOVE], maxExtra: 4 }],
  [CreepRole.Builder,        { core: [WORK, CARRY, MOVE], extra: [], maxExtra: 0 }],
  [CreepRole.Repairer,       { core: [WORK, CARRY, MOVE], extra: [], maxExtra: 0 }],
  [CreepRole.Hauler,         { core: [CARRY, MOVE, CARRY, MOVE], extra: [CARRY, MOVE], maxExtra: 1 }],
  [CreepRole.Supplier,       { core: [CARRY, MOVE, CARRY, MOVE], extra: [CARRY, MOVE], maxExtra: 1 }],
  [CreepRole.Attacker,       { core: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK], extra: [MOVE, MOVE, ATTACK, ATTACK], maxExtra: 3 }],
  [CreepRole.Decoy,          { core: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE], extra: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE], maxExtra: 1 }],
  [CreepRole.Claimer,        { core: [MOVE, CLAIM], extra: [], maxExtra: 0 }],
  [CreepRole.Defender,       { core: [TOUGH, TOUGH, MOVE, MOVE, ATTACK], extra: [MOVE, ATTACK], maxExtra: 1 }]
]);

// Prefix message with Game.time
// TODO: Enable/Disable log messages for specific rooms only if there is a log flag in that room
export function logMessage(message: string){
  console.log(`${Game.time} | ${message}`);
}
