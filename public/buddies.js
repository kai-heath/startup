const username = localStorage.getItem("username");


const user = async () => {
    const fetchUrl = "/api/user/" + username;
    const response = await fetch (fetchUrl, {
    method: 'get', 
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
const body = await response?.json();
if (response?.status === 200) {
    return body
  }
}

async function displayBuddies() {
    const currUser = await user();
    buddies = currUser?.buddies;
    buddyLength = buddies?.length;
    buddyNamesString  = "";
    const startString1 = '<a class="buddyLink"onclick="changeCurrBuddy(';
    const startString2 =  ')">';
    for(i = 0; i < buddyLength; i++) {
        buddy = buddies[i];
        buddyNamesString = buddyNamesString + startString1 + i + startString2 + buddy + '</a><br>';
    }
    document.querySelector('#buddyList').innerHTML = buddyNamesString;
}

async function changeCurrBuddy(i) {

    const fetchUrl = "/api/user/buddyOrder";
    const response = await fetch (fetchUrl, {
    method: 'post', 
    body: JSON.stringify({index : i}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
window.location.href = 'board.html';
}