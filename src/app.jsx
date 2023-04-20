import React from 'react';

import { NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Board } from './board/board';
import { Buddies } from './buddies/buddies';
import { Requests } from './requests/requests';
import { Search } from './search/search';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');

  return (
    <div className = "page">
  <header>
    <h1>Board Buddy</h1>
  </header>

      <Routes>
        <Route path='/'element={<Login />}exact/>
        <Route path='/board' element={<Board />} />
        <Route path='/buddies' element={<Buddies />} />
        <Route path='/requests' element={<Requests />} />
        <Route path='/search' element={<Search />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <footer>
    Author: Kai Heath
    <a href = "https://github.com/kai-heath/startup">Github</a>
  </footer>
    </div>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;
