const username = localStorage.getItem('username');
const user = async () => {
    const fetchUrl = "/api/user/" + username;
    const response = await fetch (fetchUrl, {
    method: 'get', 
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
const body = await response?.json();
console.log(body);
if (response?.status === 200) {
    return body
  }
}


notes = async () => {
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
    console.log(body);
    return body;
  }
  return "error";
};



async function displayBoard() {
    const currUser = await user();
    const currBuddy = currUser?.buddies[0];
    localStorage.setItem('currBuddy', currBuddy);
    document.querySelector('#boardHeader').innerHTML = currBuddy + "'s and Your Board";
    placeNotes();
}

async function placeNotes() {
    const noteStart1 = '<div draggable="true" class="box"> <button onclick="deleteNote(';
    const noteStart2 = ')" class ="btn btn-outline-danger" id="deleteButton">x</button><div>'
    outputString = "";
    noteBody = await notes();
    notesText = noteBody?.notes;
    length = notesText?.length;
    outputString = "";

    for(i = 0; i < length; i++) {
        note = await notesText[i];
        console.log(notesText);
            outputString = outputString + noteStart1 + i + noteStart2 + note + '</div></div>';
    }
    
    document.querySelector('#buddyNotes').innerHTML = outputString;
}

async function deleteNote(i) {
    const fetchUrl = "/api/user/deleteNote";
    const response = await fetch (fetchUrl, {
    method: 'delete',
    body: JSON.stringify({index : i, usernames : [localStorage.getItem("currBuddy"), username]}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});

    displayBoard();
}

function addNote() {
    text = document.querySelector('#newNoteText').value;
    objects.push({type: 'text', data: text});
    document.querySelector('#newNoteText').value = '';
    updateBoard();
    placeNotes();
}