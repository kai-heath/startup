const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mongoUser = process.env.MONGOUSER;
const mongoPassword = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;


if (!mongoUser) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${mongoUser}:${mongoPassword}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('startup').collection('user');
const boardCollection = client.db('startup').collection('board');

function getBoard(usernamesToFind) {
  return boardCollection.findOne({usernames : {$all: usernamesToFind}});
}

function updateNotes(board, notes) {
  
  boardCollection.findOneAndUpdate({usernames : board.usernames}, {$set:{notes : notes}});
}
function updateRequests(username, requests) {
  userCollection.findOneAndUpdate({username : username}, {$set:{requests : requests}});
}

function addRequest(username, request) {
  userCollection.findOneAndUpdate({username : username}, {$addToSet: {requests : request}});
}

function removeRequest(username, request) {
  userCollection.findOneAndUpdate({username : username}, {$pull: {requests : request}});
}

function addRequested(username, requested) {
  userCollection.findOneAndUpdate({username : username}, {$addToSet: {requested : requested}});
}

function removeRequested(username, requested) {
  userCollection.findOneAndUpdate({username : username}, {$pull: {requested : requested}});
}

function updateBuddies(user, buddies) {
  userCollection.findOneAndUpdate({ username : user.username}, {$set: {buddies : buddies}});
}

function addBuddy(username, newBuddy) {
  userCollection.findOneAndUpdate({username : username}, {$addToSet: {buddies : newBuddy}})
}

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createBoard(username1, username2) {
  const newBoard = {
    usernames: [username1, username2],
    notes:(["start adding notes with your new buddy!"])
  }
  await boardCollection.insertOne(newBoard);
}


async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  buddies = ['Kai'];

  

  const user = {
    username: username,
    password: passwordHash,
    buddies: buddies,
    token: uuid.v4(),
    requests: [],
    requested: []
  };
  
  const defaultBoard = {
    usernames: [username, 'Kai'],
    notes: (["your first board!", "add or delete any notes you'd like!"]),
  }
  
  await userCollection.insertOne(user);
  await boardCollection.insertOne(defaultBoard);

  return user;
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getBoard,
  updateNotes,
  updateBuddies,
  updateRequests,
  createBoard,
  addBuddy,
  addRequest,
  removeRequest,
  addRequested,
  removeRequested
};