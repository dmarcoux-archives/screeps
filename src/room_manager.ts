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
        constructionSiteIds: [],
        harvestedSourceIds: _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Harvester).map((memory) => memory.sourceId),
        hauledSourceIds: _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Hauler).map((memory) => memory.sourceId),
        sources: [],
        spawnNames: this.room.find(FIND_MY_SPAWNS).map((spawn) => spawn.name),
        spawnQueue: [],
        towerIds: this.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER }).map((tower) => tower.id)
      };
    }

    // TODO: Can only use the first spawn for now...
    this.spawner = new Spawner(this.room.name, Memory.rooms[this.room.name].spawnNames[0]);
  }

  public setup() {
    // The id of a construction site is available one tick after it was placed. This is why this is updated every tick.
    Memory.rooms[this.room.name].constructionSiteIds = this.room.find(FIND_MY_CONSTRUCTION_SITES).map((constructionSite) => constructionSite.id);

    // Store sources in memory and plan construction sites for them (roads between spawn and source, and container to drop resources)
    // TODO: Rebuid roads/containers if they get destroyed, maybe run this every X ticks
    if (Memory.rooms[this.room.name].sources.length === 0) {
      // TODO: Support multi-spawns
      const spawn: StructureSpawn = Game.spawns[Memory.rooms[this.room.name].spawnNames[0]];
      const sources: Source[] = this.room.find(FIND_SOURCES)

      for (const source of sources) {
        const pathSteps: PathStep[] = spawn.pos.findPathTo(source.pos);

        // Build container
        pathSteps.pop(); // The last path step is the source, nothing to build there
        const containerPathStep: PathStep = pathSteps.pop()!;

        Memory.rooms[this.room.name].sources.push({ id: source.id, containerPositionX: containerPathStep.x, containerPositionY: containerPathStep.y })
        const containerPosition: RoomPosition = new RoomPosition(containerPathStep.x, containerPathStep.y, this.room.name);
        this.room.createConstructionSite(containerPosition, STRUCTURE_CONTAINER);

        // Build roads
        for (const roadPathStep of pathSteps) {
          const roadPosition: RoomPosition = new RoomPosition(roadPathStep.x, roadPathStep.y, this.room.name);
          this.room.createConstructionSite(roadPosition, STRUCTURE_ROAD);
        }
      }
    }
  }

  // TODO: Prioritize harvesters and haulers (so put them first in the spawn queue, even if there are other creeps in the spawn queue)
  public spawnCreeps() {
    const sources: Array<{ id: string, containerPositionX: number, containerPositionY: number }> = Memory.rooms[this.room.name].sources;

    // TODO: This is not efficient, especially when having more and more creeps... It could perhaps be done in main.ts when we looped through creeps with Game.creeps
    const numberOfCreeps: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name).length;

    // Without creeps, we need one basic harvester to start
    // TODO: Check if the harvesters' containers have energy, if so spawn haulers instead
    if (numberOfCreeps === 0) {
      Memory.rooms[this.room.name].spawnQueue.unshift({ creepRole: CreepRole.BasicHarvester, memory: { sourceId: sources[0].id } });
    }

    // Are there enough harvesters, so one harvester per source?
    const harvestedSourceIds: string[] = Memory.rooms[this.room.name].harvestedSourceIds;
    if (harvestedSourceIds.length < sources.length) {
      const sourceWithoutHarvester: { id: string, containerPositionX: number, containerPositionY: number } = sources.filter((source) => !harvestedSourceIds.includes(source.id))[0];
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Harvester,
                                                     memory: {
                                                       moveTo: { x: sourceWithoutHarvester.containerPositionX, y: sourceWithoutHarvester.containerPositionY },
                                                       sourceId: sourceWithoutHarvester.id
                                                     }
                                                   });
      Memory.rooms[this.room.name].harvestedSourceIds.push(sourceWithoutHarvester.id);
    }

    // Are there enough haulers, so one hauler per source? (TODO: Adapt the number of haulers based on the distance to cover between the source and the drop point)
    const hauledSourceIds: string[] = Memory.rooms[this.room.name].hauledSourceIds;
    if (hauledSourceIds.length < sources.length) {
      const sourceWithoutHauler: string = sources.filter((source) => !hauledSourceIds.includes(source.id))[0].id;
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Hauler, memory: { sourceId: sourceWithoutHauler } });
      Memory.rooms[this.room.name].hauledSourceIds.push(sourceWithoutHauler);
    }

    const numberOfUpgraders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Upgrader).length;
    if (numberOfUpgraders < 5 && Memory.rooms[this.room.name].spawnQueue.findIndex((o) => o.creepRole === CreepRole.Upgrader) === -1) {
      Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Upgrader, memory: {} });
    }

    // Spawn builders if there are construction sites
    const constructionSiteIds: string[] = Memory.rooms[this.room.name].constructionSiteIds;
    if (constructionSiteIds.length > 0) {
      const numberOfBuilders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Builder).length;
      if (numberOfBuilders < 2 && Memory.rooms[this.room.name].spawnQueue.findIndex((o) => o.creepRole === CreepRole.Builder) === -1) {
        Memory.rooms[this.room.name].spawnQueue.push({ creepRole: CreepRole.Builder, memory: {} });
      }
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
  // TODO: List of enemies in room's memory so towers can focus on one
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
