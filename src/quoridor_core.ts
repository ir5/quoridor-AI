export type Pos = [number, number];

function add(p: Pos, q: Pos) : Pos {
  return [p[0] + q[0], p[1] + q[1]];
}

function isInside(p: Pos) : boolean {
  const [y, x] = p;
  return y >= 0 && x >= 0 && y < 17 && x < 17;
}

export class State {
  field: number[];
  turn: number;
  walls: number[];
  poses: Pos[];

  constructor(initial_turn: number) {
    this.field = Array(17 * 17).fill(-1);
    this.field[0 * 17 + 8] = 0;
    this.field[16 * 17 + 8] = 1;

    this.turn = initial_turn;
    this.walls = [10, 10];
    this.poses = [[16, 8], [0, 8]];
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
    }
    s += `W:${this.walls[1]} / B:${this.walls[0]}`;
    return s;
  }

  setField(pos: Pos, val: number) {
    this.field[pos[0] * 17 + pos[1]] = val;
  }

  getField(pos: Pos) : number {
    return this.field[pos[0] * 17 + pos[1]];
  }
}

export type Act = Pos;

export function getCandidateActs(state: State) : Act[] {
  let acts: Act[] = [];
  const pos: Pos = state.poses[state.turn];
  // piece move
  const dir: Pos[] = [[0, -1], [-1, 0], [0, 1], [1, 0]];
  for (let r = 0; r < 4; r++) {
    const a1pos = add(pos, dir[r]);
    if (!isInside(a1pos) || state.getField(a1pos) >= 0) continue;
    const a2pos = add(a1pos, dir[r]);

    if (state.getField(a2pos) < 0) {
      // destination is empty
      acts.push(a2pos)
    } else {
      // destination is occupied by the opponent
      const a3pos = add(a2pos, dir[r]);
      if (!isInside(a3pos) || state.getField(a3pos) >= 0) {
        // wall exists behind the opponent
        for (let turn = 1; turn <= 3; turn += 2) {
          const r2 = (r + turn) % 4;
          const a2t1pos = add(a2pos, dir[r2]);
          const a2t2pos = add(a2t1pos, dir[r2]);

          if (!isInside(a2t1pos) || state.getField(a2t1pos) >= 0) continue;
          if (state.getField(a2t2pos) >= 0) continue;
          acts.push(a2t2pos);
        }
      } else {
        // we can jump across the opponent
        const a4pos = add(a3pos, dir[r]);
        acts.push(a4pos);
      }
    }
  }

  // wall placement
  for (let y = 0; y < 17; y++) {
candidate_loop:
    for (let x = (y + 1) % 2; x < 17; x += 2) {
      const dir: Pos = (y % 2 == 0) ? [-1, 0] : [0, 1];
      // the position must not be occupied
      let now: Pos = [y, x];
      for (let i = 0; i < 3; i++) {
        if (!isInside(now) || state.getField(now) >= 0) continue candidate_loop;
        now = add(now, dir);
      }

      // check if the reachability condition holds after placement
      acts.push([y, x]);
    }
  }

  return acts;
}

export function applyAct(state: State, act: Act) {
  const [y, x] = act;

  if (x % 2 == 0 && y % 2 == 0) {
    // piece movement
    state.setField(state.poses[state.turn], -1);
    state.setField(act, state.turn);
    state.poses[state.turn] = act;
  } else if (x % 2 != y % 2) {
    // wall placement
    state.walls[state.turn]--;
    const dir: Pos = (y % 2 == 0) ? [-1, 0] : [0, 1];

    for (let i = 0; i < 3; i++) {
      const by = y + i * dir[0];
      const bx = x + i * dir[1];
      state.setField([by, bx], 9);
    }
  }

  state.turn = 1 - state.turn;
}
