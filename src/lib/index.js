// place files you want to import through the `$lib` alias in this folder.
import { writable } from 'svelte/store';
import * as ds from './sources/sse';

export const clientLineStore = writable();
export const lineComingUpStore = writable('');
export const characterListStore = writable();
export const GAME_STATUSES = {
  UNSTARTED: 0,
  STARTED: 1,
  FINISHED: 2,
}
export const gameStatusStore = writable(GAME_STATUSES.UNSTARTED)

export const handleMessage = (type, data) => {
  switch(type) {
    // Runtime events
    case 'starting':
      gameStatusStore.set(GAME_STATUSES.STARTED)
      break;
    case 'characters':
      characterListStore.set(data)
      break;
    case 'lineComingUp':
      lineComingUpStore.set(data)
      break;
    case 'line':
      lineComingUpStore.set(0)
      clientLineStore.set(data)
      break;
    case 'finished':
      gameStatusStore.set(GAME_STATUSES.FINISHED)
      break;

    // Admin resetting events
      break;
    case 'reset':
      gameStatusStore.set(GAME_STATUSES.UNSTARTED)
      characterListStore.set(data)
      lineComingUpStore.set()
      clientLineStore.set('')
      break;

  }
}

export const openConnection = () => {
  return ds.openConnection(handleMessage)
}

export const selectCharacter = (character) => {
  return ds.selectCharacter(character).catch(e => {
    // TODO: something here, probably related to an error store and modal
    // TODO: abstract error handling into an HOC
  })
}

export const finishLine = () => {
  clientLineStore.set('')
  return ds.finishLine()
}

// **********
// * Modal Messages
// **********

export const alertMessage = writable();

export const openModal = (type, message) => {
  alertMessage.set({ type, message })
}

export const clearModal = () => {
  alertMessage.set()
}

// **********
// * Admin Endpoints
// **********

export const fetchScript = (pw) => {
  return fetch(`${ds.url}/admin/script?pw=${pw}`)
    .then(res => res.json())
    .catch(() => {
      openModal('error', "Failed to get script")
    })
}

export const adminResetState = (pw) => {
  return fetch(`${ds.url}/admin/reset?pw=${pw}`)
}

export const adminResetCurrentLine = (pw, line) => {
  return fetch(`${ds.url}/admin/resetLine?pw=${pw}&line=${line}`)
}
