import {Pos, add, isInside, State, Act, getCandidateActs, applyAct, isGameOver} from "../../quoridor_core";

function shortestPath(state: State, player: number) : number {
  let q: [Pos, number][] = [[state.poses[player], 0]];
  let visited: boolean[] = Array(9 * 9).fill(false);

  function posToIdx(pos: Pos) : number {
    const y = pos[0] / 2;
    const x = pos[1] / 2;
    console.assert(0 <= y && y < 9);
    console.assert(0 <= x && x < 9);
    return y * 9 + x;
  }

  while (q.length > 0) {
    let [now, steps]= q.shift();
    if (visited[posToIdx(now)]) continue;
    visited[posToIdx(now)] = true;

    if (player == 0 && now[0] == 0) return steps
    if (player == 1 && now[0] == 16) return steps;

    const dir: Pos[] = [[0, -1], [-1, 0], [0, 1], [1, 0]];
    for (let r = 0; r < 4; r++) {
      let sub = add(now, dir[r]);
      if (!isInside(sub) || state.getField(sub) >= 0) continue;  // wall
      let next = add(sub, dir[r]);
      if (visited[posToIdx(next)]) continue;
      q.push([next, steps + 1]);
    }
  }

  // unreachable
  return 1e6;
}

function search(state: State, depth: number, alpha: number, beta: number, maximize: boolean, cpuTurn: number) : [number, Act] {
  if (depth == 0) {
    const score = -shortestPath(state, cpuTurn) + shortestPath(state, 1 - cpuTurn);
    return [score, [-1, -1]];
  }
  const acts: Act[] = getCandidateActs(state);

  let value = maximize ? -1e9 : +1e9;
  let best_acts: Act[] = [];
  for (let act of acts) {
    let nstate = state.clone();
    applyAct(nstate, act);

    const [score, _] = search(nstate, depth - 1, alpha, beta, !maximize, cpuTurn);
    if (maximize) {
      // value = Math.max(value, score);
      if (value < score) {
        value = score;
        best_acts = [act];
      } else if (value == score) {
        best_acts.push(act);
      }
      alpha = Math.max(alpha, value);
    } else {
      // value = Math.min(value, score);
      if (value > score) {
        value = score;
        best_acts = [act];
      } else if (value == score) {
        best_acts.push(act);
      }
      beta = Math.min(beta, value);
    }
    if (alpha > beta) break;
  }
  const best_act = best_acts[Math.floor(best_acts.length * Math.random())];
  return [value, best_act];
}

export function alphaBetaAgent(state: State) : Act {
  const depth = 3;
  const [_, act] = search(state, depth, -1e9, +1e9, true, state.turn);
  return act;
}
