const boardDiv = document.querySelector(".qf_inner_gameboard") as HTMLDivElement;

type Pos = [number, number];

type Act = Pos;

class State {
  field: number[];
  turn: number;
  b_wall: number;
  w_wall: number;
  b_pos: Pos;
  w_pos: Pos;

  constructor(initial_turn: number) {
    this.field = Array(17 * 17).fill(0);
    this.field[0 * 17 + 8] = 1;
    this.field[16 * 17 + 8] = 2;

    this.turn = initial_turn;
    this.b_wall = 10;
    this.w_wall = 10;
    this.b_pos = [16, 8];
    this.w_pos = [0, 8];
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
          s += (c == 0) ? "." : "#";
        } else {
          // piece or floor
          if (c == 0) s += "."
          if (c == 1) s += "B"
          if (c == 2) s += "W"
        }
      }
    }
    s += `W:${this.w_wall} / B:${this.b_wall}`;
    return s;
  }

  turnString() : string {
    return turnString(this.turn);
  }
}

function turnString(turn: number) : string {
  return (turn == 1) ? "b" : "w";
}

function isValid(state: State, act: Act) : boolean {
  let [ay, ax] = act;
  if (ay % 2 == 0 && ax % 2 == 0) {
    // piece move
    return true;
  } else {
    // wall
    const dy = [1, 0];
    const dx = [0, 1];
    const dir = ay % 2;
    for (let r = 0; r < 3; r++) {
      const by = ay + r * dy[dir];
      const bx = ax + r * dx[dir];
      if (state.field[by * 17 + bx] > 0) return false;
    }

    for (let r = 0; r < 3; r++) {
      const by = ay + r * dy[dir];
      const bx = ax + r * dx[dir];
      state.field[by * 17 + bx] = 9;
    }
    return true;
  }
  return false;
}

function myfunction(event: Event) {
  let s = (event.target as HTMLDivElement).dataset["pos"];
  let act = JSON.parse(s);

  if (!isValid(g_state, act)) return;
  updateBoard(g_state, act);
}

function topPx(idx: number) : number {
  const a = Math.floor((idx + 1) / 2);
  const b = Math.floor(idx / 2);
  return 40 * a + 10 * b;
}

function prepareGameState() : State {
  // cells
  for (let y=0; y<17; y+=2) {
    for (let x=0; x<17; x+=2) {
      let d = document.createElement("div");
      d.style.width = 40 + "px";
      d.style.height = 40 + "px";
      d.style.top = topPx(y) + "px";
      d.style.left = topPx(x) + "px";
      d.dataset["pos"] = JSON.stringify([y, x]);
      d.classList.add("qf_board_grid");
      d.addEventListener("click", myfunction);

      boardDiv.appendChild(d);
    }
  }

  // spaces
  for (let y=1; y<17; y+=2) {
    for (let x=0; x<17; x+=2) {
      let d = document.createElement("div");
      d.style.width = 40 + "px";
      d.style.height = 10 + "px";
      d.style.top = topPx(y) + "px";
      d.style.left = topPx(x) + "px";
      d.dataset["pos"] = JSON.stringify([y, x]);
      d.classList.add("qf_board_space");
      d.addEventListener("click", myfunction);

      boardDiv.appendChild(d);
    }
  }
  for (let y=0; y<17; y+=2) {
    for (let x=1; x<17; x+=2) {
      let d = document.createElement("div");
      d.style.width = 10 + "px";
      d.style.height = 40 + "px";
      d.style.top = topPx(y) + "px";
      d.style.left = topPx(x) + "px";
      d.dataset["pos"] = JSON.stringify([y, x]);
      d.classList.add("qf_board_space");
      d.addEventListener("click", myfunction);

      boardDiv.appendChild(d);
    }
  }

  let initial_state = new State(1);

  // remaining walls
  for (let i = 0; i < initial_state.b_wall; i++) {
    for (let p = 1; p <= 2; p++) {
      let d = document.createElement("div");
      d.style.width = 10 + "px";
      d.style.height = 40 + "px";
      d.style.top = ((p == 1) ? topPx(17) : -40) + "px";
      d.style.left = (topPx(i * 2) - 10) + "px";
      d.dataset["idx"] = i.toString();
      d.classList.add("qf_wall");
      d.classList.add("qf_" + turnString(p) + "wall");
      d.classList.add("qf_vwall");
      d.classList.add("qf_remaining_" + turnString(p) + "wall"); // for search
      d.addEventListener("click", myfunction);

      boardDiv.appendChild(d);
    }
  }

  for (let p = 1; p <= 2; p++) {
    let [y, x] = (p == 1) ? initial_state.b_pos : initial_state.w_pos;

    let d = document.createElement("div");
    d.style.width = 36 + "px";
    d.style.height = 36 + "px";
    d.style.top = (topPx(y) + 2) + "px";
    d.style.left = (topPx(x) + 2) + "px";
    d.classList.add("qf_piece");
    d.classList.add("qf_" + turnString(p) + "piece");

    boardDiv.appendChild(d);
  }

  return initial_state;
}

function updateBoard(state: State, act: Act) {
  const [y, x] = act;

  if (x % 2 == 0 && y % 2 == 0) {
    // piece movement
    const pieceDiv = document.querySelector(".qf_" + state.turnString() + "piece") as HTMLDivElement;
    pieceDiv.style.top = (topPx(y) + 2) + "px";
    pieceDiv.style.left = (topPx(x) + 2) + "px";
  }

  if (x % 2 != y % 2) {
    // wall
    let d = document.createElement("div");

    if (x % 2 == 0) {
      // horizontal
      d.style.width = 90 + "px";
      d.style.height = 10 + "px";
      d.classList.add("qf_hwall");
    } else {
      // vertical
      d.style.width = 10 + "px";
      d.style.height = 90 + "px";
      d.classList.add("qf_vwall");
    }
    d.style.top = topPx(y) + "px";
    d.style.left = topPx(x) + "px";
    d.style.transform = "scale(3)";
    d.style.opacity = "0";
    d.classList.add("qf_wall");
    d.classList.add("qf_" + state.turnString() + "wall");

    boardDiv.appendChild(d);

    if (state.turn == 1) {
      state.b_wall--;
    } else {
      state.w_wall--;
    }
    const idx = (state.turn == 1) ? state.b_wall : state.w_wall;
    let remaining = document.querySelector(`.qf_remaining_${state.turnString()}wall[data-idx="${idx}"]`) as HTMLDivElement;
    remaining.style.opacity = "0";

    setTimeout(() => {
      d.style.transform = "scale(1)";
      d.style.opacity = "1";
    }, 100);
  }

  state.turn = 3 - state.turn;
}

let g_state = prepareGameState();
