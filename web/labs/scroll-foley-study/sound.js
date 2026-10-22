import {ABKeeperSoundDirector} from './keeper-reference.js';

// Paper sources rejected by listening are not recycled into a new candidate.
// The A/B keeper is a restored comparison reference, not the final sound master.
export class StudySoundDirector extends ABKeeperSoundDirector {
 snapshot(){return {...super.snapshot(),variant:'source-study-v3',paperState:'rejected-source-not-loaded',keeperReference:'466132c A/B'};}
}
