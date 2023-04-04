const username = localStorage.getItem('username');
user = async () => {
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


async function loadRequests() {
    currUser = await user();
    requests = currUser?.requests;
    length = requests?.length;
    outputString = "";
    for(i = 0; i < length; i++) {
        stringEnd = '<button class = "btn btn-success"onclick="acceptBuddy('+ i +')">accept</button><button class = "btn btn-secondary"onclick="buddyReject('+i+')">reject</button>';
        request = requests[i];
            outputString = '<p>'+request + stringEnd+ '</p>';
    }
    document.querySelector('#requestTable').innerHTML = outputString;
}

async function acceptBuddy(i) {
    const fetchUrl = "/api/user/acceptBuddy";
    const response = await fetch (fetchUrl, {
    method: 'post', 
    body: JSON.stringify({index : i}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
loadRequests();
}

async function rejectBuddy(i) {
    const fetchUrl = "/api/user/rejectBuddy";
    const response = await fetch (fetchUrl, {
    method: 'post', 
    body: JSON.stringify({index : i}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
});
loadRequests();
}