# Cringemas App that does something

## Steps

1. person selects a character
  1. character is saved to localstorage? just in case
  1. user needs to know what characters are available --> endpoint
1. socket is opened
1. once all the characters are selected, the play begins
1. The person whose turn it is gets the message
1. They finish their part, hit the button, and then the next person goes
1. play continues until the play is over


## Nice to haves

- "Rooms"
  - several "plays" running at once


# TODOs
- [x] back button on the existing line person
- [x] color picker
- [x] close dialogs on admin action completion
- [o] pop error modals on ALL endpoint/sse errors
  - already have this for many of them, but would like to put error handling in a HOC and have the error messages come from the BE
- [x] pm2 running BE
- [x] pm2 releasing the ports on BE close
- [x] line 110 error
  - this is patched for now, but needs proper reconnecting functionality on the FE
  - much larger issue around phones going to sleep and properly reconnecting
  - has to do with resending the characters and ensuring the client IDs are synced between BE and FE methinks
  - is there an open event I can listen to? Hopefully!
    - I think there is a weird race condition happening here with the connection opening taking a sec after the phone is woken up
    - this was absolutely right, and listening to the open event and resending the chosen characters on open if disconnected fixed it
- [] disable line setting when the game hasn't started
  - this already doesn't do anything when the game isn't running

## Tests to Perform
- [x] multiple characters for one client
- [x] What happens on finish?
- [x] Error Modal
  - dialog element for this
- admin actions
  - [x] reseting all
  - [x] resetting the line
- [x] rejoining in place after leaving
  - [x] bob leaves and rejoins when it's his line
  - [x] bob leaves and rejoins when it's not his line
  - [x] bob leaves and rejoins when his line is next
    - can I just resend the line data on rejoin?
  - client with bob and alice leaves
    - [x] when it's alice's line
    - [x] when it's bob's line
- [x] stress testing number of connections on server


## Future todos
- [] color coding of stage direction vs line
- [] colors for different characters
- [x] prompt user when the next line is there's
- [] list word count for each character in the signup screen
- [] don't continue the play if not all characters are present
  - disable the button if not all characters are there
  - have existing players pick up other characters if someone leaves permanently
    - for now this can be fixed via resetting the line number

