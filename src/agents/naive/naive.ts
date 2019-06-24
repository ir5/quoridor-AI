import {Pos, State, Act, getCandidateActs, applyAct, isGameOver} from "../../quoridor_core";

export function naiveAgent(state: State) : Act {
  let acts: Act[] = getCandidateActs(state);
  return acts[Math.floor(acts.length * Math.random())];
}
