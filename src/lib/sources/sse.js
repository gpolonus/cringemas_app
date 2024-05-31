import { openModal } from "..";

let clientId;
// Only holding here for reconnection purposes
let chosenCharacters;

export const url = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : 'api';

export const fetchCharacters = () => {
  return fetch(`${url}/characters`).then(res => res.json())
}

export const openConnection = (handleMessage) => {
  connect(handleMessage)
}

export const connect = (handleMessage) => {
  let resolve;
  const promise = new Promise(r => {
    resolve = r
  })

  const source = new EventSource(`${url}/lines`);

  source.addEventListener("open", (e) => {
    console.log("connected", e);
    resolve()
  });

  source.addEventListener("message", (e) => {
    const { type, data } = JSON.parse(e.data)
    console.log('message:', type, data)
    if (type === 'clientId') {
      console.log('Setting clientId:', data.clientId)
      clientId = data.clientId
    }
    handleMessage(type, data)
  });

  // SSE error or termination
  source.addEventListener("error", (e) => {
    openModal(
      'error',
      'You have been disconnected from the server, hit the Reconnect button or refresh the page and reselect your character(s) to get back in.',
      'Reconnect',
      () => {
        // Adding the setTimeout so that the closure isn't recursive
        // If it was, it probably wouldn't be bad, but it feels icky
        setTimeout(async () => {
          await connect(handleMessage)
          selectCharacter(chosenCharacters)
        })
      }
    )
    if (e.eventPhase === EventSource.CLOSED) {
      console.log("disconnected");
    } else {
      console.log("error", e.message);
    }
  });

  window.onbeforeunload = () => {
    console.log('closing bc of unload')
    source.close()
  }

  return promise
}

export const selectCharacter = (chars) => {
  chosenCharacters = chars
  return fetch(`${url}/selectCharacter?id=${clientId}&character=${chars.join(',')}`)
}

export const finishLine = () => {
  return fetch(`${url}/finishedLine`)
}

export const backtrackLine = () => {
  return fetch(`${url}/backtrackLine`)
}


