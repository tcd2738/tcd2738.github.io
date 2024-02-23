const responseHandling = require('./responseHandling.js');

// HTML that is generated when a player is added to the UI.
const createPlayerHTML = (id) => {
    return `
        <p class="playerName" id="${id}Name"></p>
        <label>${id} thinks it...</label>
        <p id="${id}Guess">N/A</p>
        <form class="guessForm" id="${id}GuessForm" action="/addGuess" method="post">
            <label for="guess">Is it The Onion?</label>
            <div class="guessRadioButtons">
                <input type="radio" id="onionY${id}" name="isItOnion${id}" value="y">
                <label for="onionY">yes</label><br>
                <input type="radio" id="onionN${id}" name="isItOnion${id}" value="n">
                <label for="onionN">no</label><br>
            </div>
            <input type="submit" value="Post Guess Method" />
        </form>
        <div class="pointsAndStreaks">
            <div>
                <label>Points:</label>
                <p class="points" id="${id}Points"></p>
            </div>
            <div>
                <label>Streak:</label>
                <p class="streaks" id="${id}Streak"></p>
            </div>
        </div>
        <button id="remove${id}Button" action="/removeUser" method="post" type="button">Stop playing?</button>
    `
}

// Called when front-end UI makes a user-related POST request.
const userPostRemove = async (nfValue, roomID) => {
    
    // Build your data string.
    const formData = `name=${nfValue}&roomID=${roomID}`;

    // Make and wait for your fetch response.
    let response = await fetch('/removeUser', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (response.status == 202) {
        const user = document.getElementById(nfValue);
        user.remove();
    }

    // Handled returned response and display on the front end.
    responseHandling.handleResponse(response, true);
};

// Called when front-end UI makes a guess-related POST request.
const guessPost = async (nfValue, roomID) => {
    
    // Grab the form info.
    const guessField = document.getElementsByName('isItOnion' + nfValue);
    let guess;
    for (let g of guessField)
    {
        if (g.checked) {
            guess = g.value;
        }
    }
    // Build your data string.
    const formData = `name=${nfValue}&isOnion=${guess}&roomID=${roomID}`;

    // Make and wait for your fetch response.
    let response = await fetch('/addGuess', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (response.status == 201) {
        const userCurrentGuess = document.getElementById(nfValue + "Guess");
        if (guess == 'y') {
            userCurrentGuess.innerHTML = '... is The Onion.';
        } else {
            userCurrentGuess.innerHTML = '... is not The Onion.';
        }
    }

    // Handled returned response and display on the front end.
    responseHandling.handleResponse(response, true);
};

// Change UI to reflect new player.
export const createPlayer = (nfValue, roomID) => {
    // Reflect the new player within the UI.
    const newPlayer = document.createElement('div');
    newPlayer.classList.add('player');
    newPlayer.setAttribute('id', nfValue);
    newPlayer.innerHTML = createPlayerHTML(nfValue);
    const currentUsers = document.getElementById("currentUsers");
    currentUsers.appendChild(newPlayer);

    // Set up the form's created for the new player.
    const removeUserButton = document.getElementById('remove' + nfValue + 'Button');
    const guessForm = document.getElementById(nfValue + 'GuessForm');

    const removeUser = () => {
        userPostRemove(nfValue, roomID);
        return false;
    }
    const addGuess = (e) => {
        e.preventDefault();
        guessPost(nfValue, roomID);
        return false;
    }

    removeUserButton.addEventListener('click', removeUser);
    guessForm.addEventListener('submit', addGuess);

    // Add data to the new UI added for the player.
    const playerNameHolder = document.getElementById(nfValue + 'Name');
    playerNameHolder.innerHTML = nfValue;

    const playerPoints = document.getElementById(nfValue + "Points");
    playerPoints.innerHTML = 0;
    const playerStreak = document.getElementById(nfValue + "Streak");
    playerStreak.innerHTML = 0;
}