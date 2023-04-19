
async function login() {
    const username = document.querySelector('#username')?.value;
    const password = document.querySelector('#password')?.value;
    if (username === "") {
      error("please enter a username");
      return;
    }
    if (password === "") {
      error("please enter a password");
      return;
    }
    const response = await fetch("api/auth/login", {
        method: 'post',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
    const body = await response?.json();
    if (response?.status === 200) {
        localStorage.setItem('username', username);
        console.log(response?.status);
        window.location.href = 'board.html';
      } else {
         error(body.msg);
      }
}


async function signup() {
    const username = document.querySelector('#username')?.value;
    const password = document.querySelector('#password')?.value;
    if (username === "") {
      error("please enter a username");
      return;
    }
    if (password === "") {
      error("please enter a password");
      return;
    }
    const response = await fetch ("api/auth/create", {
        method: 'post', 
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    });
    const body = await response?.json();
    if (response?.status === 200) {
        localStorage.setItem('username', username);
        console.log(response?.status);
        window.location.href = 'board.html';
      } else {
         error(body.msg);
      }
    }

function error(errorText) {
    document.querySelector('#error').innerHTML = errorText;
}