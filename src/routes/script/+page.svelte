<script>
  import { fetchScript } from '$lib'

  let lines = []

  async function fetchScriptHandler() {
    const password = prompt("What's the admin password?")
    if (password) {
      lines = await fetchScript(password)
      console.log({ lines })
    }
  }

</script>

<style>
  .script {
    text-align: left;
    padding: 0 1rem;
  }
</style>

{#if !lines.length}
<div>
  <button on:click={fetchScriptHandler}>
    Fetch Script
  </button>
</div>
{/if}

<div class="script">
  {#each lines as { character, direction, line }, i}
    <div class="line">
      <strong>{i}</strong>: {character}: <i>({direction})</i> {line}
    </div>
  {/each}
</div>
