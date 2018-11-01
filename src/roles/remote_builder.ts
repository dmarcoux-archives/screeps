import { logMessage } from 'globals';

// Creeps with the remote builder role
export class RemoteBuilder extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    // TODO: Code this
    // Move to assigned room
    // once in room, harvest from source and build spawn
    // once spawn is built, build other construction sites
  }
}
