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

// Buildable structures which aren't listed here have all the same priority
export const BuildableStructurePriority: BuildableStructureConstant[] = [
  STRUCTURE_SPAWN,
  STRUCTURE_CONTAINER,
  STRUCTURE_TOWER,
  STRUCTURE_EXTENSION,
]

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
  Defender = 'Defender',
  RemoteBuilder = 'RemoteBuilder',
  Reserver = 'Reserver'
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
  CreepRole.Defender,
  CreepRole.RemoteBuilder,
  CreepRole.Reserver
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
  [CreepRole.Defender,       { core: [TOUGH, TOUGH, MOVE, MOVE, ATTACK], extra: [MOVE, ATTACK], maxExtra: 1 }],
  [CreepRole.RemoteBuilder,  { core: [WORK, CARRY, MOVE, WORK, CARRY, MOVE], extra: [WORK, CARRY, MOVE], maxExtra: 1 }],
  [CreepRole.Reserver,       { core: [MOVE, CLAIM, CLAIM], extra: [], maxExtra: 0 }],
]);


// Prefix message with Game.time
// TODO: Enable/Disable log messages for specific rooms only if there is a log flag in that room
export function logMessage(message: string){
  console.log(`${Game.time} | ${message}`);
}

export function sortByIndex<Type>(array: Type[], A: Type, B: Type): number {
  const indexOfA: number = array.indexOf(A);
  const indexOfB: number = array.indexOf(B);

  if (indexOfA === -1 && indexOfB === -1) {
    // Don't change the order since A and B are both not in the array
    return 0;
  }

  if (indexOfA === -1) {
    // A is not in the array, but B is, so B must be placed before A
    return 1;
  }

  if (indexOfB === -1) {
    // B is not in the array, but A is, so A must be placed before B
    return -1;
  }

  // A and B are both in the array, so compare their index
  return indexOfA - indexOfB;
}
