<script>

  import { onMount } from 'svelte'
  import {
    characterListStore,
    openConnection,
    clientLineStore,
    gameStatusStore,
    GAME_STATUSES,
    finishLine,
    selectCharacter,
    fetchCharacters,
    lineComingUpStore
  } from '$lib'

  let characterSelectValue = ''
  let charactersSelection = []

  onMount(async () => {
    console.log('opening connection')
    await openConnection()
    console.log('opened connection')
    console.log('fetching characters')
    $characterListStore = (await fetchCharacters()).characters;
    console.log($characterListStore)
  });

  const selectCharacterHandler = () => {
    charactersSelection = [...charactersSelection, characterSelectValue]
    selectCharacter(characterSelectValue)
  }

</script>

<style>

</style>

<svelte:head>
  <title>
    HAPPY CRINGEMAS MOTHER FUCKERS
  </title>
</svelte:head>

{#if $gameStatusStore === GAME_STATUSES.UNSTARTED}
  <h1>Pick a character!</h1>
  <h3>or characters</h3>

  {#if charactersSelection.length}
    <h3>Chosen character(s): {charactersSelection.join(', ')}</h3>
  {/if}

  <select bind:value={characterSelectValue}>
  {#each $characterListStore as c }
    <option value={c}>{c}</option>
  {/each}
  </select>
  <button on:click={selectCharacterHandler}>Select Character</button>
{:else if $gameStatusStore === GAME_STATUSES.STARTED}
  {#if $clientLineStore }
    <h3>Character:</h3>
    <h2>{$clientLineStore.character}</h2>
    <h3>Direction:</h3>
    <h2>{$clientLineStore.direction}</h2>
    <h3>Line:</h3>
    <h1>{$clientLineStore.line}</h1>
    <button on:click={finishLine}>Finished Line</button>
  {:else if $lineComingUpStore}
    <h1>{$lineComingUpStore}'S LINE IS NEXT!</h1>
  {:else}
    <h1>WAIT, IT'S NOT YOUR TURN</h1>
  {/if}
{:else if $gameStatusStore === GAME_STATUSES.FINISHED}
  <h1>THE END</h1>
  <h1>TAKE A BOW</h1>
{/if}
