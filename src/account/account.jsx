import React from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import { NavLink, Route, Routes } from 'react-router-dom';

export function Account() {
    const navigate = useNavigate();
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
        let username = localStorage.getItem("username");
        let usernameField = document.querySelector("#username");
        let buddyCount = document.querySelector("#buddyCount");
    
        let currUser = await user(username);
        let buddies = currUser.buddies;
        ReactDOM.createRoot(document.getElementById("username")).render("Username: " + username);
        ReactDOM.createRoot(document.getElementById('buddyCount')).render("number of buddies: " + buddies.length);
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
        navigate('/');
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
        navigate('/');
    }

    return (
        <main>
    <div src = {displayAccount()} className = "settingsContainer">
    <NavLink className='nav-link settings' to='/account'>Account</NavLink>
        <NavLink className='nav-link settings' to='/buddies'>Buddies</NavLink>
          <NavLink to = "/requests" className = "nav-link settings">Requests</NavLink>
          <NavLink to = "/search" className = "nav-link settings">Search for Buddies</NavLink>
    </div>
    <section className = "accountContent content">
        <h2 id="accountHeader">Your account</h2>
        <span className="accountInfo contentTable">
            <p id="username">loading...</p>
            <p id = "buddyCount"></p>
            <button onClick={()=>logout()}className="btn btn-secondary logout-btn">logout</button>
            <br></br>
            <button onClick = {()=>deleteAccount()}className="btn btn-danger deleteAcc-btn">delete Account</button>
        </span>
    </section>
  </main>
    );
}