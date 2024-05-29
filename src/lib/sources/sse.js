
let clientId;
// TODO: don't use this bullshit anymore
const url = 'http://localhost:3000'

export const fetchCharacters = () => {
  return fetch(`${url}/characters`).then(res => res.json())
}

export const openConnection = (handleMessage, character) => {
  connect(handleMessage, character)
}

export const connect = (handleMessage) => {
  const source = new EventSource(`${url}/lines`);

  source.addEventListener("open", (e) => {
    console.log("connected", e);
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
    if (e.eventPhase === EventSource.CLOSED) {
      console.log("disconnected");
    } else {
      console.log("error", e.message);
    }

    // TODO: test this out
    // setTimeout(() => connect(handleMessage))
  });
}

export const selectCharacter = (char) => {
  return fetch(`${url}/selectCharacter?id=${clientId}&character=${char}`)
}

export const finishLine = () => {
  return fetch(`${url}/finishedLine`)
}


