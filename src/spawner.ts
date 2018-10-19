import { CreepRole, logMessage, RoleBodies } from 'globals';

// Spawn creeps
export class Spawner {
  private room: string;
  private spawn: string;

  constructor(room: string, spawn: string) {
    this.room = room;
    this.spawn = spawn;
  }

  // TODO: Spawn creep on demand just in time for a creep which will die (check creep.ticksToLive)
  // TODO: Add possibility to execute initialization code for a creep before it's spawned.
  //       For example, when spawning an harvester, check if a container is next to the source he will harvest. If not, place construction site
  public spawnCreeps() {
    const spawnQueue: Array<{ creepRole: CreepRole, memory: object }> = Memory.rooms[this.room].spawnQueue;

    if (spawnQueue.length > 0) {
      // TODO: Improve this. If spawn is busy, put (Game.time + wait) in memory to not run code for nothing
      const spawning: Spawning | null = Game.spawns[this.spawn].spawning;
      if (spawning) {
        return;
      }

      const creepRole: CreepRole = spawnQueue[0].creepRole;
      const creepBody: BodyPartConstant[] = RoleBodies.get(creepRole)!;
      const creepName: string = `${creepRole}-${Game.time}`;
      // Add role specific memory to the standard memory
      const creepMemory: object = { memory: Object.assign(spawnQueue[0].memory, { room: this.room, role: creepRole, working: false }) };
      // Add creep memory to the spawn options (which are empty for now...)
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
  }
}
