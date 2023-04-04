
user = async (username) => {
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

async function searchBuddy() {
    username = localStorage.getItem("username");
    newBuddy = document.querySelector('#searchBuddy').value;
    if (!newBuddy) {
        outputMessage("please enter a username");
        return;
    }
    if (username === newBuddy) {
        outputMessage("you can't be friends with yourself");
        return;
    }
    buddyUser = await user(newBuddy);
    if (!buddyUser) {
        outputMessage("No user with that username found");
        return;
    }
    currUser = await user(username);
    buddies = currUser?.buddies;
    requested = currUser?.requested;
    if (buddies.includes(newBuddy)) {
        outputMessage("you are already buddies with " + newBuddy);
        return;
    }
    if (requested.includes(newBuddy)) {
        outputMessage("you already sent a request to " + newBuddy);
        return;
    }
    
    setBuddyRequest(newBuddy);
}

function outputMessage(string) {
    document.querySelector('#searchResponse').innerHTML = string;
}

function setBuddyRequest(newBuddy) {
    acceptButton = "<button class = 'btn btn-success' onclick = 'sendRequest("+'"'+newBuddy+'"'+")'>Send</button>";
    cancelButton = "<button class = 'btn btn-danger' onclick = 'cancelRequest()'>Cancel</button>";
    query = "<h3>Send Buddy request to " + newBuddy + "?</h3>"
    text = query + acceptButton + cancelButton;
    document.querySelector('#buddyAcceptResponse').innerHTML = (text);
}

async function sendRequest(newBuddy) {
    const fetchUrl = "/api/user/makeRequest";
    const response = await fetch (fetchUrl, {
    method: 'post', 
    body: JSON.stringify({request : newBuddy}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    }).then(
        console.log("yeet"),
        text = "<h3>Request succesfully send to " + newBuddy,
        document.querySelector('#buddyAcceptResponse').innerHTML = (text),   
        );
        body = response.json;
    }