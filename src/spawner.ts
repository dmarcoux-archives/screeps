import { CreepRole, Roles } from 'globals';

// Spawn creeps
export class Spawner {
  private currentCreeps: { [roleName: string]: number };
  private room: string;

  constructor(room: string) {
    this.room = room;

    // Calculate the number of creeps per role
    this.currentCreeps = {};
    // TODO: Is there a better way to compare the enums beside having to do `.valueOf()`
    this.currentCreeps[CreepRole.Harvester] = _.filter(Game.creeps, (creep) => creep.memory.role.valueOf() === CreepRole.Harvester.valueOf()).length;
    this.currentCreeps[CreepRole.Upgrader] = _.filter(Game.creeps, (creep) => creep.memory.role.valueOf() === CreepRole.Upgrader.valueOf()).length;
  }

  public spawnCreeps() {
    Roles.forEach((role, limit) => {
      if (this.currentCreeps[role] < limit) {
        const creepMemory: CreepMemory = { room: this.room, role, working: false };
        // TODO: Check if it errored (missing energy or whatever happens)
        // TODO: Don't hardcode body parts
        Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, creepMemory);
        console.log(this.room + ' SPAWNING ' + CreepRole[role]);
      }
    });
  }
}
