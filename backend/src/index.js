
//*******
//* SETUP STUFF
//*******

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { getLines } from './csvLines.js';

const app = express();

// if (process.env === 'development') {
  app.use(cors());
// }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = 3000;

const GAME_STATUSES = {
  UNSTARTED: 0,
  STARTED: 1,
  FINISHED: 2
}

//*******
//* START OF APPLICATION STATE
//*******

let clients = [];
// let lines = [
//   {"character": "Bob", "line": "Hey Alice, how are you doing today?"},
//   {"character": "Alice", "line": "I'm doing well, thanks for asking."},
//   {"character": "Eve", "line": "Hi guys, what's up?"},
//   {"character": "Bob", "line": "Not much, just catching up with Alice."},
//   {"character": "Alice", "line": "Yeah, we were just chatting."},
//   {"character": "Eve", "line": "Mind if I join?"},
//   {"character": "Bob", "line": "Of course not, the more the merrier."},
//   {"character": "Alice", "line": "Yeah, it'll be fun to have you here."},
//   {"character": "Eve", "line": "Great! So, what were you two talking about?"}
// ];
let lines = [
  {"character": "Bob", "line": "Hey Alice, how are you doing today?", "direction": "smiling and waving"},
  {"character": "Alice", "line": "I'm doing well, thanks for asking.", "direction": "cheerfully"},
  {"character": "Eve", "line": "Hi guys, what's up?", "direction": "curiously"},
  {"character": "Bob", "line": "Not much, just catching up with Alice.", "direction": "casually"},
  {"character": "Alice", "line": "Yeah, we were just chatting.", "direction": "nodding"},
  {"character": "Charlie", "line": "Hey everyone! What are you talking about?", "direction": "excitedly"},
  {"character": "Eve", "line": "Just about our plans for the weekend.", "direction": "enthusiastically"},
  {"character": "Dave", "line": "Did someone mention the weekend? Count me in!", "direction": "eagerly"},
  {"character": "Bob", "line": "Great! Any ideas on what we should do?", "direction": "inquisitively"},
  {"character": "Alice", "line": "How about a hike? The weather's supposed to be nice.", "direction": "suggestively"},
  {"character": "Eve", "line": "I love hiking! That's a great idea.", "direction": "happily"},
  {"character": "Charlie", "line": "I'm in! We could also have a picnic afterward.", "direction": "enthusiastically"},
  {"character": "Dave", "line": "A picnic sounds perfect.", "direction": "agreeably"},
  {"character": "Faythe", "line": "Hi everyone! What are we planning?", "direction": "curiously, joining the group"},
  {"character": "Alice", "line": "Hi Faythe! We're planning a hike and a picnic for the weekend.", "direction": "informatively"},
  {"character": "Grace", "line": "That sounds like fun! Can I join too?", "direction": "eagerly"},
  {"character": "Bob", "line": "Of course, Grace! The more, the merrier.", "direction": "welcomingly"},
  {"character": "Eve", "line": "It's going to be a fantastic weekend.", "direction": "excitedly"},
  {"character": "Charlie", "line": "Absolutely! Let's finalize the details.", "direction": "enthusiastically"},
  {"character": "Dave", "line": "How about we meet at 10 AM at the trailhead?", "direction": "suggestively"},
  {"character": "Faythe", "line": "10 AM works for me.", "direction": "agreeably"},
  {"character": "Grace", "line": "Same here. Can't wait!", "direction": "excitedly"},
  {"character": "Alice", "line": "It's settled then! See you all at 10 AM.", "direction": "happily"},
  {"character": "Bob", "line": "Looking forward to it!", "direction": "smiling"}
]
const characters = Object.keys(lines.reduce((ac, { character: c }) => ({ ...ac, [c]: true }), {}))
let remainingCharacters = characters
let gameStatus = GAME_STATUSES.UNSTARTED;
let currentLine = 0;

//*******
//* END OF APPLICATION STATE
//*******


//*******
//* ENDPOINTS
//*******

function linesHandler(req, res, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    // 'X-Accel-Buffering': 'no',
  };
  res.writeHead(200, headers);

  const clientId = Date.now().toString();

  const client = {
    id: clientId,
    res,
    send(type, data) {
      console.log(`sent ${clientId} a ${type} message with data:`, data)
      this.res.write(`data: ${JSON.stringify({ type, data })}\n\n`)
    },
    characters: []
  };

  clients.push(client);

  client.send('clientId', { clientId })

  console.log('Connection opened:', clientId)

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);

    if (client.characters.length)
      remainingCharacters.push(...client.characters)
  });
}

app.get('/lines', linesHandler);

app.get('/characters', (req, res) => {
  console.log('started /characters')
  const chosenCharacters = clients.map(cl => cl.character)
  const remainingCharacters = characters.filter(c => !chosenCharacters.includes(c))
  res.json({ characters: remainingCharacters })
  console.log('ended /characters')
})

function sendMessageToAll(type, data) {
  clients.forEach(client => client.send(type, data))
}

// TODO: add an id checker middleware and error handling around that
app.get('/selectCharacter', (req, res) => {
  const clientId = req.query.id
  const character = req.query.character

  if (remainingCharacters.includes(character)) {
    remainingCharacters = remainingCharacters.filter(c => c !== character)
  } else {
    res.status(404).send('Character no longer available, pick another one')
  }

  const client = clients.find(({ id }) => console.log({ id, clientId, true: clientId === id }) || clientId === id)

  if (!client) {
    // error, ya dun fucked up
  }

  client.characters.push(character)
  console.log(client.id, client.characters)

  res.send()

  console.log({ remainingCharacters })

  if (remainingCharacters.length) {
    sendMessageToAll('characters', remainingCharacters)
  } else {
    if (gameStatus === GAME_STATUSES.STARTED) {
      // leave the started dogs lie
    } else {
      gameStatus = GAME_STATUSES.STARTED
      sendMessageToAll('starting')
    }

    setTimeout(() => {
      // either send out the line to the first character, or send the line out to a reconnecting character if it is their turn
      const currentLineCharacter = lines[currentLine].character
      const currentLineClient = clients.find(({ characters: cs }) => cs.includes(currentLineCharacter))
      if (currentLine === 0 || currentLineClient.id === clientId) {
        currentLineClient.send('line', lines[currentLine])

        const nextCharacter = lines[currentLine + 1].character
        const nextClient = clients.find(({ characters: cs }) => cs.includes(nextCharacter))
        nextClient.send('lineComingUp', nextNextCharacter)
      }
    }, 2000)
  }
})

// TODO: This should check that the client is the same character as the current line or something like that
// Right now this finishes the line regardless of who made the request
app.get('/finishedLine', (req, res) => {
  currentLine++;
  const nextLine = lines[currentLine]
  if (!nextLine) {
    sendMessageToAll('finished')
  } else {
    const nextCharacter = nextLine.character
    const nextClient = clients.find(({ characters: cs }) => cs.includes(nextCharacter))
    nextClient.send('line', nextLine)

    const nextNextCharacter = lines[currentLine + 1].character
    const nextNextClient = clients.find(({ characters: cs }) => cs.includes(nextNextCharacter))
    nextNextClient.send('lineComingUp', nextNextCharacter)
  }

  res.send()
});


//*******
//* APP INITIALIZATION
//*******

// const csvLinesPath = ''
// lines = await getLines(csvLinesPath)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})

