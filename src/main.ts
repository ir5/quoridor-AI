import {movedPos, State, Act, decomposeAct, getCandidateActs, applyAct, isGameOver} from "./quoridor_core";
import {agent_list} from "./agents/agent_list";

const boardDiv = document.querySelector(".qf_inner_gameboard") as HTMLDivElement;

function turnString(turn: number) : string {
  return (turn == 0) ? "b" : "w";
}

function isValid(act: Act) : boolean {
  return g_candidate_acts.includes(act);
}

function invokeAct(event: Event) {
  if (g_gameover) return;
  if (!g_humans_turn) return;
  let s = (event.target as HTMLDivElement).dataset["pos"];
  let act = parseInt(s);

  if (!isValid(act)) return;

  updateBoard(act);
  if (g_gameover) return;

  if (agent_list[g_agent_name]) {
    g_humans_turn = false;
    g_delayed_shadow_act = null;

    let d = document.createElement("div");
    d.style.width = "440px";
    d.style.height = "40px";
    d.style.top = "-50px";
    d.style.left = "0px";
    d.classList.add("qf_thinking_text");
    d.classList.add("to_be_disposed");
    d.innerText = "CPU's TURN...";
    boardDiv.appendChild(d);

    setTimeout(takeCPUTurn, 100);
  }
}

function takeCPUTurn() {
  if (g_gameover) return;

  const worker = new Worker("worker.js");

  worker.addEventListener('message', message => {
    const [cpu_act, turn] = message.data;
    if (g_state.turn != turn) {
      return;
    }
    updateBoard(cpu_act);

    document.querySelectorAll(".qf_thinking_text").forEach(d => d && d.remove());

    if (g_gameover) return;

    g_humans_turn = true;
    if (g_delayed_shadow_act != null) {
      showShadowImpl(g_delayed_shadow_act);
      g_delayed_shadow_act = null;
    }
  });

  worker.postMessage([g_state, g_agent_name]);
}

function showShadowImpl(act: Act) {
  if (!isValid(act)) return;

  const [y, x] = decomposeAct(act);

  if (y % 2 == 0 && x % 2 == 0) {
    // piece shadow
    const shadowDiv = document.querySelector(".qf_" + turnString(g_state.turn) + "piece2") as HTMLDivElement;
    shadowDiv.style.top = (topPx(y) + 2) + "px";
    shadowDiv.style.left = (topPx(x) + 2) + "px";
    shadowDiv.style.visibility = "visible";
  } else {
    // wall shadow
    const dir = y % 2;
    const shadowDiv = document.querySelector(`.qf_wall[data-wall_shadow="${g_state.turn}${dir}"]`) as HTMLDivElement;
    shadowDiv.style.top = topPx(y) + "px";
    shadowDiv.style.left = topPx(x) + "px";
    shadowDiv.style.visibility = "visible";
  }
}

function showShadowEvent(event: Event) {
  if (g_gameover) return;

  let act = parseInt((event.target as HTMLDivElement).dataset["pos"]);

  if (!g_humans_turn) {
    g_delayed_shadow_act = act;
    return;
  }

  showShadowImpl(act);
}

function clearPieceShadow(event: Event) {
  for (let p = 0; p <= 1; p++) {
    const shadowDiv = document.querySelector(".qf_" + turnString(p) + "piece2") as HTMLDivElement;
    shadowDiv.style.visibility = "hidden";
  }
}

function clearWallShadow(event: Event) {
  for (let p = 0; p <= 1; p++) {
    for (let dir = 0; dir <= 1; dir++) {
      const shadowDiv = document.querySelector(`.qf_wall[data-wall_shadow="${p}${dir}"]`) as HTMLDivElement;
      shadowDiv.style.visibility = "hidden";
    }
  }
}

function showWinningText(winning_player: number) {
  let d = document.createElement("div");
  d.style.width = "440px";
  d.style.height = "40px";
  if (winning_player == 0) {
    d.style.top = "-50px";
    d.classList.add("qf_winning_btext");
  } else {
    d.style.top = "450px";
    d.classList.add("qf_winning_wtext");
  }
  d.style.left = "0px";
  d.classList.add("qf_winning_text");
  d.classList.add("to_be_disposed");
  if (winning_player == 0) {
    d.innerText = "YOU WIN!!";
  } else {
    d.innerText = "CPU WINS!!";
  }

  boardDiv.appendChild(d);
}

function topPx(idx: number) : number {
  const a = Math.floor((idx + 1) / 2);
  const b = Math.floor(idx / 2);
  return 40 * a + 10 * b;
}

function toggleAgent(event: Event) {
  let checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    g_agent_name = checkbox.value;
  }
  resetGameState();
}

function initializeAgentButtons() {
  const buttonsDiv = document.querySelector(".qf_controlpanel") as HTMLDivElement;
  for(let [i, agent_name] of Object.keys(agent_list).entries()) {
    let l = document.createElement("label");
    l.classList.add("qf_toggle_button")

    let b = document.createElement("div");
    b.innerText = agent_name;
    b.style.width = 100 + "px";
    b.style.height = 25 + "px";
    b.style.top = (Math.floor(i / 4) * 30) + "px";
    b.style.left = ((i % 4) * 110) + "px";
    b.classList.add("qf_control_button");
    b.classList.add("qf_button_ai");

    let r = document.createElement("input");
    r.type = "radio";
    r.name = "agent";
    r.value = agent_name;
    if (i == 0) {
      r.checked = true
    }
    r.addEventListener("click", toggleAgent);

    l.appendChild(r);
    l.appendChild(b)
    buttonsDiv.appendChild(l);
  }
}

