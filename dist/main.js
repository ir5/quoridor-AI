var main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/agents/agent_list.ts":
/*!**********************************!*\
  !*** ./src/agents/agent_list.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// import {naiveAgent} from \"./naive/naive\"\r\nconst alphabeta_1 = __webpack_require__(/*! ./alphabeta/alphabeta */ \"./src/agents/alphabeta/alphabeta.ts\");\r\nexports.agent_list = {\r\n    // \"Manual\": null,\r\n    \"CPU Lv.1\": (state) => { return alphabeta_1.alphaBetaAgent(state, 1); },\r\n    \"CPU Lv.2\": (state) => { return alphabeta_1.alphaBetaAgent(state, 2); },\r\n    \"CPU Lv.3\": (state) => { return alphabeta_1.alphaBetaAgent(state, 3); },\r\n    \"CPU Lv.4\": (state) => { return alphabeta_1.alphaBetaAgent(state, 4); },\r\n};\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/agents/agent_list.ts?");

/***/ }),

/***/ "./src/agents/alphabeta/alphabeta.ts":
/*!*******************************************!*\
  !*** ./src/agents/alphabeta/alphabeta.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst quoridor_core_1 = __webpack_require__(/*! ../../quoridor_core */ \"./src/quoridor_core.ts\");\r\nconst common_1 = __webpack_require__(/*! ../common */ \"./src/agents/common.ts\");\r\nfunction shuffle(acts) {\r\n    for (let i = 0; i < acts.length; i++) {\r\n        const k = Math.floor(Math.random() * (i + 1));\r\n        const temp = acts[i];\r\n        acts[i] = acts[k];\r\n        acts[k] = temp;\r\n    }\r\n}\r\nfunction search(state, depth, alpha, beta, maximize, cpuTurn, first) {\r\n    if (depth == 0) {\r\n        const score = -common_1.shortestPath(state, cpuTurn) + common_1.shortestPath(state, 1 - cpuTurn);\r\n        return [score, -1];\r\n    }\r\n    const winner = quoridor_core_1.isGameOver(state);\r\n    if (winner >= 0) {\r\n        if (winner == cpuTurn)\r\n            return [+1000, -1];\r\n        else\r\n            return [-1000, -1];\r\n    }\r\n    const acts = quoridor_core_1.getCandidateActs(state);\r\n    if (first)\r\n        shuffle(acts);\r\n    let value = maximize ? -1e9 : +1e9;\r\n    let best_act = null;\r\n    for (let act of acts) {\r\n        let nstate = state.clone();\r\n        quoridor_core_1.applyAct(nstate, act);\r\n        const [score, _] = search(nstate, depth - 1, alpha, beta, !maximize, cpuTurn, false);\r\n        if (maximize) {\r\n            // value = Math.max(value, score);\r\n            if (value < score) {\r\n                value = score;\r\n                best_act = act;\r\n            }\r\n            alpha = Math.max(alpha, score);\r\n        }\r\n        else {\r\n            // value = Math.min(value, score);\r\n            if (value > score) {\r\n                value = score;\r\n                best_act = act;\r\n            }\r\n            beta = Math.min(beta, score);\r\n        }\r\n        if (alpha >= beta)\r\n            break;\r\n    }\r\n    return [value, best_act];\r\n}\r\nfunction alphaBetaAgent(state, depth) {\r\n    const [_, act] = search(state, depth, -1e9, +1e9, true, state.turn, true);\r\n    return act;\r\n}\r\nexports.alphaBetaAgent = alphaBetaAgent;\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/agents/alphabeta/alphabeta.ts?");

/***/ }),

