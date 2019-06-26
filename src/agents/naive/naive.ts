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
