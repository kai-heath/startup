const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { PeerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    DB.getUser
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

secureApiRouter.post('/user/acceptBuddy', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies.token);
  const username = user.username;
  buddies = user.buddies;
  requests = user.requests;
  const newBuddy = requests[req.body.index];

  DB.removeRequest(username, newBuddy);
  DB.addBuddy(username, newBuddy);

  DB.addBuddy(newBuddy, username);
  DB.removeRequested(newBuddy, username);

  await DB.createBoard(username, newBuddy);
});

secureApiRouter.post('user/rejectBuddy', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies.token);
  const username = user.username;
  buddies = user.buddies;
  requests = user.requests;
  const failedBuddy = requests[req.body.index];

  DB.removeRequest(username, failedBuddy);
  DB.removeRequested(failedBuddy, username);
});

secureApiRouter.post('/user/makeRequest', async (req, res) => {
    const user = await DB.getUserByToken(req.cookies.token);
    const username = user.username;
    const newRequest = req.body.request;
    DB.addRequest(username, newRequest);
    DB.addRequested(newRequest, username);
});



apiRouter.get('/user/board/:usernames', async (req, res) => {
  usernames = req.params.usernames.split(",");
  const board = await DB.getBoard(usernames);
  if (board) {
    res.send({notes : board.notes})
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
}); 

secureApiRouter.delete('/user/deleteNote', async (req, res) => {
  const usernames = req.body.usernames;
  const board = await DB.getBoard(usernames);
  notes = board.notes;
  notes.splice(req.body.index, 1);
  DB.updateNotes(board, notes);
  res.status(200).end();
});

secureApiRouter.post('/user/addNote', async (req, res) => {
  const usernames = req.body.usernames;
  const board = await DB.getBoard(usernames);
  notes = board.notes;
  notes.push(req.body.newNote);
  DB.updateNotes(board, notes);
  res.status(200).end();
});

secureApiRouter.post('/user/buddyOrder', async (req, res) => {
  const index = req.body.index;
  console.log(index);
  const user = await DB.getUserByToken(req.cookies.token);
  buddies = user.buddies;
  newFirst = buddies[index];
  buddies.splice(index,1);
  buddies.unshift(newFirst);
  console.log(buddies);
  DB.updateBuddies(user, buddies);
  res.status(200).end();
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (user) {
    const token = req.cookies.token;
    res.send({ requests: user.requests, requested: user.requested, username: user.username, authenticated: token === user.token, buddies : user.buddies });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

new PeerProxy(httpService);
