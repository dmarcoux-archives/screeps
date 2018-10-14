import { CreepRole, Roles } from 'globals';

// Spawn creeps
export class Spawner {
  private currentCreeps: Map<CreepRole, number>;
  private room: string;

  constructor(room: string) {
    this.room = room;

    // Calculate the number of creeps per role
    this.currentCreeps = new Map<CreepRole, number>();
    // TODO: Is there a better way to compare the enums beside having to do `.valueOf()`
    this.currentCreeps.set(CreepRole.Harvester, _.filter(Game.creeps, (creep) => creep.memory.role.valueOf() === CreepRole.Harvester.valueOf()).length);
    this.currentCreeps.set(CreepRole.Upgrader, _.filter(Game.creeps, (creep) => creep.memory.role.valueOf() === CreepRole.Upgrader.valueOf()).length);
  }

  public spawnCreeps() {
    for (const [role, limit] of Roles) {
      console.log(`Role ${CreepRole[role]} - Current: ${this.currentCreeps.get(role)!} - Limit: ${limit}`);
      if (this.currentCreeps.get(role)! < limit) {
        const creepBody: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];
        const creepName: string = `${CreepRole[role]}-${Game.time}`;
        const options: object = { memory: { room: this.room, role, working: false } };
        // TODO: Check if it errored (missing energy or whatever happens)
        // TODO: Don't hardcode body parts
        Game.spawns.Spawn1.spawnCreep(creepBody, creepName, options);
        console.log(`${this.room} spawning ${CreepRole[role]}`);
      }
    }
  }
}
