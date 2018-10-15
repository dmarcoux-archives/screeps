import { CreepRole, logMessage, RoleBodies, Roles } from 'globals';

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
      // TODO: Is there a better way to compare the enums beside having to do `.valueOf()`
      const currentNumber: number = _.filter(Game.creeps, (creep) => creep.memory.role.valueOf() === role.valueOf()).length;
      message += ` | ${CreepRole[role]}: ${currentNumber}/${targetNumber}`;

      if (currentNumber < targetNumber) {
        const creepBody: BodyPartConstant[] = RoleBodies.get(role)!;
        const creepName: string = `${CreepRole[role]}-${Game.time}`;
        const options: object = { memory: { room: this.room, role, working: false } };

        if (Game.spawns.Spawn1.spawnCreep(creepBody, creepName, options) === OK) {
          logMessage(`${this.room} spawning ${CreepRole[role]}`);
        }
      }
    }

    logMessage(message);
  }
}
