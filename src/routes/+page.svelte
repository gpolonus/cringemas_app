<script>

  import { onMount } from 'svelte'
  import {
    characterListStore,
    openConnection,
    clientLineStore,
    gameStatusStore,
    GAME_STATUSES,
    finishLine,
    backtrackLine,
    selectCharacter,
    lineComingUpStore
  } from '$lib'
  import ItemSelect from '../lib/item-select.svelte';

  let charactersSelection = []
  let showCharacterPicker = true
  $: {
    // Fix for admin state reset
    if ($gameStatusStore === GAME_STATUSES.STARTED) {
      showCharacterPicker = true
    }
  }

  onMount(async () => {
    console.log('opening connection')
    await openConnection()
    console.log('opened connection')
  });

  $: {
    charactersSelection = charactersSelection.filter(c => $characterListStore.includes(c))
  }

  const selectCharacterHandler = () => {
    showCharacterPicker = false
    selectCharacter(charactersSelection)
    charactersSelection = []
  }

</script>

<style>
  .content {
    padding: 20px;
    text-align: center;
    background: var(--primary);
  }

  .current-line {
    background-color: var(--secondary);
    border-radius: 1rem;
  }

  .next-line-alert {
    padding-top: 2rem;
  }

</style>

<div class="content {!!$lineComingUpStore ? 'line-coming-up' : ''}">
{#if $gameStatusStore === GAME_STATUSES.UNSTARTED}
  <div class="character-select">
    {#if showCharacterPicker}
      <h1>Pick a characters!</h1>

      <ItemSelect items={$characterListStore} bind:value={charactersSelection} />

      {#if charactersSelection.length}
        <button on:click={selectCharacterHandler}>Select Character{charactersSelection.length > 1 ? 's' : ''}</button>
      {/if}
    {:else}
      <h1>WAIT FOR THE PLAY TO START</h1>
    {/if}
  </div>
{:else if $gameStatusStore === GAME_STATUSES.STARTED}
  <div class="play">
  {#if $clientLineStore}
    <h3><u>Character:</u></h3>
    <h2>{$clientLineStore.character}</h2>
    <h3><u>Direction:</u></h3>
    <h2>{$clientLineStore.direction}</h2>
    <h3><u>Line:</u></h3>
    <h1 class="current-line">{$clientLineStore.line}</h1>
    <button on:click={backtrackLine}>Go Back</button>
    <button on:click={finishLine}>Finish Line</button>
  {/if}

  {#if $lineComingUpStore}
    <h1 class="next-line-alert underline">{$lineComingUpStore}'S LINE IS NEXT!</h1>
  {/if}

  {#if !$lineComingUpStore && !$clientLineStore}
    <h1>WAIT, IT'S NOT YOUR TURN</h1>
  {/if}
  </div>
{:else if $gameStatusStore === GAME_STATUSES.FINISHED}
  <div class="the-end">
    <h1>THE END</h1>
    <h1>TAKE A BOW</h1>
  </div>
{/if}
</div>
