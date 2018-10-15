import { logMessage, RoleBodies, Roles } from 'globals';

// TODO: Spawn creep on demand just in time for a creep which will die (check creep.ticksToLive)

// Spawn creeps
export class Spawner {
  private room: string;

  constructor(room: string) {
    this.room = room;
  }

  public spawnCreeps() {
    let message: string = 'Roles (Current/Target)';

    // TODO: Add priority for screeps to spawn depending on which screeps are alive
    for (const [role, targetNumber] of Roles) {
      const currentNumber: number = _.filter(Game.creeps, (creep) => creep.memory.role === role).length;
      message += ` | ${role}: ${currentNumber}/${targetNumber}`;

      if (currentNumber < targetNumber) {
        const creepBody: BodyPartConstant[] = RoleBodies.get(role)!;
        const creepName: string = `${role}-${Game.time}`;
        const options: object = { memory: { room: this.room, role, working: false } };

        switch (Game.spawns.Spawn1.spawnCreep(creepBody, creepName, options)) {
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
