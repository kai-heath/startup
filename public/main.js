accountInfo = JSON.parse(localStorage.getItem('user'));
console.log("yeet");
const username = JSON.parse(localStorage.getItem('username'));
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

function displayAccount() {
    usernameField = document.querySelector("#username");
    buddyCount = document.querySelector("#buddyCount");
    usernameField.innerHTML = "Username: " + username;
    buddyCount.innerHTML = "Number of buddies: " + buddies.length;
}