function prepareGameState() {
  // cells
  for (let y=0; y<17; y+=2) {
    for (let x=0; x<17; x+=2) {
      let d = document.createElement("div");
      d.style.width = 40 + "px";
      d.style.height = 40 + "px";
      d.style.top = topPx(y) + "px";
      d.style.left = topPx(x) + "px";
      d.dataset["pos"] = "" + (y * 17 + x);
      d.classList.add("qf_board_grid");
      d.addEventListener("click", invokeAct);
      d.addEventListener("mouseenter", showShadowEvent);
      d.addEventListener("mouseleave", clearPieceShadow);

      boardDiv.appendChild(d);
    }
  }

  // shadow of piece
  for (let p = 0; p <= 1; p++) {
    let d = document.createElement("div");
    d.style.width = 36 + "px";
    d.style.height = 36 + "px";
    d.style.top = "0px";
    d.style.left = "0px";
    d.style.visibility = "hidden";
    d.classList.add("qf_piece");
    d.classList.add("qf_" + turnString(p) + "piece2");
    boardDiv.appendChild(d);
  }

  // spaces
  for (let y = 0; y < 17; y++) {
    for (let x = (y + 1) % 2; x < 17; x += 2) {
      let d = document.createElement("div");
      if (y % 2 == 0) {
        d.style.width = 10 + "px";
        d.style.height = 40 + "px";
      } else {
        d.style.width = 40 + "px";
        d.style.height = 10 + "px";
      }
      d.style.top = topPx(y) + "px";
      d.style.left = topPx(x) + "px";
      d.dataset["pos"] = "" + (y * 17 + x);
      d.classList.add("qf_board_space");
      d.addEventListener("click", invokeAct);
      d.addEventListener("mouseenter", showShadowEvent);
      d.addEventListener("mouseleave", clearWallShadow);

      boardDiv.appendChild(d);
    }
  }

  // shadow of walls
  for (let p = 0; p <= 1; p++) {
    for (let dir = 0; dir < 2; dir++) {
      let d = document.createElement("div");
      if (dir == 0) {
        d.style.width = 10 + "px";
        d.style.height = 90 + "px";
        d.classList.add("qf_hwall");
      } else {
        d.style.width = 90 + "px";
        d.style.height = 10 + "px";
        d.classList.add("qf_vwall");
      }
      d.style.top = "0px";
      d.style.left = "0px";
      d.style.visibility = "hidden";
      d.dataset["wall_shadow"] = `${p}${dir}`;
      d.classList.add("qf_wall");
      d.classList.add("qf_" + turnString(p) + "wall2");
      boardDiv.appendChild(d);
    }
  }
}

function resetGameState() {
  // remove existing objects
  document.querySelectorAll(".to_be_disposed").forEach(d => d && d.remove());

  g_state = new State(0);
  g_humans_turn = true;
  g_delayed_shadow_act = null;
  g_gameover = false;
  g_candidate_acts = getCandidateActs(g_state);

  // set remaining walls
  for (let i = 0; i < g_state.walls[0]; i++) {
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
      d.classList.add("to_be_disposed");

      boardDiv.appendChild(d);
    }
  }

  for (let p = 0; p <= 1; p++) {
    let [y, x] = decomposeAct(g_state.poses[p]);

    let d = document.createElement("div");
    d.style.width = 36 + "px";
    d.style.height = 36 + "px";
    d.style.top = (topPx(y) + 2) + "px";
    d.style.left = (topPx(x) + 2) + "px";
    d.classList.add("qf_piece");
    d.classList.add("qf_" + turnString(p) + "piece");
    d.classList.add("to_be_disposed");

    boardDiv.appendChild(d);
  }
}

function updateBoard(act: Act) {
  const [y, x] = decomposeAct(act);

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
      d.style.top = topPx(y) + "px";
      d.classList.add("qf_vwall");
    }
    d.style.left = topPx(x) + "px";
    d.style.transform = "scale(3)";
    d.style.opacity = "0";
    d.classList.add("qf_wall");
    d.classList.add("to_be_disposed");
    d.classList.add("qf_" + turnString(g_state.turn) + "wall");

    boardDiv.appendChild(d);

    // update the number of remaining walls
    const idx = g_state.walls[g_state.turn] - 1;
    let remaining = document.querySelector(`.qf_remaining_${turnString(g_state.turn)}wall[data-idx="${idx}"]`) as HTMLDivElement;
    remaining.style.opacity = "0";

    setTimeout(() => {
      d.style.transform = "scale(1)";
      d.style.opacity = "1";
    }, 50);
  }

  // update the state
  applyAct(g_state, act);

  // update the candidate actions
  g_candidate_acts = getCandidateActs(g_state);

  // check gameover
  const winner = isGameOver(g_state);
  if (winner >= 0) {
    showWinningText(winner);
    g_gameover = true;
  }
}

let g_state: State = null;
let g_agent_name = "CPU Lv.1";
let g_humans_turn: boolean = true;
let g_delayed_shadow_act: Act = null;
let g_gameover: boolean = false;
let g_candidate_acts: Act[] = [];

initializeAgentButtons();
prepareGameState();
resetGameState();
