const g_dir: number[] = [-1, -17, 1, 17];
export function movedPos(pos: number, direction: number) : number {
  if (direction == 0 && pos % 17 == 0) return -1;
  if (direction == 2 && pos % 17 == 16) return -1;
  pos += g_dir[direction];
  if (pos < 0 || pos >= 17 * 17) return -1;
  return pos;
}

export class State {
  field: Int8Array;
  turn: number;
  walls: number[];
  poses: number[];

  constructor(initial_turn: number) {
    this.field = new Int8Array(17 * 17).fill(-1);

    this.turn = initial_turn;
    this.walls = [10, 10];
    this.poses = [16 * 17 + 8, 0 * 17 + 8];  // [black, white]
  }

  toString() {
    let s = "";
    for (let y = 0; y < 17; y++) {
      for (let x = 0; x < 17; x++) {
        let c = this.field[y * 17 + x];
        if (y % 2 == 1 && x % 2 == 1) {
          // none
          s += " ";
        } else if (y % 2 == 1 || x % 2 == 1) {
          // wall or floor
          s += (c == -1) ? "." : "#";
        } else {
          // piece or floor
          if (c == -1) s += "."
          if (c == 0) s += "B"
          if (c == 1) s += "W"
        }
      }
      s += "\n";
    }
    s += `W:${this.walls[1]} / B:${this.walls[0]}`;
    return s;
  }

  clone() : State {
    let s: State = new State(0);
    s.field.set(this.field);
    s.turn = this.turn;
    s.walls = [...this.walls];
    s.poses = [...this.poses];
    return s;
  }
}

export type Act = number;

export function decomposeAct(act: Act) : [number, number] {
  const y = Math.floor(act / 17), x = act % 17;
  return [y, x]
}

export function getCandidateActs(state: State) : Act[] {
  let acts: Act[] = [];
  const pos: number = state.poses[state.turn];
  // piece move
  for (let r = 0; r < 4; r++) {
    const a1pos = movedPos(pos, r);
    if (a1pos < 0 || state.field[a1pos] >= 0) continue;
    const a2pos = movedPos(a1pos, r);

    if (a2pos != state.poses[1 - state.turn]) {
      // destination is empty
      acts.push(a2pos)
    } else {
      // destination is occupied by the opponent
      const a3pos = movedPos(a2pos, r);
      if (a3pos < 0 || state.field[a3pos] >= 0) {
        // wall exists behind the opponent
        for (let turn = 1; turn <= 3; turn += 2) {
          const r2 = (r + turn) % 4;
          const a2t1pos = movedPos(a2pos, r2);
          const a2t2pos = movedPos(a2t1pos, r2);

          if (a2t1pos < 0 || state.field[a2t1pos] >= 0) continue;
          if (state.field[a2t2pos] >= 0) continue;
          acts.push(a2t2pos);
        }
      } else {
        // we can jump across the opponent
        const a4pos = movedPos(a3pos, r);
        acts.push(a4pos);
      }
    }
  }

  // wall placement
  if (state.walls[state.turn] >= 1) {
    for (let y = 0; y < 17; y++) {
  candidate_loop:
      for (let x = (y + 1) % 2; x < 17; x += 2) {
        const dir: number = (y % 2 == 0) ? 3 : 2;
        // the position must not be occupied
        let places: number[] = [];
        let now = y * 17 + x;
        for (let i = 0; i < 3; i++) {
          places.push(now);
          if (now < 0 || state.field[now] >= 0) continue candidate_loop;
          now = movedPos(now, dir);
        }

        // temporarily fill the space
        for (let i = 0; i < 3; i++) state.field[places[i]] = 6;

        // check if the reachability condition holds after placement
        if (checkReachability(state)) {
          acts.push(y * 17 + x);
        }
        // revert the filled space
        for (let i = 0; i < 3; i++) state.field[places[i]] = -1;
      }
    }
  }

  return acts;
}

export function checkReachability(state: State) : boolean {
loop_player:
  for (let p = 0; p <= 1; p += 1) {
    let q: number[] = [state.poses[p]];
    let visited = new Int8Array(17 * 17).fill(0);

    while (q.length > 0) {
      const now: number = q.pop();
      if (visited[now]) continue;
      visited[now] = 1;

      if (p == 0 && now < 17) continue loop_player;
      if (p == 1 && now >= 16 * 17) continue loop_player;

      for (let r = 0; r < 4; r++) {
        const sub = movedPos(now, r);
        if (sub < 0 || state.field[sub] >= 0) continue;  // wall
        const next = movedPos(sub, r);
        if (visited[next]) continue;
        q.push(next);
      }
    }

    // unreachable
    return false;
  }
  return true;
}

export function applyAct(state: State, act: Act) {
  const [y, x] = decomposeAct(act);

  if (x % 2 == 0 && y % 2 == 0) {
    // piece movement
    state.poses[state.turn] = act;
  } else if (x % 2 != y % 2) {
    // wall placement
    state.walls[state.turn]--;
    const dir: number = (y % 2 == 0) ? 3 : 2;

    let now = act;
    for (let i = 0; i < 3; i++) {
      state.field[now] = 9;
      now = movedPos(now, dir);
    }
  }

  state.turn = 1 - state.turn;
}

export function isGameOver(state: State): number {
  if (state.poses[0] < 17) {
    return 0;
  } else if (state.poses[1] >= 16 * 17) {
    return 1;
  }
  return -1;
}
