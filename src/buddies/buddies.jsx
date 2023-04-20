import React from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import { NavLink, Route, Routes } from 'react-router-dom';

export function Buddies() {
    const navigate = useNavigate();

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
    let buddies = currUser?.buddies;
    let buddyLength = buddies?.length;
    if(buddyLength == 0) {
        let element = React.createElement("h4", {style:{textAlign : "center"}}, "looks like you don't have any buddies, go add some!");
        ReactDOM.createRoot(document.getElementById("buddyList")).render(element);
      return;
    }
    let elements = [];
    for(let i = 0; i < buddyLength; i++) {
        let buddy = buddies[i];
        let UnfriendButton = React.createElement("button", {className:"btn btn-sm btn-danger", onClick: () => deleteBuddy(i), key:i},"Unfriend");
        let buddyElement = React.createElement("a", {key: i, className:"buddyLink", onClick: () => changeCurrBuddy(i)}, buddy);
        let breakElement = React.createElement("br", {key:i});
        elements.push(UnfriendButton, buddyElement, breakElement);
    }
    ReactDOM.createRoot(document.getElementById("buddyList")).render(elements);
}

async function deleteBuddy(i) {
  const currUser = await user();
  let buddies = currUser?.buddies;
  let buddy = buddies[i];
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
    navigate('/board');
}
    return (
        <main>
    <div src = {displayBuddies()} className = "settingsContainer">
    <NavLink className='nav-link settings' to='/account'>Account</NavLink>
        <NavLink className='nav-link settings' to='/buddies'>Buddies</NavLink>
          <NavLink to = "/requests" className = "nav-link settings">Requests</NavLink>
          <NavLink to = "/search" className = "nav-link settings">Search for Buddies</NavLink>
    </div>
    <section className = "buddiesContent content">
        <h2>Your Buddies:</h2>
        <span id="buddyList"className="buddyInfo contentTable">
            <p>Loading...</p>
        </span>
    </section>
  </main>
    );
}