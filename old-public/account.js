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
    return body
  }
}

async function displayAccount() {
    username = localStorage.getItem("username");
    usernameField = document.querySelector("#username");
    buddyCount = document.querySelector("#buddyCount");

    currUser = await user(username);
    buddies = currUser.buddies;
    usernameField.innerHTML = "Username: " + username;
    buddyCount.innerHTML = "Number of buddies: " + buddies.length;
}

async function logout() {
    const fetchUrl = "/api/auth/logout";
    const response = await fetch (fetchUrl, {
    method: 'delete', 
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    });
    localStorage.clear();
    window.location.href = 'login.html';
}

async function deleteAccount() {
    const fetchUrl = "/api/auth/deleteAccount";
    const response = await fetch (fetchUrl, {
    method: 'delete', 
    body: JSON.stringify({username : localStorage.getItem("username")}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    });
    localStorage.clear();
    window.location.href = 'login.html';
}