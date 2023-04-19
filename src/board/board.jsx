import React from 'react';
import ReactDOM from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import { NavLink, Route, Routes } from 'react-router-dom';

export function Board({}) {


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
        return body;
      }
    }
    
    const notes = async (username) => {
      let currBuddy = localStorage.getItem('currBuddy');
      const fetchUrl = "/api/user/board/" + [currBuddy, username];
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
    return "error";
    };

    
    
    class board {
    username;
    socket;
    
    constructor() {
      this.username = localStorage.getItem("username");
      this.configureWebSocket();
      this.displayBoard();
    }
    
    
    async displayBoard() {
        const currUser = await user(this.username);
        const currBuddy = currUser?.buddies[0];
        if (!currBuddy) {
          window.location.href = 'buddies.html';
          return;
        }
        localStorage.setItem('currBuddy', currBuddy);
        document.querySelector('#boardHeader').innerHTML = currBuddy + "'s and Your Board";
        this.placeNotes();
    }
    
      async placeNotes() {
        const noteStart1 = '<div draggable="true" className="box"> <button onClick={() => new board().deleteNote(';
        const noteStart2 = ')} className ="btn btn-outline-danger" id="deleteButton">x</button><div>'
        
        let noteBody = await notes(this.username);
        let notesText = noteBody?.notes;
        let length = notesText?.length;
        let elements = [];
        
    
        for (let i = 0; i < length; i++) {
            let note = notesText[i];
            let deleteButton = React.createElement("button", {onClick : () => new board().deleteNote(i), className : "btn btn-outline-danger", id:"deleteButton", key: i}, "x");
            let noteComponent = React.createElement("div", {className: "box", value: deleteButton, key: i}, React.createElement("button", {onClick : () => new board().deleteNote(i), className : "btn btn-outline-danger", id:"deleteButton", key: i}, "x"), note);
            elements.push(noteComponent);
        }
        ReactDOM.createRoot(document.getElementById("buddyNotes")).render(elements);
    }
    
    async deleteNote(i) {
        console.log("yeet");
        const fetchUrl = "/api/user/deleteNote";
        const response = await fetch (fetchUrl, {
        method: 'delete',
        body: JSON.stringify({index : i, usernames : [localStorage.getItem("currBuddy"), this.username]}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    });
    
    this.broadcastEvent([localStorage.getItem("currBuddy"), this.username])
    }
    
    async addNote() {
        let text = document.querySelector('#newNoteText').value;
        document.querySelector('#newNoteText').value = '';
        const fetchUrl = "/api/user/addNote";
        const response = await fetch (fetchUrl, {
        method: 'post',
        body: JSON.stringify({newNote : text, usernames : [localStorage.getItem("currBuddy"), this.username]}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    });
    this.broadcastEvent([localStorage.getItem("currBuddy"), this.username])
    }
    
    async addFunnyQuote() {
      let jsonResponse = null;
      console.log("yeet");
      await fetch('https://api.chucknorris.io/jokes/random')
      .then((response) => response?.json())
      .then((jsonResponse) => {
       jsonResponse = jsonResponse;
      });
    
      const fetchUrl = "/api/user/addNote";
        const response = await fetch (fetchUrl, {
        method: 'post',
        body: JSON.stringify({newNote : jsonResponse?.value, usernames : [localStorage.getItem("currBuddy"), this.username]}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then(this.broadcastEvent([localStorage.getItem("currBuddy"), this.username]));
    }
    
    configureWebSocket() {
        let port = window.location.port;
        if (process.env.NODE_ENV !== 'production') {
        port = 3000;
        }
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
      
      this.socket.onmessage = async (event) => {
        const msg = JSON.parse(await event.data.text());
        const usernames = msg?.usernames;
        if (usernames.includes(this.username)) {
          this.placeNotes();
        }
      };
    }
    
     broadcastEvent(usernames) {
      const event = {
        usernames : usernames
      };
      this.socket.send(JSON.stringify(event));
    }
    }
    return (
    <main>
        <div src = {new board()} className = "settingsContainer">
        <NavLink className='nav-link settings' to='account'>Account</NavLink>
        <NavLink className='nav-link settings' to='buddies'>Buddies</NavLink>
          <NavLink to = "requests" className = "nav-link settings">Requests</NavLink>
          <NavLink to = "search" className = "nav-link settings">Search for Buddies</NavLink>
        </div>
        <section className = "boardContent content">
      <h2 id="boardHeader">Loading...</h2>
      <span id="buddyNotes" className="container"></span>
    </section>
    <div id="noteAdder">
      <label>add a new Note:</label>
      <input id='newNoteText'type='text' className="col-sm-4 control-label" placeholder="type what you want it to say!"></input>
      <button className = "btn btn-primary"onClick={() => new board().addNote()}>add</button>
      <button className = "btn btn-primary"onClick={() => new board().addFunnyQuote()}>add a Chuck Norris joke!</button>
    </div>
      </main>
      );
    }