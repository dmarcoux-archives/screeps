// TODO: Construct roads to minerals and their extractor
// TODO: Construct roads between sources and room controller
// TODO: Construct walls/ramparts to block room entrances/exits and around controller
// TODO: Construct towers (one next to spawn, others...???)
// TODO: Construct extensions (next to a road close to the spawn. in a specific pattern?)
export class ConstructionAutomater {
  private room: Room;

  constructor(room: Room) {
    this.room = room;
  }

  // Store sources in memory and plan construction sites for them (roads between spawn and source, and container to drop resources)
  public setupSources() {
    // TODO: Rebuid roads/containers if they get destroyed, maybe run this every X ticks
    if (this.room.memory.sources.length === 0) {
      // TODO: Support multi-spawns
      const spawn: StructureSpawn = Game.spawns[this.room.memory.spawnNames[0]];
      const position: RoomPosition = (spawn || this.room.find(FIND_MY_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_SPAWN })[0]).pos;
      const sources: Source[] = this.room.find(FIND_SOURCES)

      for (const source of sources) {
        // TODO: Improve this... just too many ifs
        const builtContainer: StructureContainer = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, { filter: (structure) => structure.structureType === STRUCTURE_CONTAINER })[0];
        let pathSteps: PathStep[];
        if (builtContainer) {
          pathSteps = position.findPathTo(builtContainer.pos);
          pathSteps.pop(); // The last path step is the container, nothing to construct there
          this.room.memory.sources.push({ id: source.id, containerPositionX: builtContainer.pos.x, containerPositionY: builtContainer.pos.y, pathLengthToFromDrop: pathSteps.length });
        }
        else {
          const container: ConstructionSite = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, { filter: (c) => c.structureType === STRUCTURE_CONTAINER })[0];
          if (container) {
            pathSteps = position.findPathTo(container.pos);
            pathSteps.pop(); // The last path step is the container, nothing to construct there
            this.room.memory.sources.push({ id: source.id, containerPositionX: container.pos.x, containerPositionY: container.pos.y, pathLengthToFromDrop: pathSteps.length });
          }
          else {
            pathSteps = position.findPathTo(source.pos);

            // Construct container
            pathSteps.pop(); // The last path step is the source, nothing to construct there
            const containerPathStep: PathStep = pathSteps.pop()!;

            this.room.memory.sources.push({ id: source.id, containerPositionX: containerPathStep.x, containerPositionY: containerPathStep.y, pathLengthToFromDrop: pathSteps.length })
            const containerPosition: RoomPosition = new RoomPosition(containerPathStep.x, containerPathStep.y, this.room.name);
            this.room.createConstructionSite(containerPosition, STRUCTURE_CONTAINER);
          }
        }

        // Construct roads
        for (const roadPathStep of pathSteps) {
          const roadPosition: RoomPosition = new RoomPosition(roadPathStep.x, roadPathStep.y, this.room.name);
          this.room.createConstructionSite(roadPosition, STRUCTURE_ROAD);
        }
      }
    }
  }
}