/***/ "./src/agents/common.ts":
/*!******************************!*\
  !*** ./src/agents/common.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst quoridor_core_1 = __webpack_require__(/*! ../quoridor_core */ \"./src/quoridor_core.ts\");\r\nfunction shortestPath(state, player) {\r\n    let q = [[state.poses[player], 0]];\r\n    let visited = new Int8Array(17 * 17).fill(0);\r\n    while (q.length > 0) {\r\n        let [now, steps] = q.shift();\r\n        if (visited[now])\r\n            continue;\r\n        visited[now] = 1;\r\n        if (player == 0 && now < 17)\r\n            return steps;\r\n        if (player == 1 && now >= 16 * 17)\r\n            return steps;\r\n        for (let r = 0; r < 4; r++) {\r\n            const sub = quoridor_core_1.movedPos(now, r);\r\n            if (sub < 0 || state.field[sub] >= 0)\r\n                continue; // wall\r\n            const next = quoridor_core_1.movedPos(sub, r);\r\n            if (visited[next])\r\n                continue;\r\n            q.push([next, steps + 1]);\r\n        }\r\n    }\r\n    // unreachable\r\n    return 1e6;\r\n}\r\nexports.shortestPath = shortestPath;\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/agents/common.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst quoridor_core_1 = __webpack_require__(/*! ./quoridor_core */ \"./src/quoridor_core.ts\");\r\nconst agent_list_1 = __webpack_require__(/*! ./agents/agent_list */ \"./src/agents/agent_list.ts\");\r\nconst boardDiv = document.querySelector(\".qf_inner_gameboard\");\r\nfunction turnString(turn) {\r\n    return (turn == 0) ? \"b\" : \"w\";\r\n}\r\nfunction isValid(act) {\r\n    return g_candidate_acts.includes(act);\r\n}\r\nfunction invokeAct(event) {\r\n    if (g_gameover)\r\n        return;\r\n    if (!g_humans_turn)\r\n        return;\r\n    let s = event.target.dataset[\"pos\"];\r\n    let act = parseInt(s);\r\n    if (!isValid(act))\r\n        return;\r\n    updateBoard(act);\r\n    if (g_gameover)\r\n        return;\r\n    if (agent_list_1.agent_list[g_agent_name]) {\r\n        g_humans_turn = false;\r\n        g_delayed_shadow_act = null;\r\n        let d = document.createElement(\"div\");\r\n        d.style.width = \"440px\";\r\n        d.style.height = \"40px\";\r\n        d.style.top = \"-50px\";\r\n        d.style.left = \"0px\";\r\n        d.classList.add(\"qf_thinking_text\");\r\n        d.classList.add(\"to_be_disposed\");\r\n        d.innerText = \"CPU's TURN...\";\r\n        boardDiv.appendChild(d);\r\n        setTimeout(takeCPUTurn, 100);\r\n    }\r\n}\r\nfunction takeCPUTurn() {\r\n    if (g_gameover)\r\n        return;\r\n    const worker = new Worker(\"worker.js\");\r\n    worker.addEventListener('message', message => {\r\n        const [cpu_act, turn] = message.data;\r\n        if (g_state.turn != turn) {\r\n            return;\r\n        }\r\n        updateBoard(cpu_act);\r\n        document.querySelectorAll(\".qf_thinking_text\").forEach(d => d && d.remove());\r\n        if (g_gameover)\r\n            return;\r\n        g_humans_turn = true;\r\n        if (g_delayed_shadow_act != null) {\r\n            showShadowImpl(g_delayed_shadow_act);\r\n            g_delayed_shadow_act = null;\r\n        }\r\n    });\r\n    worker.postMessage([g_state, g_agent_name]);\r\n}\r\nfunction showShadowImpl(act) {\r\n    if (!isValid(act))\r\n        return;\r\n    const [y, x] = quoridor_core_1.decomposeAct(act);\r\n    if (y % 2 == 0 && x % 2 == 0) {\r\n        // piece shadow\r\n        const shadowDiv = document.querySelector(\".qf_\" + turnString(g_state.turn) + \"piece2\");\r\n        shadowDiv.style.top = (topPx(y) + 2) + \"px\";\r\n        shadowDiv.style.left = (topPx(x) + 2) + \"px\";\r\n        shadowDiv.style.visibility = \"visible\";\r\n    }\r\n    else {\r\n        // wall shadow\r\n        const dir = y % 2;\r\n        const shadowDiv = document.querySelector(`.qf_wall[data-wall_shadow=\"${g_state.turn}${dir}\"]`);\r\n        shadowDiv.style.top = topPx(y) + \"px\";\r\n        shadowDiv.style.left = topPx(x) + \"px\";\r\n        shadowDiv.style.visibility = \"visible\";\r\n    }\r\n}\r\nfunction showShadowEvent(event) {\r\n    if (g_gameover)\r\n        return;\r\n    let act = parseInt(event.target.dataset[\"pos\"]);\r\n    if (!g_humans_turn) {\r\n        g_delayed_shadow_act = act;\r\n        return;\r\n    }\r\n    showShadowImpl(act);\r\n}\r\nfunction clearPieceShadow(event) {\r\n    for (let p = 0; p <= 1; p++) {\r\n        const shadowDiv = document.querySelector(\".qf_\" + turnString(p) + \"piece2\");\r\n        shadowDiv.style.visibility = \"hidden\";\r\n    }\r\n}\r\nfunction clearWallShadow(event) {\r\n    for (let p = 0; p <= 1; p++) {\r\n        for (let dir = 0; dir <= 1; dir++) {\r\n            const shadowDiv = document.querySelector(`.qf_wall[data-wall_shadow=\"${p}${dir}\"]`);\r\n            shadowDiv.style.visibility = \"hidden\";\r\n        }\r\n    }\r\n}\r\nfunction showWinningText(winning_player) {\r\n    let d = document.createElement(\"div\");\r\n    d.style.width = \"440px\";\r\n    d.style.height = \"40px\";\r\n    if (winning_player == 0) {\r\n        d.style.top = \"-50px\";\r\n        d.classList.add(\"qf_winning_btext\");\r\n    }\r\n    else {\r\n        d.style.top = \"450px\";\r\n        d.classList.add(\"qf_winning_wtext\");\r\n    }\r\n    d.style.left = \"0px\";\r\n    d.classList.add(\"qf_winning_text\");\r\n    d.classList.add(\"to_be_disposed\");\r\n    if (winning_player == 0) {\r\n        d.innerText = \"YOU WIN!!\";\r\n    }\r\n    else {\r\n        d.innerText = \"CPU WINS!!\";\r\n    }\r\n    boardDiv.appendChild(d);\r\n}\r\nfunction topPx(idx) {\r\n    const a = Math.floor((idx + 1) / 2);\r\n    const b = Math.floor(idx / 2);\r\n    return 40 * a + 10 * b;\r\n}\r\nfunction toggleAgent(event) {\r\n    let checkbox = event.target;\r\n    if (checkbox.checked) {\r\n        g_agent_name = checkbox.value;\r\n    }\r\n    resetGameState();\r\n}\r\nfunction initializeAgentButtons() {\r\n    const buttonsDiv = document.querySelector(\".qf_controlpanel\");\r\n    for (let [i, agent_name] of Object.keys(agent_list_1.agent_list).entries()) {\r\n        let l = document.createElement(\"label\");\r\n        l.classList.add(\"qf_toggle_button\");\r\n        let b = document.createElement(\"div\");\r\n        b.innerText = agent_name;\r\n        b.style.width = 100 + \"px\";\r\n        b.style.height = 25 + \"px\";\r\n        b.style.top = (Math.floor(i / 4) * 30) + \"px\";\r\n        b.style.left = ((i % 4) * 110) + \"px\";\r\n        b.classList.add(\"qf_control_button\");\r\n        b.classList.add(\"qf_button_ai\");\r\n        let r = document.createElement(\"input\");\r\n        r.type = \"radio\";\r\n        r.name = \"agent\";\r\n        r.value = agent_name;\r\n        if (i == 0) {\r\n            r.checked = true;\r\n        }\r\n        r.addEventListener(\"click\", toggleAgent);\r\n        l.appendChild(r);\r\n        l.appendChild(b);\r\n        buttonsDiv.appendChild(l);\r\n    }\r\n}\r\nfunction prepareGameState() {\r\n    // cells\r\n    for (let y = 0; y < 17; y += 2) {\r\n        for (let x = 0; x < 17; x += 2) {\r\n            let d = document.createElement(\"div\");\r\n            d.style.width = 40 + \"px\";\r\n            d.style.height = 40 + \"px\";\r\n            d.style.top = topPx(y) + \"px\";\r\n            d.style.left = topPx(x) + \"px\";\r\n            d.dataset[\"pos\"] = \"\" + (y * 17 + x);\r\n            d.classList.add(\"qf_board_grid\");\r\n            d.addEventListener(\"click\", invokeAct);\r\n            d.addEventListener(\"mouseenter\", showShadowEvent);\r\n            d.addEventListener(\"mouseleave\", clearPieceShadow);\r\n            boardDiv.appendChild(d);\r\n        }\r\n    }\r\n    // shadow of piece\r\n    for (let p = 0; p <= 1; p++) {\r\n        let d = document.createElement(\"div\");\r\n        d.style.width = 36 + \"px\";\r\n        d.style.height = 36 + \"px\";\r\n        d.style.top = \"0px\";\r\n        d.style.left = \"0px\";\r\n        d.style.visibility = \"hidden\";\r\n        d.classList.add(\"qf_piece\");\r\n        d.classList.add(\"qf_\" + turnString(p) + \"piece2\");\r\n        boardDiv.appendChild(d);\r\n    }\r\n    // spaces\r\n    for (let y = 0; y < 17; y++) {\r\n        for (let x = (y + 1) % 2; x < 17; x += 2) {\r\n            let d = document.createElement(\"div\");\r\n            if (y % 2 == 0) {\r\n                d.style.width = 10 + \"px\";\r\n                d.style.height = 40 + \"px\";\r\n            }\r\n            else {\r\n                d.style.width = 40 + \"px\";\r\n                d.style.height = 10 + \"px\";\r\n            }\r\n            d.style.top = topPx(y) + \"px\";\r\n            d.style.left = topPx(x) + \"px\";\r\n            d.dataset[\"pos\"] = \"\" + (y * 17 + x);\r\n            d.classList.add(\"qf_board_space\");\r\n            d.addEventListener(\"click\", invokeAct);\r\n            d.addEventListener(\"mouseenter\", showShadowEvent);\r\n            d.addEventListener(\"mouseleave\", clearWallShadow);\r\n            boardDiv.appendChild(d);\r\n        }\r\n    }\r\n    // shadow of walls\r\n    for (let p = 0; p <= 1; p++) {\r\n        for (let dir = 0; dir < 2; dir++) {\r\n            let d = document.createElement(\"div\");\r\n            if (dir == 0) {\r\n                d.style.width = 10 + \"px\";\r\n                d.style.height = 90 + \"px\";\r\n                d.classList.add(\"qf_hwall\");\r\n            }\r\n            else {\r\n                d.style.width = 90 + \"px\";\r\n                d.style.height = 10 + \"px\";\r\n                d.classList.add(\"qf_vwall\");\r\n            }\r\n            d.style.top = \"0px\";\r\n            d.style.left = \"0px\";\r\n            d.style.visibility = \"hidden\";\r\n            d.dataset[\"wall_shadow\"] = `${p}${dir}`;\r\n            d.classList.add(\"qf_wall\");\r\n            d.classList.add(\"qf_\" + turnString(p) + \"wall2\");\r\n            boardDiv.appendChild(d);\r\n        }\r\n    }\r\n}\r\nfunction resetGameState() {\r\n    // remove existing objects\r\n    document.querySelectorAll(\".to_be_disposed\").forEach(d => d && d.remove());\r\n    g_state = new quoridor_core_1.State(0);\r\n    g_humans_turn = true;\r\n    g_delayed_shadow_act = null;\r\n    g_gameover = false;\r\n    g_candidate_acts = quoridor_core_1.getCandidateActs(g_state);\r\n    // set remaining walls\r\n    for (let i = 0; i < g_state.walls[0]; i++) {\r\n        for (let p = 0; p <= 1; p++) {\r\n            let d = document.createElement(\"div\");\r\n            d.style.width = 10 + \"px\";\r\n            d.style.height = 40 + \"px\";\r\n            d.style.top = ((p == 0) ? topPx(17) : -40) + \"px\";\r\n            d.style.left = (topPx(i * 2) - 10) + \"px\";\r\n            d.dataset[\"idx\"] = i.toString();\r\n            d.classList.add(\"qf_wall\");\r\n            d.classList.add(\"qf_\" + turnString(p) + \"wall\");\r\n            d.classList.add(\"qf_vwall\");\r\n            d.classList.add(\"qf_remaining_\" + turnString(p) + \"wall\"); // for search\r\n            d.classList.add(\"to_be_disposed\");\r\n            boardDiv.appendChild(d);\r\n        }\r\n    }\r\n    for (let p = 0; p <= 1; p++) {\r\n        let [y, x] = quoridor_core_1.decomposeAct(g_state.poses[p]);\r\n        let d = document.createElement(\"div\");\r\n        d.style.width = 36 + \"px\";\r\n        d.style.height = 36 + \"px\";\r\n        d.style.top = (topPx(y) + 2) + \"px\";\r\n        d.style.left = (topPx(x) + 2) + \"px\";\r\n        d.classList.add(\"qf_piece\");\r\n        d.classList.add(\"qf_\" + turnString(p) + \"piece\");\r\n        d.classList.add(\"to_be_disposed\");\r\n        boardDiv.appendChild(d);\r\n    }\r\n}\r\nfunction updateBoard(act) {\r\n    const [y, x] = quoridor_core_1.decomposeAct(act);\r\n    if (x % 2 == 0 && y % 2 == 0) {\r\n        // piece movement\r\n        const pieceDiv = document.querySelector(\".qf_\" + turnString(g_state.turn) + \"piece\");\r\n        pieceDiv.style.top = (topPx(y) + 2) + \"px\";\r\n        pieceDiv.style.left = (topPx(x) + 2) + \"px\";\r\n    }\r\n    if (x % 2 != y % 2) {\r\n        // wall\r\n        let d = document.createElement(\"div\");\r\n        if (x % 2 == 0) {\r\n            // horizontal\r\n            d.style.width = 90 + \"px\";\r\n            d.style.height = 10 + \"px\";\r\n            d.style.top = topPx(y) + \"px\";\r\n            d.classList.add(\"qf_hwall\");\r\n        }\r\n        else {\r\n            // vertical\r\n            d.style.width = 10 + \"px\";\r\n            d.style.height = 90 + \"px\";\r\n            d.style.top = topPx(y) + \"px\";\r\n            d.classList.add(\"qf_vwall\");\r\n        }\r\n        d.style.left = topPx(x) + \"px\";\r\n        d.style.transform = \"scale(3)\";\r\n        d.style.opacity = \"0\";\r\n        d.classList.add(\"qf_wall\");\r\n        d.classList.add(\"to_be_disposed\");\r\n        d.classList.add(\"qf_\" + turnString(g_state.turn) + \"wall\");\r\n        boardDiv.appendChild(d);\r\n        // update the number of remaining walls\r\n        const idx = g_state.walls[g_state.turn] - 1;\r\n        let remaining = document.querySelector(`.qf_remaining_${turnString(g_state.turn)}wall[data-idx=\"${idx}\"]`);\r\n        remaining.style.opacity = \"0\";\r\n        setTimeout(() => {\r\n            d.style.transform = \"scale(1)\";\r\n            d.style.opacity = \"1\";\r\n        }, 50);\r\n    }\r\n    // update the state\r\n    quoridor_core_1.applyAct(g_state, act);\r\n    // update the candidate actions\r\n    g_candidate_acts = quoridor_core_1.getCandidateActs(g_state);\r\n    // check gameover\r\n    const winner = quoridor_core_1.isGameOver(g_state);\r\n    if (winner >= 0) {\r\n        showWinningText(winner);\r\n        g_gameover = true;\r\n    }\r\n}\r\nlet g_state = null;\r\nlet g_agent_name = \"CPU Lv.1\";\r\nlet g_humans_turn = true;\r\nlet g_delayed_shadow_act = null;\r\nlet g_gameover = false;\r\nlet g_candidate_acts = [];\r\ninitializeAgentButtons();\r\nprepareGameState();\r\nresetGameState();\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/main.ts?");

