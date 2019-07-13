import {movedPos, State, Act, getCandidateActs, applyAct, isGameOver} from "../../quoridor_core";
import {shortestPath} from "../common";

export function naiveAgent(state: State) : Act {
  const acts: Act[] = getCandidateActs(state);
  let score_max = -1e10;
  let best_acts: Act[] = [];

  function calcScore(s: State, player: number) : number {
    const gamma = 0.2;
    return -shortestPath(s, player) + gamma * s.walls[player];
  }

  let first = 0;
  for (let act of acts) {
    let state1 = state.clone();
    applyAct(state1, act);
    const acts1 = getCandidateActs(state1);
    let min = 1e10;

    for (let act1 of acts1) {
      let state2 = state1.clone();
      applyAct(state2, act1);
      const score = calcScore(state2, state.turn) - calcScore(state2, 1 - state.turn);
      min = Math.min(min, score);
      if (min < score_max) break;
    }
    const score = min;

    if (score > score_max) {
      score_max = score;
      best_acts = [act];
    } else if (score == score_max) {
      best_acts.push(act);
    }
  }
  return best_acts[Math.floor(best_acts.length * Math.random())];
}
