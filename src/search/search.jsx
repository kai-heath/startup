import React from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import { NavLink, Route, Routes } from 'react-router-dom';

export function Search() {
    let user = async (username) => {
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
        let username = localStorage.getItem("username");
        let newBuddy = document.querySelector('#searchBuddy').value;
        if (!newBuddy) {
            outputMessage("please enter a username");
            return;
        }
        if (username === newBuddy) {
            outputMessage("you can't be friends with yourself");
            return;
        }
        let buddyUser = await user(newBuddy);
        if (!buddyUser) {
            outputMessage("No user with that username found");
            return;
        }
        let currUser = await user(username);
        let buddies = currUser?.buddies;
        let requested = currUser?.requested;
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
        let newElement = React.createElement("p", {}, string);
        ReactDOM.createRoot(document.getElementById('searchResponse')).render(newElement);
    }
    
    function setBuddyRequest(newBuddy) {
        let acceptButtonElement = React.createElement("button", {className:'btn btn-success', onClick:()=>sendRequest(newBuddy)},"send");
        let cancelButtonElement = React.createElement("button", {className:'btn btn-danger', onClick:()=>cancelRequest()},"cancel");
        let queryElement = React.createElement("h3", {}, "Send Buddy request to " + newBuddy + "?");
        ReactDOM.createRoot(document.getElementById('buddyAcceptResponse')).render([queryElement, acceptButtonElement, cancelButtonElement]);
    }

    function cancelRequest() {
        outputMessage("");
        ReactDOM.createRoot(document.getElementById('buddyAcceptResponse')).render("");
    }
    
    async function sendRequest(newBuddy) {
        let text = "";
        const fetchUrl = "/api/user/makeRequest";
        const response = await fetch (fetchUrl, {
        method: 'post', 
        body: JSON.stringify({request : newBuddy}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        }).then(
            text = "<h3>Request succesfully send to " + newBuddy,
            document.querySelector('#buddyAcceptResponse').innerHTML = (text),   
        );
            let body = response.json;
        }

        return (
            <main>
    <div className = "settingsContainer">
    <NavLink className='nav-link settings' to='/account'>Account</NavLink>
        <NavLink className='nav-link settings' to='/buddies'>Buddies</NavLink>
          <NavLink to = "/requests" className = "nav-link settings">Requests</NavLink>
          <NavLink to = "/search" className = "nav-link settings">Search for Buddies</NavLink>
    </div>
    <section className = "searchContent content">
        <h2>Enter a username:</h2>
        <div className="text-center search searchBar contentTable" id="search">
            <input id="searchBuddy" type = "text" placeholder="Enter a username here"></input>
            <button onClick={()=>searchBuddy()} id="searchButton" className = "btn btn-primary">Add Buddy</button>
            <p id="searchResponse"></p>
            <div id="buddyAcceptResponse">
            </div>
        </div>
    </section>
  </main>
        )
}