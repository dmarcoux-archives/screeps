import { BasicHarvester } from "roles/basic_harvester";

export const BodyPartLetters: Map<string, BodyPartConstant> = new Map<string, BodyPartConstant>([
  ['M', MOVE],
  ['W', WORK],
  ['C', CARRY],
  ['A', ATTACK],
  ['R', RANGED_ATTACK],
  ['T', TOUGH],
  ['H', HEAL],
  ['X', CLAIM]
]);

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

export const CreepSpawnPriority: CreepRole[] = [
  CreepRole.BasicHarvester,
  CreepRole.Harvester,
  CreepRole.Hauler,
  CreepRole.Upgrader,
  CreepRole.Builder,
  CreepRole.Repairer,
  CreepRole.Supplier
]


// TODO: Do not hardcore the body parts, but use Room.energyCapacityAvailable to determine what we can spawn and when it can be spawned (when Room.energyAvailable >= body parts cost)
// The `string[]` contains a body string for each RCL (TODO: Define them... now it's mostly just the same except for harvester which is already defined)
export const RoleBodies: Map<CreepRole, string[]> = new Map<CreepRole, string[]>([
  [CreepRole.BasicHarvester, ['W2(CM)', 'W2(CM)', 'W2(CM)', 'W2(CM)', 'W2(CM)', 'W2(CM)', 'W2(CM)', 'W2(CM)']],
  [CreepRole.Harvester,      ['2WM', '5WM', '5WM', '5WM', '5WM', '5WM', '5WM', '5WM']],
  [CreepRole.Upgrader,       ['2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM']],
  [CreepRole.Builder,        ['2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM']],
  [CreepRole.Repairer,       ['2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM', '2WCM']],
  [CreepRole.Hauler,         ['3(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)']],
  [CreepRole.Supplier,       ['3(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)', '6(CM)']],
]);

// Prefix message with Game.time
export function logMessage(message: string){
  console.log(`${Game.time} | ${message}`);
}
