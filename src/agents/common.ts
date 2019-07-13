import {movedPos, State} from "../quoridor_core";

export function shortestPath(state: State, player: number) : number {
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
