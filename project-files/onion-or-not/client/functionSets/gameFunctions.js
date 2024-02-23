const playerFunctions = require("./playerFunctions.js");
const responseHandling = require("./responseHandling.js");

// Updates currentArticle in room and displays on front-end.
const updateArticle = async (roomID) => {
    const article = document.querySelector('#articleTitle');

    // Build your data string.
    const formData = `roomID=${roomID}`;

    // Make and wait for your fetch response.
    const response = await fetch('/displayNextArticle', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },       
        body: formData
    });

    if (response.status == 200) {
        const articleJSON = await response.json();
        article.innerHTML = articleJSON.article.title;
        responseHandling.handleResponse(response, false);
    } else {
        responseHandling.handleResponse(response, true);
    }
}

// Update the round number in the UI and check for the end game condition.
const updateRound = (roundNum, roomID) => {
    if (roundNum != 11) {
        const round = document.getElementById('roundNum');
        round.innerHTML = "Round: " + roundNum;
    } else {
        endGame(roomID);
    }
}

// End the game, and make associated UI changes.
const endGame = async (roomID) => {
    // Grab the gameData and search through the users for a winner.
    const gameDataJSON = await requestUpdate('/getGameData', 'get', true);
    const gameData = gameDataJSON.rooms[roomID];

    let winner;
    let winnerPoints = 0;
    Object.keys(gameData.users).forEach((u) => {
        // Ties not yet implemented.
            // Streaks should make it hard to tie, so this shouldn't be a huge issue.
        if (gameData.users[u].points > winnerPoints) {
            winner = u;
            winnerPoints = gameData.users[u].points;
        }
    });

    // Diplay the winner.
    const winnerHolder = document.getElementById('winnerHolder');
    winnerHolder.innerHTML = winner + " wins with " + winnerPoints + " points!";

    // Hide the article (just a UI change).
    const article = document.getElementById('articleTitle');
    const nextQuestion = document.getElementById('nextQuestion');

    nextQuestion.classList.add('hide');
    article.classList.add('hide');

    // Reveal the restart button.
    const restartButton = document.getElementById('restartButton');
    restartButton.classList.remove('hide');

    const userForm = document.getElementById('addUserForm');
    userForm.classList.remove('hide');
}

// Called when a GET or HEAD request is made.
const requestUpdate = async (url, method, returnData) => {
    // Make and wait for your fetch response.
    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        },
    });

    if (returnData == true) {
        return await response.json();
    } else {
        // Handle returned response and display on the front end.
        responseHandling.handleResponse(response, method !== 'head');
    }
};

// Called when front-end UI makes a user-related POST request.
const userPostAdd = async (addUserForm, roomID) => {
    
    // Grab the form info.
    const nameField = addUserForm.querySelector('#nameField');
    const nfValue = nameField.value;
    // Build your data string.
    const formData = `name=${nfValue}&roomID=${roomID}`;

    // Make and wait for your fetch response.
    let response = await fetch('/addUser', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formData,
    });

    // Change UI if player's name is accepted.
    if (response.status == 201) {
        playerFunctions.createPlayer(nfValue, roomID);
    }

    // Handled returned response and display on the front end.
    responseHandling.handleResponse(response, true);
};

// Turn into one call on API end.
const nextQuestion = async (roomID) => {

    // Build your data string.
    const formData = `roomID=${roomID}`;

    // Make and wait for your fetch response.
    let pointsStreaksResponse = await fetch('/updatePointsStreaks', {
        method: 'put',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formData
    });

    responseHandling.handleResponse(pointsStreaksResponse, false);

    // pull out the new values for the players and apply them to the UI.
        // Also, reset guesses.
    const gameDataJSON = await requestUpdate('/getGameData', 'get', true);
    const gameData = gameDataJSON.rooms[roomID];

    Object.keys(gameData.users).forEach((u) => {
        const playerPoints = document.getElementById(u + "Points");
        const playerStreak = document.getElementById(u + "Streak");

        playerPoints.innerHTML = gameData.users[u].points;
        playerStreak.innerHTML = gameData.users[u].streak;

        const userCurrentGuess = document.getElementById(u + "Guess");
        userCurrentGuess.innerText = 'N/A';
    });

    // Update round number.
    updateRound(gameData.roundNum, roomID);

    updateArticle(roomID);
}

// Called when front-end UI makes a game-related PUT request.
const sendPut = async (pointsStreaksButton) => {
    //Grab the request info.
    const url = pointsStreaksButton.getAttribute('action');
    const method = pointsStreaksButton.getAttribute('method');

    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        }
    });

    // Handled returned response and display on the front end.
    responseHandling.handleResponse(response, true);
}

module.exports = {
    updateArticle,
    updateRound,
    requestUpdate,
    userPostAdd,
    nextQuestion,
    sendPut
}