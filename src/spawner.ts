import { CreepRole, Roles } from 'globals';

// TODO: Spawn creep on demand just in time for a creep which will die (check creep.ticksToLive)

// Spawn creeps
export class Spawner {
  private room: string;

  constructor(room: string) {
    this.room = room;
  }

  public spawnCreeps() {
    for (const [role, targetNumber] of Roles) {
      // TODO: Is there a better way to compare the enums beside having to do `.valueOf()`
      const currentNumber: number = _.filter(Game.creeps, (creep) => creep.memory.role.valueOf() === role.valueOf()).length;
      console.log(`Role ${CreepRole[role]} - Current: ${currentNumber} - Target: ${targetNumber}`);

      if (currentNumber < targetNumber) {
        const creepBody: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];
        const creepName: string = `${CreepRole[role]}-${Game.time}`;
        const options: object = { memory: { room: this.room, role, working: false } };
        // TODO: Don't hardcode body parts
        if (Game.spawns.Spawn1.spawnCreep(creepBody, creepName, options) === OK) {
          console.log(`${this.room} spawning ${CreepRole[role]}`);
        }
      }
    }
  }
}
