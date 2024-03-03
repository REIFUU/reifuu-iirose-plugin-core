import { EventEmitter } from "../lib/events";
import { getHookedSocket } from "../iirose/ws";

export const events = new EventEmitter()

getHookedSocket(
  (data) => {
    // 收到信息
    // events.emit('rx', data)
    return true
  },
  (data) => {
    // 发送信息
    // events.emit('tx', data)
    return true
  }
)