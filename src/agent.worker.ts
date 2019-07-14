// The following repository was useful for writing WebWorker code.
// https://github.com/Qwaz/webworker-with-typescript/tree/master/multiple-entry

import {State} from "./quoridor_core";
import {agent_list} from "./agents/agent_list";

const ctx: Worker = self as any;

ctx.addEventListener('message', message => {
  const [state_raw, agent_name] = message.data;
  const state = State.prototype.clone.apply(state_raw);  // State instance should be re-created
  const agent = agent_list[agent_name];
  const cpu_act = agent(state);
  ctx.postMessage([cpu_act, state.turn]);
});
