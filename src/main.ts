type Pos = [number, number];

type Act = Pos;

class State {
  field: number[];
  turn: number;
  w_wall: number;
  b_wall: number;
  w_pos: Pos;
  b_pos: Pos;

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
          // token or floor
          if (c == 0) s += "."
          if (c == 1) s += "B"
          if (c == 2) s += "W"
        }
      }
    }
    s += `W:${this.w_wall} / B:${this.b_wall}`;
    return s;
  }
}

function isValid(state: State, act: Act) : boolean {
  return false;
}

const board = document.querySelector(".qf_inner_gameboard") as HTMLDivElement;

console.log("moruo");

function myfunction(event: Event) {
  let s = (event.target as HTMLDivElement).dataset["pos"];
  // let [y, x] = s.split(" ").map(z => parseInt(z));
  let [y, x] = JSON.parse(s);

  if (x % 2 == 0 && y % 2 == 1) {
    let d = document.createElement("div");
    d.style.width = 90 + "px";
    d.style.height = 10 + "px";
    d.style.top = topPx(y) + "px";
    d.style.left = topPx(x) + "px";
    d.classList.add("qf_wall");
    d.classList.add("qf_bwall");

    board.appendChild(d);
  }

  if (x % 2 == 1 && y % 2 == 0) {
    let d = document.createElement("div");
    d.style.width = 10 + "px";
    d.style.height = 90 + "px";
    d.style.top = topPx(y) + "px";
    d.style.left = topPx(x) + "px";
    d.classList.add("qf_wall");
    d.classList.add("qf_bwall");

    board.appendChild(d);
  }
}

function topPx(idx: number) : number {
  const a = Math.floor((idx + 1) / 2);
  const b = Math.floor(idx / 2);
  return 40 * a + 10 * b;
}

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

    board.appendChild(d);
  }
}

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

    board.appendChild(d);
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

    board.appendChild(d);
  }
}
