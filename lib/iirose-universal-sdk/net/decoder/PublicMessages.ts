import { decode } from 'html-entities'
import { events } from '../events'

export interface replyMessage {
  message: string,
  username: string,
  time: number
}

interface data {
  timestamp: number,
  avatar: string,
  username: string,
  message: string,
  color: string,
  uid: string,
  title: string,
  messageId: number,
  replyMessage: replyMessage[] | null
}

const replyMsg = (msg: string): replyMessage[] | null => {
  if (msg.includes(' (_hr) ')) {
    const replies: replyMessage[] = []

    msg.split(' (hr_) ').forEach(e => {
      if (e.includes(' (_hr) ')) {
        const tmp = e.split(' (_hr) ')
        const user = tmp[1].split('_')

        replies.unshift({
          message: decode(tmp[0]),
          username: decode(user[0]),
          time: Number(user[1])
        })

        replies.sort((a, b) => {
          return (a.time - b.time)
        })
      } else {
        // @ts-ignore
        replies.unshift(e)
      }
    })

    return replies
  }

  return null
}

export default (input: string) => {
  if (input.substring(0, 1) !== '"') return false

  const message: string = input.substring(1)

  if (message.indexOf('<') !== -1) {
    let parser = false

    const tmp1 = message.split('<')
    tmp1.forEach(e => {
      const tmp = e.split('>')
      if (/^\d+$/.test(tmp[0])) {
        if (tmp.length === 11) {
          parser = true
          const reply = replyMsg(tmp[3])

          events.emit('message.public', {
            timestamp: Number(tmp[0]),
            avatar: tmp[1],
            username: decode(tmp[2]),
            message: decode(reply ? String(reply.shift()) : tmp[3]),
            color: tmp[5],
            uid: tmp[8],
            title: tmp[9],
            messageId: Number(tmp[10]),
            replyMessage: reply
          })
        } else if (tmp.length === 12) {
          if (tmp[3] === "'1") {
            parser = true
            const msg = {
              timestamp: Number(tmp[0]),
              avatar: tmp[1],
              username: decode(tmp[2]),
              color: tmp[5],
              uid: tmp[8],
              title: tmp[9],
              room: tmp[10]
            }

            // Bot.emit('JoinRoom', msg)
            events.emit('room.join', msg)
          } else if (tmp[3].substr(0, 2) === "'2") {
            parser = true
            const msg = {
              timestamp: Number(tmp[0]),
              avatar: tmp[1],
              username: decode(tmp[2]),
              color: tmp[5],
              uid: tmp[8],
              title: tmp[9],
              room: tmp[10],
              targetRoom: tmp[3].substr(2)
            }

            // Bot.emit('SwitchRoom', msg)
            events.emit('room.switch', msg)
          } else if (tmp[3] === "'3") {
            parser = true
            const msg = {
              timestamp: Number(tmp[0]),
              avatar: tmp[1],
              username: decode(tmp[2]),
              color: tmp[5],
              uid: tmp[8],
              title: tmp[9],
              room: tmp[10]
            }

            events.emit('room.leave', msg)
          }
        }
      }
    })

    return parser
  } else {
    const tmp = message.split('>')
    if (tmp.length === 11) {
      if (/^\d+$/.test(tmp[0])) {
        const reply = replyMsg(tmp[3])
        const message = reply ? String(reply.shift()) : tmp[3]

        const msg = {
          timestamp: Number(tmp[0]),
          avatar: tmp[1],
          username: decode(tmp[2]),
          message: decode(message),
          color: tmp[5],
          uid: tmp[8],
          title: tmp[9],
          messageId: Number(tmp[10]),
          replyMessage: reply
        }

        events.emit('message.public', msg)
        return true
      }
    }
  }
}