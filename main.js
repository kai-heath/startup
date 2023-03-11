accountInfo = JSON.parse(localStorage.getItem('user'));
console.log("yeet");
username = accountInfo.username;
password = accountInfo.password;
requests = ['your_dad'];
if(accountInfo.requests) {
    requests = accountInfo.requests;
}
buddies = [{username: 'Kai', objects: [{type: 'text', data: 'this is your first note!'}, {type: 'text', data: 'and another one!'}]},{username: 'Your_Mom', objects: [{type: 'text', data: 'You are a dissapointment'}, {type: 'text', data: 'a waste of 9 months'}]}];
if (accountInfo.buddies) {
    buddies = accountInfo.buddies;
}
currBuddy = buddies[0];
if (localStorage.getItem('currBuddy')) {
    currBuddy = JSON.parse(localStorage.getItem('currBuddy'));
}
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
    buddies[0] = currBuddy;
    accountInfo.buddies = buddies;
    localStorage.setItem('user', JSON.stringify(accountInfo));
    accounts = JSON.parse(localStorage.getItem('accounts'));
    i = accounts.findIndex(item => item.username === username);
    accounts[i] = accountInfo;
    localStorage.setItem('accounts', JSON.stringify(accounts));
}


function displayBuddies() {
    buddyNamesString  = "";
    const startString1 = '<a class="buddyLink"onclick="changeCurrBuddy(';
    const startString2 =  ')"href="board.html">';
    for(i = 0; i < buddies.length; i++) {
        buddy = buddies[i];
        buddyName = buddy.username;
        buddyNamesString = buddyNamesString + startString1 + i + startString2 + buddyName + '</a><br>';
    }
    document.querySelector('#buddyList').innerHTML = buddyNamesString;
}

function changeCurrBuddy(i) {
   newFirst = buddies[i];
   buddies.splice(i,1);
   buddies.unshift(newFirst);
   localStorage.setItem('currBuddy', JSON.stringify(newFirst));
   currBuddy = newFirst;
   updateBoard();
}

function loadRequests() {
    outputString = "";
    for(i = 0; i < requests.length; i++) {
        stringEnd = '<button class = "btn btn-success"onclick="acceptBuddy('+ i +')">accept</button><button class = "btn btn-secondary"onclick="buddyReject('+i+')">reject</button>';
        request = requests[i];
            outputString = '<p>'+request + stringEnd+ '</p>';
    }
    document.querySelector('#requestTable').innerHTML = outputString;
}