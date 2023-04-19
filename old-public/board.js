
const user = async (username) => {
    const fetchUrl = "/api/user/" + username;
    const response = await fetch (fetchUrl, {
    method: 'get', 
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
const body = await response?.json();
if (response?.status === 200) {
    return body;
  }
}

notes = async (username) => {
  currBuddy = localStorage.getItem('currBuddy');
  const fetchUrl = "/api/user/board/" + [currBuddy, username];
  const response = await fetch (fetchUrl, {
  method: 'get',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
});
const body = await response?.json();
if (response?.status === 200) {
  return body;
}
return "error";
};

class board {
username;
socket;

constructor() {
  this.username = localStorage.getItem("username");
  this.configureWebSocket();
  this.displayBoard();
}


async displayBoard() {
    const currUser = await user(this.username);
    const currBuddy = currUser?.buddies[0];
    if (!currBuddy) {
      window.location.href = 'buddies.html';
      return;
    }
    localStorage.setItem('currBuddy', currBuddy);
    document.querySelector('#boardHeader').innerHTML = currBuddy + "'s and Your Board";
    this.placeNotes();
}

  async placeNotes() {
    const noteStart1 = '<div draggable="true" class="box"> <button onclick="Board.deleteNote(';
    const noteStart2 = ')" class ="btn btn-outline-danger" id="deleteButton">x</button><div>'
    
    let noteBody = await notes(this.username);
    let notesText = noteBody?.notes;
    let length = notesText?.length;
    let outputString = "";
    

    for (let i = 0; i < length; i++) {
        let note = notesText[i];
            outputString = outputString + noteStart1 + i + noteStart2 + note + '</div></div>';
    }
    
    document.querySelector('#buddyNotes').innerHTML = outputString;
}

async deleteNote(i) {
    const fetchUrl = "/api/user/deleteNote";
    const response = await fetch (fetchUrl, {
    method: 'delete',
    body: JSON.stringify({index : i, usernames : [localStorage.getItem("currBuddy"), this.username]}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});

this.broadcastEvent([localStorage.getItem("currBuddy"), this.username])
}

async addNote() {
    let text = document.querySelector('#newNoteText').value;
    document.querySelector('#newNoteText').value = '';
    const fetchUrl = "/api/user/addNote";
    const response = await fetch (fetchUrl, {
    method: 'post',
    body: JSON.stringify({newNote : text, usernames : [localStorage.getItem("currBuddy"), this.username]}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
this.broadcastEvent([localStorage.getItem("currBuddy"), this.username])
}

async addFunnyQuote() {
  let newNote = "";
  console.log("yeet");
  await fetch('https://api.chucknorris.io/jokes/random')
  .then((response) => response?.json())
  .then((jsonResponse) => {
   newNote = jsonResponse?.value;
  });
  console.log(newNote);

  const fetchUrl = "/api/user/addNote";
    const response = await fetch (fetchUrl, {
    method: 'post',
    body: JSON.stringify({newNote : newNote, usernames : [localStorage.getItem("currBuddy"), this.username]}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  this.broadcastEvent([localStorage.getItem("currBuddy"), this.username])
}

configureWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  
  this.socket.onmessage = async (event) => {
    const msg = JSON.parse(await event.data.text());
    const usernames = msg?.usernames;
    if (usernames.includes(this.username)) {
      this.placeNotes();
    }
  };
}

 broadcastEvent(usernames) {
  const event = {
    usernames : usernames
  };
  this.socket.send(JSON.stringify(event));
}
}


