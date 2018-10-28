import { BodyPartLetters, CreepRole, CreepSpawnPriority, logMessage, RoleBodies } from 'globals';

// Spawn creeps
export class Spawner {
  private room: string;
  private spawn: string;

  constructor(room: string, spawn: string) {
    this.room = room;
    this.spawn = spawn;
  }

  // TODO: Spawn creep on demand just in time for a creep which will die (check creep.ticksToLive)
  public spawnCreeps() {
    // Sort the spawn queue based on the spawn priority
    const spawnQueue: Array<{ creepRole: CreepRole, memory: object }> = Memory.rooms[this.room].spawnQueue.sort((a, b) => CreepSpawnPriority.indexOf(a.creepRole) - CreepSpawnPriority.indexOf(b.creepRole));

    if (spawnQueue.length === 0) {
      return
    }

    // TODO: Improve this. If spawn is busy, put (Game.time + wait) in memory to not run code for nothing
    const spawning: Spawning | null = Game.spawns[this.spawn].spawning;
    if (spawning) {
      return;
    }

    const creepRole: CreepRole = spawnQueue[0].creepRole;
    const creepBodyString: string = this.expandCreepBody(RoleBodies.get(creepRole)![0]);
    const creepBody: BodyPartConstant[] = this.createCreepBody(creepBodyString);
    // TODO: Use creepBodyCost to know which creep can be spawned based on the room's energy and controller level
    // const creepBodyCost: number = this.creepBodyCost(creepBody);
    const creepName: string = `${creepRole}-${Game.time}`;
    // Add role specific memory to the standard memory
    const creepMemory: object = { memory: Object.assign(spawnQueue[0].memory, { room: this.room, role: creepRole, working: false }) };
    // Add creep memory to the spawn options (which are empty for now...)
    // TODO: Add energyStructures with spawns being first, then extensions (so extensions don't have to always be supplied)
    const spawnOptions: object = Object.assign(creepMemory, {});

    switch (Game.spawns[this.spawn].spawnCreep(creepBody, creepName, spawnOptions)) {
      case OK:
        logMessage(`${this.room} spawning ${creepRole}`);
        // The creep is spawning, so we can remove it from the beginning of the queue
        spawnQueue.shift();
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        logMessage(`${this.room} not enough energy to spawn ${creepRole}`);
        break;
    }
  }

  // Credits to Orlet from chat.screeps.com for the original version in JavaScript
  private creepBodyCost(bodyParts: BodyPartConstant[]): number {
    let cost: number = 0;

    for (const bodyPart of bodyParts) {
      cost += BODYPART_COST[bodyPart];
    }

    return cost;
  }

  // Credits to Orlet from chat.screeps.com for the original version in JavaScript
  //   Example: this.expandCreepBody('2(CCM)2(AR)4X'); => 'CCMCCMARAR4X'
  private expandCreepBody(bodyString: string): string {
    const regExp: RegExp = /(\d+)\(([a-zA-Z]+)\)/;
    let match: RegExpExecArray | null;

    do {
      match = regExp.exec(bodyString);

      if (match) {
        const times = parseInt(match[1], 10);
        let expandedPartsGroup: string = "";

        for (let i = 0; i < times; i++) {
          expandedPartsGroup += match[2];
        }

        bodyString = bodyString.replace(match[0], expandedPartsGroup);
      }
    }
    while (match);

    return bodyString;
  }

  // Credits to Orlet from chat.screeps.com for the original version in JavaScript
  //   Example: this.createCreepBody('CCM'); => [CARRY, CARRY, MOVE]
  private createCreepBody(bodyString: string): BodyPartConstant[] {
    const body: BodyPartConstant[] = [];
    let partCounter: number = 1;

    for (const bodyPartString of bodyString) {
      if (!Number.isNaN(Number(bodyPartString))) {
        // The `partCounter - 1` is to deal correctly with numbers having more than one digit
        partCounter = (partCounter - 1) * 10 + parseInt(bodyPartString, 10);
        continue;
      }

      // TODO: For this to be sure it's really always defined, `body` should be validated before looping
      const bodyPart: BodyPartConstant = BodyPartLetters.get(bodyPartString)!;

      // Expand
      for (let i = 0; i < partCounter; i++) {
        body.push(bodyPart);
      }

      partCounter = 1;
    }

    return body;
  }
}