/***/ }),

/***/ "./src/quoridor_core.ts":
/*!******************************!*\
  !*** ./src/quoridor_core.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst g_dir = [-1, -17, 1, 17];\r\nfunction movedPos(pos, direction) {\r\n    if (direction == 0 && pos % 17 == 0)\r\n        return -1;\r\n    if (direction == 2 && pos % 17 == 16)\r\n        return -1;\r\n    pos += g_dir[direction];\r\n    if (pos < 0 || pos >= 17 * 17)\r\n        return -1;\r\n    return pos;\r\n}\r\nexports.movedPos = movedPos;\r\nclass State {\r\n    constructor(initial_turn) {\r\n        this.field = new Int8Array(17 * 17).fill(-1);\r\n        this.turn = initial_turn;\r\n        this.walls = [10, 10];\r\n        this.poses = [16 * 17 + 8, 0 * 17 + 8]; // [black, white]\r\n    }\r\n    toString() {\r\n        let s = \"\";\r\n        for (let y = 0; y < 17; y++) {\r\n            for (let x = 0; x < 17; x++) {\r\n                let c = this.field[y * 17 + x];\r\n                if (y % 2 == 1 && x % 2 == 1) {\r\n                    // none\r\n                    s += \" \";\r\n                }\r\n                else if (y % 2 == 1 || x % 2 == 1) {\r\n                    // wall or floor\r\n                    s += (c == -1) ? \".\" : \"#\";\r\n                }\r\n                else {\r\n                    // piece or floor\r\n                    if (c == -1)\r\n                        s += \".\";\r\n                    if (c == 0)\r\n                        s += \"B\";\r\n                    if (c == 1)\r\n                        s += \"W\";\r\n                }\r\n            }\r\n            s += \"\\n\";\r\n        }\r\n        s += `W:${this.walls[1]} / B:${this.walls[0]}`;\r\n        return s;\r\n    }\r\n    clone() {\r\n        let s = new State(0);\r\n        s.field.set(this.field);\r\n        s.turn = this.turn;\r\n        s.walls = [...this.walls];\r\n        s.poses = [...this.poses];\r\n        return s;\r\n    }\r\n}\r\nexports.State = State;\r\nfunction decomposeAct(act) {\r\n    const y = Math.floor(act / 17), x = act % 17;\r\n    return [y, x];\r\n}\r\nexports.decomposeAct = decomposeAct;\r\nfunction getCandidateActs(state) {\r\n    let acts = [];\r\n    const pos = state.poses[state.turn];\r\n    // piece move\r\n    for (let r = 0; r < 4; r++) {\r\n        const a1pos = movedPos(pos, r);\r\n        if (a1pos < 0 || state.field[a1pos] >= 0)\r\n            continue;\r\n        const a2pos = movedPos(a1pos, r);\r\n        if (a2pos != state.poses[1 - state.turn]) {\r\n            // destination is empty\r\n            acts.push(a2pos);\r\n        }\r\n        else {\r\n            // destination is occupied by the opponent\r\n            const a3pos = movedPos(a2pos, r);\r\n            if (a3pos < 0 || state.field[a3pos] >= 0) {\r\n                // wall exists behind the opponent\r\n                for (let turn = 1; turn <= 3; turn += 2) {\r\n                    const r2 = (r + turn) % 4;\r\n                    const a2t1pos = movedPos(a2pos, r2);\r\n                    const a2t2pos = movedPos(a2t1pos, r2);\r\n                    if (a2t1pos < 0 || state.field[a2t1pos] >= 0)\r\n                        continue;\r\n                    if (state.field[a2t2pos] >= 0)\r\n                        continue;\r\n                    acts.push(a2t2pos);\r\n                }\r\n            }\r\n            else {\r\n                // we can jump across the opponent\r\n                const a4pos = movedPos(a3pos, r);\r\n                acts.push(a4pos);\r\n            }\r\n        }\r\n    }\r\n    // wall placement\r\n    if (state.walls[state.turn] >= 1) {\r\n        for (let y = 0; y < 17; y++) {\r\n            candidate_loop: for (let x = (y + 1) % 2; x < 17; x += 2) {\r\n                const dir = (y % 2 == 0) ? 3 : 2;\r\n                // the position must not be occupied\r\n                let places = [];\r\n                let now = y * 17 + x;\r\n                for (let i = 0; i < 3; i++) {\r\n                    places.push(now);\r\n                    if (now < 0 || state.field[now] >= 0)\r\n                        continue candidate_loop;\r\n                    now = movedPos(now, dir);\r\n                }\r\n                // temporarily fill the space\r\n                for (let i = 0; i < 3; i++)\r\n                    state.field[places[i]] = 6;\r\n                // check if the reachability condition holds after placement\r\n                if (checkReachability(state)) {\r\n                    acts.push(y * 17 + x);\r\n                }\r\n                // revert the filled space\r\n                for (let i = 0; i < 3; i++)\r\n                    state.field[places[i]] = -1;\r\n            }\r\n        }\r\n    }\r\n    return acts;\r\n}\r\nexports.getCandidateActs = getCandidateActs;\r\nfunction checkReachability(state) {\r\n    loop_player: for (let p = 0; p <= 1; p += 1) {\r\n        let q = [state.poses[p]];\r\n        let visited = new Int8Array(17 * 17).fill(0);\r\n        while (q.length > 0) {\r\n            const now = q.pop();\r\n            if (visited[now])\r\n                continue;\r\n            visited[now] = 1;\r\n            if (p == 0 && now < 17)\r\n                continue loop_player;\r\n            if (p == 1 && now >= 16 * 17)\r\n                continue loop_player;\r\n            for (let r = 0; r < 4; r++) {\r\n                const sub = movedPos(now, r);\r\n                if (sub < 0 || state.field[sub] >= 0)\r\n                    continue; // wall\r\n                const next = movedPos(sub, r);\r\n                if (visited[next])\r\n                    continue;\r\n                q.push(next);\r\n            }\r\n        }\r\n        // unreachable\r\n        return false;\r\n    }\r\n    return true;\r\n}\r\nexports.checkReachability = checkReachability;\r\nfunction applyAct(state, act) {\r\n    const [y, x] = decomposeAct(act);\r\n    if (x % 2 == 0 && y % 2 == 0) {\r\n        // piece movement\r\n        state.poses[state.turn] = act;\r\n    }\r\n    else if (x % 2 != y % 2) {\r\n        // wall placement\r\n        state.walls[state.turn]--;\r\n        const dir = (y % 2 == 0) ? 3 : 2;\r\n        let now = act;\r\n        for (let i = 0; i < 3; i++) {\r\n            state.field[now] = 9;\r\n            now = movedPos(now, dir);\r\n        }\r\n    }\r\n    state.turn = 1 - state.turn;\r\n}\r\nexports.applyAct = applyAct;\r\nfunction isGameOver(state) {\r\n    if (state.poses[0] < 17) {\r\n        return 0;\r\n    }\r\n    else if (state.poses[1] >= 16 * 17) {\r\n        return 1;\r\n    }\r\n    return -1;\r\n}\r\nexports.isGameOver = isGameOver;\r\n\n\n//# sourceURL=webpack://%5Bname%5D/./src/quoridor_core.ts?");

/***/ })

/******/ });