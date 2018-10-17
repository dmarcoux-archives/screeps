import { Spawner } from 'spawner';

export class RoomManager {
  private room: Room;
  private spawner: Spawner;

  // TODO: For now, everything is there while I moved the code from main. Separate this
  constructor(room: Room) {
    this.room = room;

    // TODO: Memory.rooms[this.room.name] needs to be manually deleted in-game to reset (whenever I add/change keys)
    if (!(Memory.rooms[this.room.name])) {
      // Store ids for sources and towers
      // TODO: Refresh towerIds when towers are built (how to do that?? maybe with the event log... but this must be CPU expensive)
      // TODO: Refresh spawnNames when spawns are built/destroyed
      Memory.rooms[this.room.name] = {
        sourceIds: this.room.find(FIND_SOURCES).map((source) => source.id),
        spawnNames: this.room.find(FIND_MY_SPAWNS).map((spawn) => spawn.name),
        towerIds: this.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER }).map((tower) => tower.id)
      };
    }

    // TODO: Can only use the first spawn for now...
    this.spawner = new Spawner(this.room.name, Memory.rooms[this.room.name].spawnNames[0]);
    this.spawner.spawnCreeps();

    for (const towerId of Memory.rooms[this.room.name].towerIds) {
      const tower: StructureTower | null = Game.getObjectById(towerId);

      if (tower) {
        const target: Creep | null = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (target) {
          tower.attack(target);
        }
      }
      else {
        // Delete memory of missing/destroyed tower
        const towerIdIndex: number = Memory.rooms[this.room.name].towerIds.indexOf(towerId);
        Memory.rooms[this.room.name].towerIds.splice(towerIdIndex, 1);
      }
    }
  }
}
