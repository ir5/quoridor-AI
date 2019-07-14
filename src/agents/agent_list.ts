import {State, Act} from "../quoridor_core";
// import {naiveAgent} from "./naive/naive"
import {alphaBetaAgent} from "./alphabeta/alphabeta";

type Agent = (st: State) => Act;
export const agent_list: {[_: string]: Agent} = {
  // "Manual": null,
  "CPU Lv.1": (state: State) => { return alphaBetaAgent(state, 1); },
  "CPU Lv.2": (state: State) => { return alphaBetaAgent(state, 2); },
  "CPU Lv.3": (state: State) => { return alphaBetaAgent(state, 3); },
  "CPU Lv.4": (state: State) => { return alphaBetaAgent(state, 4); },
};
