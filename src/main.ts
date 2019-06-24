import {Pos, State, Act, getCandidateActs, applyAct} from "./quoridor_core";

const boardDiv = document.querySelector(".qf_inner_gameboard") as HTMLDivElement;

function turnString(turn: number) : string {
  return (turn == 0) ? "b" : "w";
}

function isValid(state: State, act: Act) : boolean {
  let [ay, ax] = act;
  return g_candidate_acts.some((e) => { return e[0] == act[0] && e[1] == act[1]; });
}

function myfunction(event: Event) {
  let s = (event.target as HTMLDivElement).dataset["pos"];
  let act = JSON.parse(s);

  if (!isValid(g_state, act)) return;
  updateBoard(act);
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
  for (let i = 0; i < initial_state.walls[0]; i++) {
    for (let p = 0; p <= 1; p++) {
      let d = document.createElement("div");
      d.style.width = 10 + "px";
      d.style.height = 40 + "px";
      d.style.top = ((p == 0) ? topPx(17) : -40) + "px";
      d.style.left = (topPx(i * 2) - 10) + "px";
      d.dataset["idx"] = i.toString();
      d.classList.add("qf_wall");
      d.classList.add("qf_" + turnString(p) + "wall");
      d.classList.add("qf_vwall");
      d.classList.add("qf_remaining_" + turnString(p) + "wall"); // for search

      boardDiv.appendChild(d);
    }
  }

  for (let p = 0; p <= 1; p++) {
    let [y, x] = initial_state.poses[p];

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

function updateBoard(act: Act) {
  const [y, x] = act;

  if (x % 2 == 0 && y % 2 == 0) {
    // piece movement
    const pieceDiv = document.querySelector(".qf_" + turnString(g_state.turn) + "piece") as HTMLDivElement;
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
      d.style.top = topPx(y) + "px";
      d.classList.add("qf_hwall");
    } else {
      // vertical
      d.style.width = 10 + "px";
      d.style.height = 90 + "px";
      d.style.top = topPx(y - 2) + "px";
      d.classList.add("qf_vwall");
    }
    d.style.left = topPx(x) + "px";
    d.style.transform = "scale(3)";
    d.style.opacity = "0";
    d.classList.add("qf_wall");
    d.classList.add("qf_" + turnString(g_state.turn) + "wall");

    boardDiv.appendChild(d);

    // update the number of remaining walls
    const idx = g_state.walls[g_state.turn] - 1;
    let remaining = document.querySelector(`.qf_remaining_${turnString(g_state.turn)}wall[data-idx="${idx}"]`) as HTMLDivElement;
    remaining.style.opacity = "0";

    setTimeout(() => {
      d.style.transform = "scale(1)";
      d.style.opacity = "1";
    }, 100);
  }

  // update the state
  applyAct(g_state, act);

  // update the candidate actions
  g_candidate_acts = getCandidateActs(g_state);
}

let g_state = prepareGameState();
let g_candidate_acts = getCandidateActs(g_state);
