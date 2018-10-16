import { Spawner } from 'spawner';

export class RoomManager {
  private room: Room;
  private spawner: Spawner;

  // TODO: For now, everything is there while I moved the code from main. Separate this
  constructor(room: Room) {
    this.room = room;

    // TODO: Do not do this for every room created
    // Initialize Memory.rooms
    if (!(Memory.rooms)) {
      Memory.rooms = {};
    }

    // Store source ids in memory if it's not already stored for this room
    // TODO: This needs to be manually deleted in-game to reset (whenever I change the keys)
    if (!(Memory.rooms[this.room.name])) {
      Memory.rooms[this.room.name] = { sourceIds: this.room.find(FIND_SOURCES).map((source) => source.id) };
    }

    this.spawner = new Spawner(this.room.name);
    this.spawner.spawnCreeps();

    // TODO: Store towers.id in memory and retrieve them with Game.getObjectById instead of find
    const towers: StructureTower[] = this.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER });
    for (const tower of towers) {
      const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      if (target) {
        tower.attack(target);
      }
    }
  }
}
