import React from 'react';
import { useNavigate } from 'react-router-dom';


export function Login({ userName, authState, onAuthChange }) {
  const navigate = useNavigate();
  return (
    <main>
    <section className = "buddiesContent content">
        <div className = 'loginInfo'>
            <h2>Login:</h2>
            <input type="email" className="col-sm-2 control-label" id = 'username' placeholder = "username:"></input>
            <br></br>
            <input type="password" className="col-sm-2 control-label" id = 'password' placeholder = "password" ></input>
            <br></br>
            <button className="btn btn-primary" onClick = {() =>loginFunction()}>Login</button>
            <br></br>
            <button className="btn btn-primary" onClick = {() =>signupFunction()}>Signup</button>
            <br></br>
            <span id = 'error'></span>
        </div>
    </section>
  </main>
  );
  async function loginFunction() {
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
        navigate('/board');
      } else {
         error(body.msg);
      }
  }
  async function signupFunction() {
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
        navigate('/board');
      } else {
         error(body.msg);
      }
    }
  
  function error(errorText) {
    document.querySelector('#error').innerHTML = errorText;
  }
}


