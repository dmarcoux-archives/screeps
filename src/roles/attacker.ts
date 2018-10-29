import { logMessage } from 'globals';

// Creeps with the attacker role
export class Attacker extends Creep {
  constructor(id: string) {
    super(id);
  }

  public work() {
    // TODO: Code this
    // Check if there is an attack flag placed.
    //   If so, get in the room where it is
    //     If already there, check if there is a target at the flag's position
    //       If target, try to attack it
    //         If OK, keep doing so
    //         If not in range, move to flag position
    //       If no target, look for enemy structures, creeps (by range, for the important structures like spawns or for other soldiers?)
    //         If found, try to attack target
    //           If OK, keep doing so
    //           If not in range, move to target
    //     If not already there, move to room
  }
}
