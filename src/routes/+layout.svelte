<script>
  import {
    alertMessage,
    openModal,
    clearModal,
    adminResetState,
    adminResetCurrentLine,
  } from '$lib'
    import ItemSelect from '../lib/item-select.svelte';

  let dialogEl;
  let adminDialogEl;

  $: {
    if (dialogEl) {
      if ($alertMessage) {
        dialogEl.showModal()
      } else {
        dialogEl.close()
      }
    }
  }

  $: type = $alertMessage ? $alertMessage.type : ''
  $: message = $alertMessage ? $alertMessage.message : ''

  const requestPassword = () => {
    return prompt("What's the admin password?")
  }

  const resetState = () => {
    const password = requestPassword()
    adminResetState(password)
      .then((res) => {
        if (res.status !== 200) {
          closeAdminModal()
          openModal('error', 'Incorrect password')
          return
        }

        closeAdminModal()
        openModal('message', 'Play state entirely reset')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const resetCurrentLine = () => {
    const password = requestPassword()
    const line = prompt(`What line do you want to reset to?`)
    adminResetCurrentLine(password, line)
      .then((res) => {
        if (res.status !== 200) {
          closeAdminModal()
          openModal('error', 'Incorrect password')
          return
        }

        closeAdminModal()
        openModal('message', `Play set to line ${line}`)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const openAdminModal = () => {
    adminDialogEl.showModal()
  }

  const closeAdminModal = () => {
    adminDialogEl.close()
  }


  //*******
  //* COLORS
  //*******
  let colorDialogEl;

  const DEFAULTS = {
    primary: '#008000',
    secondary: '#662233',
    text: 'white',
  }
  let primaryColor = localStorage.getItem('primary-color') || DEFAULTS.primary
  let secondaryColor = localStorage.getItem('secondary-color') || DEFAULTS.secondary
  let textColor = localStorage.getItem('text-color') || DEFAULTS.text
  $: colorStyles = `--primary:${primaryColor};--secondary:${secondaryColor};--text-color:${textColor}`

  $: {
    console.log({ primaryColor })
    localStorage.setItem('primary-color', primaryColor)
  }
  $: {
    console.log({ secondaryColor })
    localStorage.setItem('secondary-color', secondaryColor)
  }
  $: {
    console.log({ textColor })
    localStorage.setItem('text-color', textColor)
  }

  function openColorsModal() {
    colorDialogEl.showModal()
  }

  function closeColorsModal() {
    colorDialogEl.close()
  }

  function resetColors() {
    primaryColor = DEFAULTS.primary
    secondaryColor = DEFAULTS.secondary
    textColor = DEFAULTS.text
  }

  //********
  //* UPLOAD FORM
  //********
  let uploadFormEl;

  function swallowSubmitHandler(e) {
    e.preventDefault()
    // alert('swallowing event')
    const password = requestPassword()
    uploadFormEl.attributes.action.value = `${uploadFormEl.attributes.action.value}?pw=${password}`
    return false
  }

  function submitUploadHandler(e) {
    e.preventDefault()
    uploadFormEl.submit()
  }

</script>

<style>
  :global(body) {
    position: relative;
    top: 0;
    left: 0;
    margin: 0;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
  }

  :global(.body) {
    position: relative;
    top: 0;
    left: 0;
    min-height: 100vh;
    text-align: center;
    background: var(--secondary);
    color: var(--text-color);
  }

  :global(.body:has(.line-coming-up)) {
    background: var(--primary);
  }

  .header {
    padding-top: 1rem;
    font-family: "Vast Shadow", serif;
  }

  :global(h1, h2, h3) {
    margin: 0;
    padding-bottom: 1rem;
    font-weight: 400;
  }

  :global(h1) {
    font-size: 3rem;
  }

  :global(h2) {
    font-size: 2rem;
  }

  :global(h3) {
    font-size: 1.5rem;
  }

  :global(.underline) {
    text-decoration: underline;
  }

  :global(button) {
    position: relative;
    padding: 1rem;
    margin-top: 1rem;
    border: 2px solid black;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 4px 4px 0 0px black;
  }

  :global(button:active) {
    transform: translate(4px, 4px);
    box-shadow: unset;
  }

  dialog {
    padding: 2rem;
    max-height: calc(100vh - 210px);
    overflow-y: auto;
  }

  dialog.modal-body {
    max-height: calc(100vh - 210px);
    overflow-y: auto;
  }

  dialog::backdrop {
    background-color: rgba(aquamarine, 0.5);
  }

  dialog h1 {
    text-transform: capitalize;
  }

  dialog.error {
    border-color: red;
    background-color: lightcoral;
  }

  dialog.colors div.fields {
    text-align: left;
    --text-color: black;
  }

  dialog.colors div.field {
    padding: 1rem;
  }

  footer {
    padding: 2rem 0 0.5rem ;
    font-size: 0.75rem;
  }

  footer a {
    color: var(--text-color);
  }

  footer div {
    display: inline-block;
    padding: 0 0.25rem;
  }
</style>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Vast+Shadow&display=swap" rel="stylesheet">
  <title>
    HAPPY CRINGEMAS MOTHER FUCKERS
  </title>
</svelte:head>

<div class="body" style={colorStyles}>
  <div class="header">
    <h2>
      MERRY CRINGEMAS
    </h2>
  </div>

  <dialog bind:this={dialogEl} class={type}>
    <h1>{type}</h1>
    <div>{message}</div>
    <div>
      <button on:click={clearModal}>Close</button>
    </div>
  </dialog>

  <dialog bind:this={adminDialogEl}>
    <h1>Admin Actions</h1>
    <div>
      <button on:click={resetState}>Reset State</button>
    </div>
    <div>
      <button on:click={resetCurrentLine}>Reset Current Line</button>
    </div>
<!--
    <div>
      <h2>Upload CSV Script</h2>
      <form bind:this={uploadFormEl} on:submit={swallowSubmitHandler} action={`${serverUrl}/admin/upload-script`} method='post' enctype="multipart/form-data">
        <input type="file" name="csv-script" />
        <input type="submit" value="Submit" />
      </form>
    </div> -->

    <div>
      <button on:click={closeAdminModal}>Close</button>
    </div>
  </dialog>

  <dialog bind:this={colorDialogEl} class="colors">
    <h1>Color Selection</h1>
    <div class='fields'>
      <div class='field'>
        Primary Color: <input type="color" bind:value={primaryColor} />
      </div>
      <div class='field'>
        Secondary Color: <input type="color" bind:value={secondaryColor} />
      </div>
      <div class='field'>
        Text Color:
      </div>
      <ItemSelect items={['black', 'white']} bind:value={textColor} exclusive={true} />
    </div>
    <div>
      <button on:click={resetColors}>Reset Colors</button>
    </div>

    <div>
      <button on:click={closeColorsModal}>Close</button>
    </div>
  </dialog>

  <slot></slot>

  <footer>
    <div>
      <a on:click={openAdminModal} href=''>Admin</a>
    </div>
    <div>
      <a href="/script" target="_blank">Script</a>
    </div>
    <div>
      <a on:click={openColorsModal} href=''>Colors</a>
    </div>
    <div>
      © Griffin Polonus 2024. All Rights Reserved.
    </div>
  </footer>
</div>