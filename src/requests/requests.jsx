import React from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import { NavLink, Route, Routes } from 'react-router-dom';

export function Requests() {
    const username = localStorage.getItem('username');
let user = async () => {
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
    let currUser = await user();
    let requests = currUser?.requests;
    let length = requests?.length;
    let outputString = "";
    let elements = [];
    for(let i = 0; i < length; i++) {
        let request = requests[i];
        let acceptButtonElement = React.createElement("button", {className: "btn btn-success", onClick:()=>acceptBuddy(i),key:i},'accept');
        let rejectButtonElement = React.createElement("button", {className:"btn btn-secondary", onClick:()=>rejectBuddy(i), key:i},'reject');
        let element = React.createElement("p", {}, acceptButtonElement, rejectButtonElement, request);
        elements.push(element);
        let stringEnd = '<button class = "btn btn-success"onclick="acceptBuddy('+ i +')">accept</button><button class = "btn btn-secondary"onclick="buddyReject('+i+')">reject</button>';
            let outputString = '<p>'+request + stringEnd+ '</p>';
    }
    ReactDOM.createRoot(document.getElementById("requestTable")).render(elements);
    //document.querySelector('#requestTable').innerHTML = outputString;
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
    let body = response.json;
        console.log(body);
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
    }).then(loadRequests());
}

return (
    <main>
    <div src = {loadRequests()} className = "settingsContainer">
    <NavLink className='nav-link settings' to='/account'>Account</NavLink>
        <NavLink className='nav-link settings' to='/buddies'>Buddies</NavLink>
          <NavLink to = "/requests" className = "nav-link settings">Requests</NavLink>
          <NavLink to = "/search" className = "nav-link settings">Search for Buddies</NavLink>
    </div>
    <section className = "requestsContent content">
        <h2>Buddy Requests:</h2>
        <div id="requestTable" className="requestInfo contentTable"></div>
    </section>
  </main>
);
}