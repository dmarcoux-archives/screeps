import { logMessage, RoleBodies, Roles } from 'globals';

// TODO: Spawn creep on demand just in time for a creep which will die (check creep.ticksToLive)

// Spawn creeps
export class Spawner {
  private room: string;
  private spawn: string;

  constructor(room: string, spawn: string) {
    this.room = room;
    this.spawn = spawn;
  }

  public spawnCreeps() {
    // TODO: Improve this. If spawn is busy, put (Game.time + wait) in memory to not run code for nothing
    const spawning: Spawning | null = Game.spawns[this.spawn].spawning;
    if (spawning) {
      return;
    }

    let message: string = 'Roles (Current/Target)';

    // TODO: Add priority for screeps to spawn depending on which screeps are alive
    // TODO: Add possibility to execute initialization code for a creep before it's spawned.
    //       For example, when spawning an harvester, check if a container is next to the source he will harvest. If not, place construction site
    for (const [role, targetNumber] of Roles) {
      const currentNumber: number = _.filter(Game.creeps, (creep) => creep.memory.role === role).length;
      message += ` | ${role}: ${currentNumber}/${targetNumber}`;

      if (currentNumber < targetNumber) {
        const creepBody: BodyPartConstant[] = RoleBodies.get(role)!;
        const creepName: string = `${role}-${Game.time}`;
        const options: object = { memory: { room: this.room, role, working: false } };

        switch (Game.spawns[this.spawn].spawnCreep(creepBody, creepName, options)) {
          case OK:
            logMessage(`${this.room} spawning ${role}`);
            break;
          case ERR_NOT_ENOUGH_ENERGY:
            logMessage(`${this.room} not enough energy to spawn ${role}`);
            break;
        }
      }
    }

    logMessage(message);
  }
}
