import {movedPos, State, Act, getCandidateActs, applyAct, isGameOver} from "../../quoridor_core";

function shortestPath(state: State, player: number) : number {
  let q: [number, number][] = [[state.poses[player], 0]];
  let visited = new Int8Array(17 * 17).fill(0);

  while (q.length > 0) {
    let [now, steps]= q.shift();
    if (visited[now]) continue;
    visited[now] = 1;

    if (player == 0 && now < 17) return steps
    if (player == 1 && now >= 16 * 17) return steps;

    for (let r = 0; r < 4; r++) {
      const sub = movedPos(now, r);
      if (sub < 0 || state.field[sub] >= 0) continue;  // wall
      const next = movedPos(sub, r);
      if (visited[next]) continue;
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
