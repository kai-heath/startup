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
  console.log(usernamesToFind);
  return boardCollection.findOne({usernames : {$all: usernamesToFind}});
}

function updateNotes(board, notes) {
  board.notes = notes;
  boardCollection.findOneAndReplace({usernames : board.usernames}, board);
}

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}


async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  buddies = ['Kai'];

  

  const user = {
    username: username,
    password: passwordHash,
    buddies: buddies.sort(),
    token: uuid.v4(),
  };
  //console.log(user.buddies);
  const defaultBoard = {
    usernames: [username, 'Kai'],
    notes: (["your first board!", "add or delete any notes you'd like!"]),
  }
  console.log(defaultBoard.usernames);
  await userCollection.insertOne(user);
  await boardCollection.insertOne(defaultBoard);

  return user;
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getBoard,
  updateNotes
};