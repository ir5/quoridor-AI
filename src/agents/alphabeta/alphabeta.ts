import {movedPos, State, Act, getCandidateActs, applyAct, isGameOver} from "../../quoridor_core";
import {shortestPath} from "../common";

function shuffle(acts: Act[]) {
  for (let i = 0; i < acts.length; i++) {
    const k = Math.floor(Math.random() * (i + 1));
    const temp = acts[i];
    acts[i] = acts[k];
    acts[k] = temp;
  }
}

function search(state: State, depth: number, alpha: number, beta: number, maximize: boolean, cpuTurn: number, first: boolean) : [number, Act] {
  if (depth == 0) {
    const score = -shortestPath(state, cpuTurn) + shortestPath(state, 1 - cpuTurn);
    return [score, -1];
  }
  const winner = isGameOver(state);
  if (winner >= 0) {
    if (winner == cpuTurn) return [+1000, -1];
    else return [-1000, -1];
  }
  const acts: Act[] = getCandidateActs(state);

  if (first) shuffle(acts);

  let value = maximize ? -1e9 : +1e9;
  let best_act: Act = null;
  for (let act of acts) {
    let nstate = state.clone();
    applyAct(nstate, act);

    const [score, _] = search(nstate, depth - 1, alpha, beta, !maximize, cpuTurn, false);
    if (maximize) {
      // value = Math.max(value, score);
      if (value < score) {
        value = score;
        best_act = act;
      }
      alpha = Math.max(alpha, score);
    } else {
      // value = Math.min(value, score);
      if (value > score) {
        value = score;
        best_act = act;
      }
      beta = Math.min(beta, score);
    }
    if (alpha >= beta) break;

  }
  return [value, best_act];
}

export function alphaBetaAgent(state: State, depth: number) : Act {
  const [_, act] = search(state, depth, -1e9, +1e9, true, state.turn, true);
  return act;
}
