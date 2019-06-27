import {Pos, add, isInside, State, Act, getCandidateActs, applyAct, isGameOver} from "../../quoridor_core";

function shortestPath(state: State, player: number) : number {
  let q: [Pos, number][] = [[state.poses[player], 0]];
  let visited: boolean[] = Array(9 * 9).fill(false);

  function posToIdx(pos: Pos) : number {
    const y = pos[0] / 2;
    const x = pos[1] / 2;
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

function shuffle(acts: Act[]) {
  for (let i = 0; i < acts.length; i++) {
    const k = Math.floor(Math.random() * (i + 1));
    const temp = acts[i];
    acts[i] = acts[k];
    acts[k] = temp;
  }
}

function search(state: State, depth: number, alpha: number, beta: number, maximize: boolean, cpuTurn: number, first: boolean) : [number, Act] {
  const winner = isGameOver(state);
  if (winner >= 0) {
    if (winner == cpuTurn) return [+1000, [-1, -1]];
    else return [-1000, [-1, -1]];
  }

  if (depth == 0) {
    const score = -shortestPath(state, cpuTurn) + shortestPath(state, 1 - cpuTurn);
    return [score, [-1, -1]];
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

export function alphaBetaAgent(state: State) : Act {
  const depth = 3;
  const [_, act] = search(state, depth, -1e9, +1e9, true, state.turn, true);
  return act;
}
