import { BodyPartSpawnOrder, CreepRole, CreepSpawnPriority, logMessage, RoleBodies, sortByIndex } from 'globals';

// Spawn creeps
export class Spawner {
  private room: Room;
  private spawn: string;

  constructor(room: Room, spawn: string) {
    this.room = room;
    this.spawn = spawn;
  }

  // TODO: Spawn creep on demand just in time for a creep which will die (check creep.ticksToLive)
  public spawnCreeps() {
    // Sort the spawn queue based on the spawn priority
    const spawnQueue: RoomMemorySpawnQueue[] = this.room.memory.spawnQueue.sort((a, b) => sortByIndex(CreepSpawnPriority, a.creepRole, b.creepRole));

    if (spawnQueue.length === 0) {
      return
    }

    // TODO: Improve this. If spawn is busy, put (Game.time + wait) in memory to not run code for nothing
    const spawning: Spawning | null = Game.spawns[this.spawn].spawning;
    if (spawning) {
      return;
    }

    const creepRole: CreepRole = spawnQueue[0].creepRole;
    const creepBody: BodyPartConstant[] = this.createCreepBody(RoleBodies.get(creepRole)!);
    if (creepBody.length === 0) {
      return;
    }

    // Name creeps based on their role only if they are workers
    let creepName: string;
    if ([CreepRole.Attacker, CreepRole.Decoy, CreepRole.Defender].includes(creepRole)) {
      creepName = `vok5-${Game.time}`;
    }
    else {
      creepName = `${creepRole}-${Game.time}`;
    }

    // Add role specific memory to the standard memory
    const creepMemory: object = { memory: Object.assign(spawnQueue[0].memory, { room: this.room.name, role: creepRole, working: false }) };
    // Add creep memory to the spawn options (which are empty for now...)
    // TODO: Add energyStructures with spawns being first, then extensions (so extensions don't have to always be supplied)
    const spawnOptions: object = Object.assign(creepMemory, {});

    switch (Game.spawns[this.spawn].spawnCreep(creepBody, creepName, spawnOptions)) {
      case OK:
        logMessage(`${this.room.name} spawning ${creepRole}`);
        // The creep is spawning, so we can remove it from the beginning of the queue
        spawnQueue.shift();
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        logMessage(`${this.room.name} not enough energy to spawn ${creepRole}`);
        break;
    }
  }

  private creepBodyCost(bodyParts: BodyPartConstant[]): number {
    let cost: number = 0;

    for (const bodyPart of bodyParts) {
      cost += BODYPART_COST[bodyPart];
    }

    return cost;
  }

  private createCreepBody(body: CreepBody): BodyPartConstant[] {
    let creepBody: BodyPartConstant[] = body.core;

    if (this.creepBodyCost(creepBody) > this.room.energyAvailable) {
      // The creep body costs more than the available energy, return an empty array as it's not spawnable
      return [];
    }

    if (body.extra.length === 0 || body.maxExtra <= 0) {
      return creepBody;
    }

    let creepBodyWithExtra: BodyPartConstant[] = creepBody;
    for (let i = 0; i < body.maxExtra; i++) {
      creepBodyWithExtra = creepBodyWithExtra.concat(body.extra);

      if (this.creepBodyCost(creepBodyWithExtra) <= this.room.energyAvailable) {
        creepBody = creepBodyWithExtra;
        continue;
      }

      // The creep body cost is more than the available energy in the room, get out of the loop
      break;
    }

    // When a creep is hit, it loses body parts based on their order when it was spawned, so it's important to order them
    creepBody = creepBody.sort((a, b) => sortByIndex(BodyPartSpawnOrder, a, b));
    return creepBody;
  }
}
