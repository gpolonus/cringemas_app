
const fetchCharacters = () => {
  return []
}

let socket
const openConnection = (handleMessage) => {
  socket = new WebSocket(`ws://${location.hostname}`);

  socket.addEventListener('open', e => console.log('socket opened!'))
  socket.addEventListener('close', e => console.log('socket closed!'))

  socket.addEventListener('message', e => {
    const { type, data } = JSON.parse(e.data)
    handleMessage(type, data)
  })
}

const finishLine = () => {
  socket.send({ type: 'finished' })
}

export default {
  fetchCharacters,
  openConnection,
  finishLine
}

