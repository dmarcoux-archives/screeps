import { ConstructionAutomater } from 'construction_automater';
import { CreepRole, logMessage } from 'globals';
import { Spawner } from 'spawner';

export class RoomManager {
  private constructionAutomater: ConstructionAutomater;
  private room: Room;
  private spawner: Spawner;

  // TODO: For now, everything is there while I moved the code from main. Separate this
  constructor(room: Room) {
    this.constructionAutomater = new ConstructionAutomater(room);
    this.room = room;

    // TODO: this.room.memory needs to be manually deleted in-game to reset (whenever I add/change keys)
    if (Object.keys(this.room.memory).length === 0) {
      // TODO: Refresh towerIds when towers are built (how to do that?? maybe with the event log... but this must be CPU expensive)
      // TODO: Refresh spawnNames when spawns are built/destroyed
      this.room.memory = {
        constructionSiteIds: [],
        damagedStructureIds: this.room.find(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL }).map((structure) => structure.id),
        harvestedSourceIds: _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Harvester).map((memory) => memory.sourceId),
        hauledSourceIds: _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Hauler).map((memory) => memory.sourceId),
        sources: [],
        spawnNames: this.room.find(FIND_MY_SPAWNS).map((spawn) => spawn.name),
        spawnQueue: [],
        suppliedStructureIds: this.room.find(FIND_MY_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity }).map((structure) => structure.id),
        towerIds: this.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER }).map((tower) => tower.id)
      };
    }

    // TODO: Can only use the first spawn for now...
    this.spawner = new Spawner(this.room, this.room.memory.spawnNames[0]);
  }

  public setup() {
    // TODO: Update every X ticks?
    // The id of a construction site is available one tick after it was placed. This is why this is updated every tick.
    this.room.memory.constructionSiteIds = this.room.find(FIND_MY_CONSTRUCTION_SITES).map((constructionSite) => constructionSite.id);
    // Update the list of damaged/supplied structures and towers
    this.room.memory.damagedStructureIds = this.room.find(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL }).map((structure) => structure.id);
    this.room.memory.suppliedStructureIds = this.room.find(FIND_MY_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity }).map((structure) => structure.id);
    this.room.memory.towerIds = this.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER }).map((tower) => tower.id)

    this.constructionAutomater.setupSources();
  }

  public spawnCreeps() {
    // Don't spawn creeps if the room doesn't have a spawn yet
    if (this.room.memory.spawnNames.length === 0) {
      return;
    }

    const sources: RoomMemorySource[] = this.room.memory.sources;

    // TODO: This is not efficient, especially when having more and more creeps... It could perhaps be done in main.ts when we looped through creeps with Game.creeps
    const numberOfCreeps: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name).length;

    // Without creeps, we need one basic harvester to start
    // TODO: Check if the harvesters' containers have energy, if so spawn haulers instead
    if (numberOfCreeps === 0) {
      if (this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.BasicHarvester) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.BasicHarvester, memory: { sourceId: sources[0].id } });
      }
    }

    // Are there enough harvesters, so one harvester per source?
    const harvestedSourceIds: string[] = this.room.memory.harvestedSourceIds;
    if (harvestedSourceIds.length < sources.length) {
      const sourceWithoutHarvester: { id: string, containerPositionX: number, containerPositionY: number } = sources.filter((source) => !harvestedSourceIds.includes(source.id))[0];
      this.room.memory.spawnQueue.push({ creepRole: CreepRole.Harvester,
                                                     memory: {
                                                       moveTo: { x: sourceWithoutHarvester.containerPositionX, y: sourceWithoutHarvester.containerPositionY },
                                                       sourceId: sourceWithoutHarvester.id
                                                     }
                                                   });
      this.room.memory.harvestedSourceIds.push(sourceWithoutHarvester.id);
    }

    // Are there enough haulers, so at least one hauler per source?
    // TODO: Adapt the number of haulers based on the path to cover between the source and the drop point (RoomMemorySource.pathLengthToFromDrop)
    const hauledSourceIds: string[] = this.room.memory.hauledSourceIds;
    if (hauledSourceIds.length < sources.length) {
      const sourceWithoutHauler: string = sources.filter((source) => !hauledSourceIds.includes(source.id))[0].id;
      this.room.memory.spawnQueue.push({ creepRole: CreepRole.Hauler, memory: { sourceId: sourceWithoutHauler } });
      this.room.memory.hauledSourceIds.push(sourceWithoutHauler);
    }

    const numberOfUpgraders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Upgrader).length;
    if (numberOfUpgraders < 5 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Upgrader) === -1) {
      this.room.memory.spawnQueue.push({ creepRole: CreepRole.Upgrader, memory: {} });
    }

    // Spawn builders if there are construction sites
    const constructionSiteIds: string[] = this.room.memory.constructionSiteIds;
    if (constructionSiteIds.length > 0) {
      const numberOfBuilders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Builder).length;
      if (numberOfBuilders < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Builder) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Builder, memory: {} });
      }
    }

    // Spawn repairers if there are damaged structures to repair
    const damagedStructureIds: string[] = this.room.memory.damagedStructureIds;
    if (damagedStructureIds.length > 0) {
      const numberOfRepairers: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Repairer).length;
      if (numberOfRepairers < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Repairer) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Repairer, memory: {} });
      }
    }

    // Spawn suppliers if there are supplied structures
    const suppliedStructureIds: string[] = this.room.memory.suppliedStructureIds;
    if (suppliedStructureIds.length > 0) {
      const numberOfSuppliers: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Supplier).length;
      if (numberOfSuppliers < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Supplier) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Supplier, memory: {} });
      }
    }

    // Spawn decoys if there is a decoy flag
    // TODO: Check if the flag is assigned to the room (the flag's data should contain the room name)
    // TODO: Check when a decoy flag is placed, then read data from it to know how many decoys to spawn and where to send them
    const decoyFlag: Flag = Game.flags.Decoy;
    if (decoyFlag) {
      const numberOfDecoys: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Decoy).length;
      if (numberOfDecoys < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Decoy) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Decoy, memory: {} });
      }
    }

    // Spawn claimers if there is a claim flag
    // TODO: Check if the flag is assigned to the room (the flag's data should contain the room name)
    const claimFlag: Flag = Game.flags.Claim;
    if (claimFlag) {
      const numberOfClaimers: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Claimer).length;
      if (numberOfClaimers < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Claimer) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Claimer, memory: {} });
      }
    }

    // Spawn attackers if there is an attack flag
    // TODO: Check if the flag is assigned to the room (the flag's data should contain the room name)
    // TODO: Check when an attack flag is placed, then read data from it to know how many attackers to spawn and where to send them
    const attackFlag: Flag = Game.flags.Attack;
    if (attackFlag) {
      const numberOfAttackers: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Attacker).length;
      if (numberOfAttackers < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Attacker) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Attacker, memory: {} });
      }
    }

    // Spawn defenders if there is an defend flag
    // TODO: Check if the flag is assigned to the room (the flag's data should contain the room name)
    // TODO: Check when a defend flag is placed, then read data from it to know how many defenders to spawn and where to send them
    const defendFlag: Flag = Game.flags.Defend;
    if (defendFlag) {
      const numberOfDefenders: number = _.filter(Memory.creeps, (memory) => memory.room === this.room.name && memory.role === CreepRole.Defender).length;
      if (numberOfDefenders < 1 && this.room.memory.spawnQueue.findIndex((o) => o.creepRole === CreepRole.Defender) === -1) {
        this.room.memory.spawnQueue.push({ creepRole: CreepRole.Defender, memory: {} });
      }
    }

    this.spawner.spawnCreeps();
  }

  // Defend the room with towers, creeps if in alarm mode (TODO)
  // TODO: List of enemies in room's memory so towers can focus on one. Also avoid running this code if no enemies are present
  public defend() {
    const towerIds: string[] = this.room.memory.towerIds;

    if (towerIds.length === 0) {
      return;
    }

    for (const towerId of towerIds) {
      const tower: StructureTower | null = Game.getObjectById<StructureTower>(towerId);

      if (tower === null) {
        // Delete memory of missing/destroyed tower
        const towerIdIndex: number = this.room.memory.towerIds.indexOf(towerId);
        this.room.memory.towerIds.splice(towerIdIndex, 1);

        // Nothing more to do, go to next tower
        continue;
      }

      const target: Creep | null = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      if (target) {
        tower.attack(target);
      }
    }
  }
}
