// Grab helper functions.
const uuid = require('uuid');
const articleFunctions = require('../helperFunctions/articleFunctions.js');
const helperFunctions = require('../helperFunctions/helperFunctions.js');

// NPM modules needed.

// Objects stored in local memory for project #1.
const articles = articleFunctions.createGameArticles();
const games = {
  rooms: {},
};

// Create a new game room using a UUID.
const createRoom = (req, res) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Create UUID and use it as key for room.
  const roomID = uuid.v4();
  games.rooms[roomID] = {
    users: {},
    currentArticle: {},
    roundNum: 1,
    articles: {},
  };
  games.rooms[roomID].articles = articles;

  // Send the room ID as part of the response so that the client can access it.
  responseJSON.message = 'Created Successfully';
  responseJSON.roomID = roomID;
  return helperFunctions.respondJSON(req, res, 201, responseJSON);
};

// Functions to grab and respond with game data.
const getGameData = (req, res) => helperFunctions.respondJSON(req, res, 200, games);
const getGameDataMeta = (req, res) => helperFunctions.respondJSONMeta(req, res, 200);

// Function to add a user from a POST body.
const addUser = (req, res, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field appears in the body. If not, send a 400.
  if (!body.name || !body.roomID) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Name and room ID is required.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  const currentRoom = games.rooms[body.roomID];
  // If the room ID does not exist, send a 400.
  if (!currentRoom) {
    responseJSON.id = 'noRoomID';
    responseJSON.message = 'That room ID does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // Make sure that the 'name' body is not already in use. If it is, send a 400.
  if (currentRoom.users[body.name]) {
    responseJSON.id = 'nameTaken';
    responseJSON.message = 'That name is already in use.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // If there is no user yet, create it and send a 201.
  currentRoom.users[body.name] = {};
  currentRoom.users[body.name].streak = 0;
  currentRoom.users[body.name].points = 0;
  currentRoom.users[body.name].guess = null;

  responseJSON.message = 'Created Successfully';
  return helperFunctions.respondJSON(req, res, 201, responseJSON);
};

// Function to remove a user from a POST body.
const removeUser = (req, res, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field appears in the body. If not, send a 400.
  if (!body.name || !body.roomID) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Name and room ID is required.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  const currentRoom = games.rooms[body.roomID];
  // If the room ID does not exist, send a 400.
  if (!currentRoom) {
    responseJSON.id = 'noRoomID';
    responseJSON.message = 'That room ID does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // If the name does not exist, send a 400.
  if (!currentRoom.users[body.name]) {
    responseJSON.id = 'noName';
    responseJSON.message = 'That name does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // Delete the user and send a 202.
  delete currentRoom.users[body.name];

  responseJSON.message = 'Removed Successfully';
  return helperFunctions.respondJSON(req, res, 202, responseJSON);
};

// Function to add a user's guess from a POST body.
const addGuess = (req, res, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field and 'isOnion' field appear in the body. If not, send a 400.
  if (!body.name || !body.isOnion || !body.roomID) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Name, guess, and room ID is required.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // Make sure the guess is valid, send a 400.
  if (!(body.isOnion === 'y' || body.isOnion === 'n')) {
    responseJSON.id = 'notValidGuess';
    responseJSON.message = 'The guess must be either \'y\' or \'n\'.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  const currentRoom = games.rooms[body.roomID];
  // If the room ID does not exist, send a 400.
  if (!currentRoom) {
    responseJSON.id = 'noRoomID';
    responseJSON.message = 'That room ID does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // If the name does not exist, send a 400.
  if (!currentRoom.users[body.name]) {
    responseJSON.id = 'noName';
    responseJSON.message = 'That name does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // Add the guess and return a 201.
  currentRoom.users[body.name].guess = body.isOnion;

  responseJSON.message = 'Response Added';
  return helperFunctions.respondJSON(req, res, 201, responseJSON);
};

// Function to update game data with a PUT req.
const updatePointsStreaks = (req, res, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field appears in the body. If not, send a 400.
  if (!body.roomID) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Room ID is required.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  const currentRoom = games.rooms[body.roomID];
  // If the room ID does not exist, send a 400.
  if (!currentRoom) {
    responseJSON.id = 'noRoomID';
    responseJSON.message = 'That room ID does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  Object.keys(currentRoom.users).forEach((u) => {
    // If the user's guess is correct, do this.
    if (currentRoom.users[u].guess === currentRoom.currentArticle.isOnion) {
      currentRoom.users[u].streak++;
      currentRoom.users[u].points += currentRoom.users[u].streak;
      currentRoom.users[u].guess = null;
    } else {
      currentRoom.users[u].streak = 0;
      currentRoom.users[u].guess = null;
    }
  });

  // Always iterate round number.
  currentRoom.roundNum++;

  // Return 204 as no data needs returned.
  return helperFunctions.respondJSONMeta(req, res, 204);
};

// Function to reset gameData object for new game.
// Does not clear users.
const resetRoom = (req, res, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field appears in the body. If not, send a 400.
  if (!body.roomID) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Room ID is required.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  const currentRoom = games.rooms[body.roomID];
  // If the room ID does not exist, send a 400.
  if (!currentRoom) {
    responseJSON.id = 'noRoomID';
    responseJSON.message = 'That room ID does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // Reset scores and streaks for all users.
  Object.keys(currentRoom.users).forEach((u) => {
    currentRoom.users[u].points = 0;
    currentRoom.users[u].streak = 0;
    currentRoom.users[u].guess = null;
  });

  // Reset round.
  currentRoom.roundNum = 1;

  // Return 204 as no data needs returned.
  return helperFunctions.respondJSONMeta(req, res, 204);
};

// Get the next article from our article collection and send it as JSON.
const displayNextArticle = (req, res, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'roomID' field appears in the body. If not, send a 400.
  if (!body.roomID) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Room ID is required.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  const currentRoom = games.rooms[body.roomID];
  // If the room ID does not exist, send a 400.
  if (!currentRoom) {
    responseJSON.id = 'noRoomID';
    responseJSON.message = 'That Room ID does not exist.';
    return helperFunctions.respondJSON(req, res, 400, responseJSON);
  }

  // Randomly select article.
  const currentArticleNum = helperFunctions.getRandomNum(currentRoom.articles.length);

  // Keep randomly-selected article to send as JSON.
  const currentArticle = currentRoom.articles[currentArticleNum];
  currentRoom.currentArticle = currentArticle;
  currentRoom.articles.splice(currentArticleNum, 1);

  responseJSON.message = 'Article selected successfully.';
  responseJSON.article = currentArticle;
  return helperFunctions.respondJSON(req, res, 200, responseJSON);
};

module.exports = {
  createRoom,
  getGameData,
  getGameDataMeta,
  addUser,
  removeUser,
  addGuess,
  displayNextArticle,
  updatePointsStreaks,
  resetRoom,
};
