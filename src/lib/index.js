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
    case 'line':
      lineComingUpStore.set(data?.nextNextCharacter)
      clientLineStore.set(data?.line)
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
    openModal('error', e)
  })
}

export const finishLine = () => {
  clientLineStore.set('')
  return ds.finishLine()
}

export const backtrackLine = () => {
  return ds.backtrackLine()
    .then((res) => {
      if (res.status !== 200) {
        openModal('error', "You are at the beginning, you can't go backwards")
      }
    })
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
