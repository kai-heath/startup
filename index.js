const accountsText = localStorage.getItem('accounts');
accounts = [{username: 'Kai', password: 'ADMIN'}];
if (accountsText != undefined) {
    accounts = JSON.parse(accountsText)
}

function login() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    if (username == null && password == null) {
        error('please enter username and password');
        return;
    }
    if (password == null) {
        error('Please enter password');
        return;
    }
    if (username == null) {
        error('please enter username');
        return;
    }
    for (const  [i, currAccount] of accounts.entries()) {
        console.log(currAccount.username);
        console.log(username);
        if (username === currAccount.username && password === currAccount.password) {
            localStorage.setItem('user', JSON.stringify(currAccount))
            window.location.href = "board.html";
            return;
        }
    }
    error('incorrect username or password')
}


function signup() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const newAccount = {username: username, password: password};
    
    if (accounts == undefined) {
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('user', JSON.stringify(newAccount))
        window.location.href = "board.html";
        return;
    }
    else for (const  [i, currAccount] of accounts.entries()) {
        if (username === currAccount.username) {
            error('username taken');
            return;
        }
    }
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('user', JSON.stringify(newAccount));
    window.location.href = "board.html";
    return;
    }

function error(errorText) {
    document.querySelector('#error').innerHTML = errorText;
}