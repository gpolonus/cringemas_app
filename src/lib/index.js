// place files you want to import through the `$lib` alias in this folder.
import { writable } from 'svelte/store';
import * as ds from './sources/sse';

export const clientLineStore = writable();
export const lineComingUpStore = writable('');
export const characterListStore = writable();
export const GAME_STATUSES = {
  UNSTARTED: 0,
  STARTED: 1,
  FINISHED: 2
}
export const gameStatusStore = writable(GAME_STATUSES.UNSTARTED)

export const fetchCharacters = ds.fetchCharacters

export const handleMessage = (type, data) => {
  switch(type) {
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

      // TODO: add some sort of finishing state
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

// TODO: would be nice to pass the character into the ds automagically instead of in the presentation layer

