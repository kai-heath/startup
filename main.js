accountInfo = JSON.parse(localStorage.getItem('user'));
username = accountInfo.username;
password = accountInfo.password;
buddies = [{username: 'Kai', objects: [{type: 'text', data: 'this is your first note!'}, {type: 'text', data: 'and another one!'}]}];
if (accountInfo.buddies) {
    buddies = accountInfo.buddies;
}
currBuddy = buddies[0];
objects = currBuddy.objects;

function displayBoard() {
    document.querySelector('#boardHeader').innerHTML = currBuddy.username + "'s and Your Board";
    placeNotes();
}

function placeNotes() {
    const noteStart1 = '<div draggable="true" class="box"> <button onclick="deleteNote(';
    const noteStart2 = ')" class ="btn btn-outline-danger" id="deleteButton">x</button><div>'
    outputString = "";
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        if (object.type = 'text') {
            outputString = outputString + noteStart1 + i + noteStart2 + object.data + '</div></div>'
        }
    }
    document.querySelector('#buddyNotes').innerHTML = outputString;
}

function deleteNote(i) {
    objects.splice(i,1);
    updateBoard();
    placeNotes();
}

function addNote() {
    text = document.querySelector('#newNoteText').value;
    objects.push({type: 'text', data: text});
    document.querySelector('#newNoteText').value = '';
    updateBoard();
    placeNotes();
}

function updateBoard() {
    currBuddy.objects = objects;
    buddies[0] = currBuddy;
    accountInfo.buddies = buddies;
    localStorage.setItem('user', JSON.stringify(accountInfo));
}