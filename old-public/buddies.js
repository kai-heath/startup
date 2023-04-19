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
    if(buddyLength == 0) {
      document.querySelector('#buddyList').innerHTML = "<h4 style='text-align:center;'>looks like you don't have any buddies, go add some!</h4>";
      return;
    }
    buddyNamesString  = "";
    const startString1 = '<a class="buddyLink"onclick="changeCurrBuddy(';
    const startString2 =  ')">';
    for(i = 0; i < buddyLength; i++) {
        buddy = buddies[i];
        unfriendButton = '<button class="btn btn-sm btn-danger"onclick="deleteBuddy(' + i + ')">Unfriend</button>';
        buddyNamesString = buddyNamesString + startString1 + i + startString2 + buddy + '</a>'+unfriendButton+'<br>';
    }
    document.querySelector('#buddyList').innerHTML = buddyNamesString;
}

async function deleteBuddy(i) {
  const currUser = await user();
  buddies = currUser?.buddies;
  buddy = buddies[i];
  const fetchUrl = "/api/user/removeBuddy/" + buddy;
    const response = await fetch (fetchUrl, {
    method: 'delete', 
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
  displayBuddies();
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