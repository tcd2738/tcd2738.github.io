const responseHandlers = require('./functionSets/responseHandling.js');
const gameFunctions = require('./functionSets/gameFunctions.js');

let roomID;

// Handles the structural changes required on the HTML page once the game begins.
beginGame = () => {
    const currentUsers = document.getElementById('currentUsers').childElementCount;
    const playerMessage = document.getElementById('playerErrorMessage');
    
    // Do not start if there aren't any players.
    if (currentUsers == 0) {
        playerMessage.classList.remove('hide');
    } else {
        playerMessage.classList.add('hide');

        // Hide startup elements.
        const instructions = document.getElementById('instructions');
        const userForm = document.getElementById('addUserForm');
        const startButton = document.getElementById('startButton');

        instructions.classList.add('hide');
        userForm.classList.add('hide');
        startButton.classList.add('hide');

        // Show game elements.
        const article = document.getElementById('articleTitle');
        const nextQuestion = document.getElementById('nextQuestion');

        nextQuestion.classList.remove('hide');
        article.classList.remove('hide');

        const round = document.getElementById('roundNum');
        round.innerHTML = "Round: 1";
    }
}

// Generate room ID for new game.
const createGame = async () => {
    // Make and wait for your fetch response.
    let response = await fetch('/createRoom', {
        method: 'post',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Save the room ID if created.
    if (response.status == 201) {
        const roomCreationJSON = await response.json();
        roomID = roomCreationJSON.roomID;
    }

    // Handled returned response and display on the front end.
    responseHandlers.handleResponse(response, false);
}

// Refresh game data and reset all UI elements.
const restartGame = async (roomID) => {
    // Build your data string.
    const formData = `roomID=${roomID}`;

    // Make and wait for your fetch response.
    let response = await fetch('/resetRoom', {
        method: 'put',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formData,
    });

    // Make changes to reflect new game.
    if (response.status == 204) {
        gameFunctions.updateRound(1, roomID);

        // Update the user data.
        const users = document.getElementById('currentUsers').children;
        Object.keys(users).forEach((u) => {
            const uName = users[u].id;
            
            const playerPoints = document.getElementById(uName + "Points");
            const playerStreak = document.getElementById(uName + "Streak");
    
            playerPoints.innerHTML = 0;
            playerStreak.innerHTML = 0;
        });

        // Add game elements back to UI.
        const article = document.getElementById('articleTitle');
        const nextQuestion = document.getElementById('nextQuestion');

        nextQuestion.classList.remove('hide');
        article.classList.remove('hide');

        // Hid the restart elements from the UI.
        const winnerHolder = document.getElementById('winnerHolder');
        winnerHolder.innerText = '';

        const restartButton = document.getElementById('restartButton');
        restartButton.classList.add('hide');
        const userForm = document.getElementById('addUserForm');
        userForm.classList.add('hide');
    }

    // Handled returned response and display on the front end.
    responseHandlers.handleResponse(response, false);
}

const init = async () => {

    // Create game and generate roomID for attempting anything else.
    await createGame();
    gameFunctions.updateArticle(roomID);

    const startGameButton = document.getElementById('startButton');
    const addUserForm = document.getElementById('addUserForm');
    const nextQuestionButton = document.getElementById('nextQuestion');
    const restartButton = document.getElementById('restartButton');
    const debugButton = document.getElementById('debugButton');
    
    // Tell the forms to do their needed actions without redirecting.
    const startGame = (e) => {
        beginGame();
        return false;
    }
    const addUser = (e) => {
        e.preventDefault();
        gameFunctions.userPostAdd(addUserForm, roomID);
        return false;
    }
    // No redirect as this is a button.
    const nextQuestionEvent = (e) => {
        gameFunctions.nextQuestion(roomID);
        return false;
    }
    const restart = (e) => {
        restartGame(roomID);
        return false;
    }
    const debug = (e) => {
        responseHandlers.enableDebug();
        debugButton.classList.add('hide');
        return false;
    }
    
    // Attach functions to related document elements.
    startGameButton.addEventListener('click', startGame);
    addUserForm.addEventListener('submit', addUser);
    nextQuestionButton.addEventListener('click', nextQuestionEvent);
    restartButton.addEventListener('click', restart);
    debugButton.addEventListener('click', debug);
};

window.onload = init;