import { CreepRole, logMessage } from 'globals';
import { Spawner } from 'spawner';

export class RoomManager {
  private room: Room;
  private spawner: Spawner;

  // TODO: For now, everything is there while I moved the code from main. Separate this
  constructor(room: Room) {
    this.room = room;

    // TODO: Memory.rooms[this.room.name] needs to be manually deleted in-game to reset (whenever I add/change keys)
    if (!(Memory.rooms[this.room.name])) {
      // TODO: Refresh towerIds when towers are built (how to do that?? maybe with the event log... but this must be CPU expensive)
      // TODO: Refresh spawnNames when spawns are built/destroyed
      Memory.rooms[this.room.name] = {
        harvestedSourceIds: _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Harvester).map((memory) => memory.sourceId),
        hauledSourceIds: _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Hauler).map((memory) => memory.sourceId),
        sourceIds: this.room.find(FIND_SOURCES).map((source) => source.id),
        spawnNames: this.room.find(FIND_MY_SPAWNS).map((spawn) => spawn.name),
        spawnQueue: [],
        towerIds: this.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER }).map((tower) => tower.id)
      };
    }

    // TODO: Can only use the first spawn for now...
    this.spawner = new Spawner(this.room.name, Memory.rooms[this.room.name].spawnNames[0]);
  }

  // TODO: Prioritize harvesters and haulers (so put them first in the spawn queue, even if there are other creeps in the spawn queue)
  public spawnCreeps() {
    const sourceIds: string[] = Memory.rooms[this.room.name].sourceIds;

    // TODO: This is not efficient, especially when having more and more creeps... It could perhaps be done in main.ts when we looped through creeps with Game.creeps
    const numberOfCreeps: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name).length;

    // Without creeps, we need one basic harvester to start
    // TODO: Check if the harvesters' containers have energy, if so spawn haulers instead
    if (numberOfCreeps === 0) {
      Memory.rooms[this.room.name].spawnQueue.unshift({ creepRole: CreepRole.BasicHarvester, memory: { sourceId: sourceIds[0] } });
    }

    // Are there enough harvesters, so one harvester per source?
    const harvestedSourceIds: string[] = Memory.rooms[this.room.name].harvestedSourceIds;
    if (harvestedSourceIds.length < sourceIds.length) {
      const sourcesWithoutHarvester: string[] = sourceIds.filter((sourceId) => !harvestedSourceIds.includes(sourceId));
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Harvester, memory: { sourceId: sourcesWithoutHarvester[0] } });
      Memory.rooms[this.room.name].harvestedSourceIds.push(sourcesWithoutHarvester[0]);
    }

    // Are there enough haulers, so one hauler per source? (TODO: Adapt the number of haulers based on the distance to cover between the source and the drop point)
    const hauledSourceIds: string[] = Memory.rooms[this.room.name].hauledSourceIds;
    if (hauledSourceIds.length < sourceIds.length) {
      const sourcesWithoutHauler: string[] = sourceIds.filter((sourceId) => !hauledSourceIds.includes(sourceId));
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Hauler, memory: { sourceId: sourcesWithoutHauler[0] } });
      Memory.rooms[this.room.name].hauledSourceIds.push(sourcesWithoutHauler[0]);
    }

    const numberOfUpgraders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Upgrader).length;
    if (numberOfUpgraders < 5 && Memory.rooms[this.room.name].spawnQueue.findIndex((o) => o.creepRole === CreepRole.Upgrader) === -1) {
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Upgrader, memory: {} });
    }

    // TODO: Spawn builders if there are construction sites
    const numberOfBuilders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Builder).length;
    if (numberOfBuilders < 0 && Memory.rooms[this.room.name].spawnQueue.findIndex((o) => o.creepRole === CreepRole.Builder) === -1) {
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Builder, memory: {} });
    }

    // TODO: Spawn repairers if there are structures to repair
    const numberOfRepairers: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Repairer).length;
    if (numberOfRepairers < 0 && Memory.rooms[this.room.name].spawnQueue.findIndex((o) => o.creepRole === CreepRole.Repairer) === -1) {
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Repairer, memory: {} });
    }

    // TODO: Spawn suppliers if there are structures to supply (extensions, towers, etc...)
    const numberOfSuppliers: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Supplier).length;
    if (numberOfSuppliers < 0 && Memory.rooms[this.room.name].spawnQueue.findIndex((o) => o.creepRole === CreepRole.Supplier) === -1) {
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Supplier, memory: {} });
    }

    this.spawner.spawnCreeps();
  }

  // Defend the room with towers, creeps if in alarm mode (TODO)
  public defend() {
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
