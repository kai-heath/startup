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
        document.querySelector('#searchResponse').innerHTML = string;
    }
    
    function setBuddyRequest(newBuddy) {
        let acceptButton = "<button class = 'btn btn-success' onclick = 'sendRequest("+'"'+newBuddy+'"'+")'>Send</button>";
        let cancelButton = "<button class = 'btn btn-danger' onclick = 'cancelRequest()'>Cancel</button>";
        let query = "<h3>Send Buddy request to " + newBuddy + "?</h3>"
        let text = query + acceptButton + cancelButton;
        document.querySelector('#buddyAcceptResponse').innerHTML = (text);
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
      <a href = "account.html" className = "settings">My Account</a>
      <a href = "buddies.html" className = "settings">Buddies</a>
      <a href = "requests.html" className = "settings">Requests</a>
      <a href = "search.html" className = "settings">Search for Buddies</a>
    </div>
    <section className = "searchContent content">
        <h2>Enter a username:</h2>
        <div className="text-center search searchBar contentTable" id="search">
            <input id="searchBuddy" type = "text" placeholder="Enter a username here"></input>
            <button onclick="searchBuddy()" id="searchButton" className = "btn btn-primary">Add Buddy</button>
            <p id="searchResponse"></p>
            <div id="buddyAcceptResponse">
            

            </div>
        </div>
    </section>
  </main>
        )
}