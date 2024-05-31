import { clearModal, openModal } from "..";

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
      // 'You have been disconnected from the server, hit the Reconnect button or refresh the page and reselect your character(s) to get back in.',
      'You have been disconnected from the server, hit refresh the page and reselect your character(s) to get back in.',
      'Refresh',
      () => {
        // Calling `connect` here will open a whole nother connection when the
        // original one is trying to stay alive, thus creating more than one
        // connection per tab.
        // setTimeout(async () => {
        //   await connect(handleMessage)
        //   selectCharacter(chosenCharacters)
        //   clearModal()
        // })
        location.reload()
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
  return fetch(`${url}/selectCharacter?id=${clientId}&character=${chars.join(',')}`).then(res => {
    if (res.status !== 200) {
      openModal('error', 'Character not available')
    }
    return res
  })
}

export const finishLine = () => {
  return fetch(`${url}/finishedLine`)
}

export const backtrackLine = () => {
  return fetch(`${url}/backtrackLine`)
}


