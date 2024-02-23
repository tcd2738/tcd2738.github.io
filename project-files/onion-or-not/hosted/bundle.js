/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const responseHandlers = __webpack_require__(/*! ./functionSets/responseHandling.js */ \"./client/functionSets/responseHandling.js\");\r\nconst gameFunctions = __webpack_require__(/*! ./functionSets/gameFunctions.js */ \"./client/functionSets/gameFunctions.js\");\r\n\r\nlet roomID;\r\n\r\n// Handles the structural changes required on the HTML page once the game begins.\r\nbeginGame = () => {\r\n    const currentUsers = document.getElementById('currentUsers').childElementCount;\r\n    const playerMessage = document.getElementById('playerErrorMessage');\r\n    if (currentUsers == 0) {\r\n        playerMessage.classList.remove('hide');\r\n    } else {\r\n        playerMessage.classList.add('hide');\r\n        const instructions = document.getElementById('instructions');\r\n        const userForm = document.getElementById('addUserForm');\r\n        const startButton = document.getElementById('startButton');\r\n\r\n        instructions.classList.add('hide');\r\n        userForm.classList.add('hide');\r\n        startButton.classList.add('hide');\r\n\r\n        const article = document.getElementById('articleTitle');\r\n        const nextQuestion = document.getElementById('nextQuestion');\r\n\r\n        nextQuestion.classList.remove('hide');\r\n        article.classList.remove('hide');\r\n\r\n        const round = document.getElementById('roundNum');\r\n        round.innerHTML = \"Round: 1\";\r\n    }\r\n}\r\n\r\n// Generate room ID for new game.\r\nconst createGame = async () => {\r\n    // Make and wait for your fetch response.\r\n    let response = await fetch('/createRoom', {\r\n        method: 'post',\r\n        headers: {\r\n            'Accept': 'application/json'\r\n        }\r\n    });\r\n\r\n    // Save the room ID if created.\r\n    if (response.status == 201) {\r\n        const roomCreationJSON = await response.json();\r\n        roomID = roomCreationJSON.roomID;\r\n    }\r\n\r\n    // Handled returned response and display on the front end.\r\n    responseHandlers.handleResponse(response, false);\r\n}\r\n\r\n// Refresh game data and reset all UI elements.\r\nconst restartGame = async (roomID) => {\r\n    // Build your data string.\r\n    const formData = `roomID=${roomID}`;\r\n\r\n    // Make and wait for your fetch response.\r\n    let response = await fetch('/resetRoom', {\r\n        method: 'put',\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json'\r\n        },\r\n        body: formData,\r\n    });\r\n\r\n    // Make changes to reflect new game.\r\n    if (response.status == 204) {\r\n        gameFunctions.updateRound(1, roomID);\r\n\r\n        // Update the user data.\r\n        const users = document.getElementById('currentUsers').children;\r\n        Object.keys(users).forEach((u) => {\r\n            const uName = users[u].id;\r\n            \r\n            const playerPoints = document.getElementById(uName + \"Points\");\r\n            const playerStreak = document.getElementById(uName + \"Streak\");\r\n    \r\n            playerPoints.innerHTML = 0;\r\n            playerStreak.innerHTML = 0;\r\n        });\r\n\r\n        // Add game elements back to UI.\r\n        const article = document.getElementById('articleTitle');\r\n        const nextQuestion = document.getElementById('nextQuestion');\r\n\r\n        nextQuestion.classList.remove('hide');\r\n        article.classList.remove('hide');\r\n\r\n        // Hid the restart elements from the UI.\r\n        const winnerHolder = document.getElementById('winnerHolder');\r\n        winnerHolder.innerText = '';\r\n\r\n        const restartButton = document.getElementById('restartButton');\r\n        restartButton.classList.add('hide');\r\n        const userForm = document.getElementById('addUserForm');\r\n        userForm.classList.add('hide');\r\n    }\r\n\r\n    // Handled returned response and display on the front end.\r\n    responseHandlers.handleResponse(response, false);\r\n}\r\n\r\nconst init = async () => {\r\n\r\n    // Create game and generate roomID for attempting anything else.\r\n    await createGame();\r\n    gameFunctions.updateArticle(roomID);\r\n\r\n    const startGameButton = document.getElementById('startButton');\r\n    const addUserForm = document.getElementById('addUserForm');\r\n    const nextQuestionButton = document.getElementById('nextQuestion');\r\n    const restartButton = document.getElementById('restartButton');\r\n    const debugButton = document.getElementById('debugButton');\r\n    \r\n    // Tell the forms to do their needed actions without redirecting.\r\n    const startGame = (e) => {\r\n        beginGame();\r\n        return false;\r\n    }\r\n    const addUser = (e) => {\r\n        e.preventDefault();\r\n        gameFunctions.userPostAdd(addUserForm, roomID);\r\n        return false;\r\n    }\r\n    // No redirect as this is a button.\r\n    const nextQuestionEvent = (e) => {\r\n        gameFunctions.nextQuestion(roomID);\r\n        return false;\r\n    }\r\n    const restart = (e) => {\r\n        restartGame(roomID);\r\n        return false;\r\n    }\r\n    const debug = (e) => {\r\n        responseHandlers.enableDebug();\r\n        return false;\r\n    }\r\n    \r\n    // Attach functions to related document elements.\r\n    startGameButton.addEventListener('click', startGame);\r\n    addUserForm.addEventListener('submit', addUser);\r\n    nextQuestionButton.addEventListener('click', nextQuestionEvent);\r\n    restartButton.addEventListener('click', restart);\r\n    debugButton.addEventListener('click', debug);\r\n};\r\n\r\nwindow.onload = init;\n\n//# sourceURL=webpack://onion-or-not/./client/client.js?");

/***/ }),

/***/ "./client/functionSets/gameFunctions.js":
/*!**********************************************!*\
  !*** ./client/functionSets/gameFunctions.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const playerFunctions = __webpack_require__(/*! ./playerFunctions.js */ \"./client/functionSets/playerFunctions.js\");\r\nconst responseHandling = __webpack_require__(/*! ./responseHandling.js */ \"./client/functionSets/responseHandling.js\");\r\n\r\n// Updates currentArticle in room and displays on front-end.\r\nconst updateArticle = async (roomID) => {\r\n    const article = document.querySelector('#articleTitle');\r\n\r\n    // Build your data string.\r\n    const formData = `roomID=${roomID}`;\r\n\r\n    // Make and wait for your fetch response.\r\n    const response = await fetch('/displayNextArticle', {\r\n        method: 'post',\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json'\r\n        },       \r\n        body: formData\r\n    });\r\n\r\n    if (response.status == 200) {\r\n        const articleJSON = await response.json();\r\n        article.innerHTML = articleJSON.article.title;\r\n        responseHandling.handleResponse(response, false);\r\n    } else {\r\n        responseHandling.handleResponse(response, true);\r\n    }\r\n}\r\n\r\n// Update the round number in the UI and check for the end game condition.\r\nconst updateRound = (roundNum, roomID) => {\r\n    if (roundNum != 11) {\r\n        const round = document.getElementById('roundNum');\r\n        round.innerHTML = \"Round: \" + roundNum;\r\n    } else {\r\n        endGame(roomID);\r\n    }\r\n}\r\n\r\nconst endGame = async (roomID) => {\r\n    // Grab the gameData and search through the users for a winner.\r\n    const gameDataJSON = await requestUpdate('/getGameData', 'get', true);\r\n    const gameData = gameDataJSON.rooms[roomID];\r\n\r\n    let winner;\r\n    let winnerPoints = 0;\r\n    Object.keys(gameData.users).forEach((u) => {\r\n        // Ties not yet implemented.\r\n            // Streaks should make it hard to tie, so this shouldn't be a huge issue.\r\n        if (gameData.users[u].points > winnerPoints) {\r\n            winner = u;\r\n            winnerPoints = gameData.users[u].points;\r\n        }\r\n    });\r\n\r\n    // Diplay the winner.\r\n    const winnerHolder = document.getElementById('winnerHolder');\r\n    winnerHolder.innerHTML = winner + \" wins with \" + winnerPoints + \" points!\";\r\n\r\n    // Hide the article (just a UI change).\r\n    const article = document.getElementById('articleTitle');\r\n    const nextQuestion = document.getElementById('nextQuestion');\r\n\r\n    nextQuestion.classList.add('hide');\r\n    article.classList.add('hide');\r\n\r\n    // Reveal the restart button.\r\n    const restartButton = document.getElementById('restartButton');\r\n    restartButton.classList.remove('hide');\r\n\r\n    const userForm = document.getElementById('addUserForm');\r\n    userForm.classList.remove('hide');\r\n}\r\n\r\n// Called when a GET or HEAD request is made.\r\nconst requestUpdate = async (url, method, returnData) => {\r\n    // Make and wait for your fetch response.\r\n    let response = await fetch(url, {\r\n        method,\r\n        headers: {\r\n            'Accept': 'application/json'\r\n        },\r\n    });\r\n\r\n    if (returnData == true) {\r\n        return await response.json();\r\n    } else {\r\n        // Handle returned response and display on the front end.\r\n        responseHandling.handleResponse(response, method !== 'head');\r\n    }\r\n};\r\n\r\n// Called when front-end UI makes a user-related POST request.\r\nconst userPostAdd = async (addUserForm, roomID) => {\r\n    \r\n    // Grab the form info.\r\n    const nameField = addUserForm.querySelector('#nameField');\r\n    const nfValue = nameField.value;\r\n    // Build your data string.\r\n    const formData = `name=${nfValue}&roomID=${roomID}`;\r\n\r\n    // Make and wait for your fetch response.\r\n    let response = await fetch('/addUser', {\r\n        method: 'post',\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json'\r\n        },\r\n        body: formData,\r\n    });\r\n\r\n    // Change UI if player's name is accepted.\r\n    if (response.status == 201) {\r\n        playerFunctions.createPlayer(nfValue, roomID);\r\n    }\r\n\r\n    // Handled returned response and display on the front end.\r\n    responseHandling.handleResponse(response, true);\r\n};\r\n\r\n// Turn into one call on API end.\r\nconst nextQuestion = async (roomID) => {\r\n\r\n    // Build your data string.\r\n    const formData = `roomID=${roomID}`;\r\n\r\n    // Make and wait for your fetch response.\r\n    let pointsStreaksResponse = await fetch('/updatePointsStreaks', {\r\n        method: 'put',\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json'\r\n        },\r\n        body: formData\r\n    });\r\n\r\n    responseHandling.handleResponse(pointsStreaksResponse, false);\r\n\r\n    // pull out the new values for the players and apply them to the UI.\r\n        // Also, reset guesses.\r\n    const gameDataJSON = await requestUpdate('/getGameData', 'get', true);\r\n    const gameData = gameDataJSON.rooms[roomID];\r\n\r\n    Object.keys(gameData.users).forEach((u) => {\r\n        const playerPoints = document.getElementById(u + \"Points\");\r\n        const playerStreak = document.getElementById(u + \"Streak\");\r\n\r\n        playerPoints.innerHTML = gameData.users[u].points;\r\n        playerStreak.innerHTML = gameData.users[u].streak;\r\n\r\n        const userCurrentGuess = document.getElementById(u + \"Guess\");\r\n        userCurrentGuess.innerText = 'N/A';\r\n    });\r\n\r\n    // Update round number.\r\n    updateRound(gameData.roundNum, roomID);\r\n\r\n    updateArticle(roomID);\r\n}\r\n\r\n// Called when front-end UI makes a game-related PUT request.\r\nconst sendPut = async (pointsStreaksButton) => {\r\n    //Grab the request info.\r\n    const url = pointsStreaksButton.getAttribute('action');\r\n    const method = pointsStreaksButton.getAttribute('method');\r\n\r\n    let response = await fetch(url, {\r\n        method,\r\n        headers: {\r\n            'Accept': 'application/json'\r\n        }\r\n    });\r\n\r\n    // Handled returned response and display on the front end.\r\n    responseHandling.handleResponse(response, true);\r\n}\r\n\r\nmodule.exports = {\r\n    updateArticle,\r\n    updateRound,\r\n    requestUpdate,\r\n    userPostAdd,\r\n    nextQuestion,\r\n    sendPut\r\n}\n\n//# sourceURL=webpack://onion-or-not/./client/functionSets/gameFunctions.js?");

/***/ }),

/***/ "./client/functionSets/playerFunctions.js":
/*!************************************************!*\
  !*** ./client/functionSets/playerFunctions.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createPlayer\": () => (/* binding */ createPlayer)\n/* harmony export */ });\nconst responseHandling = __webpack_require__(/*! ./responseHandling.js */ \"./client/functionSets/responseHandling.js\");\r\n\r\n// HTML that is generated when a player is added to the UI.\r\nconst createPlayerHTML = (id) => {\r\n    return `\r\n        <p class=\"playerName\" id=\"${id}Name\"></p>\r\n        <label>${id} thinks it...</label>\r\n        <p id=\"${id}Guess\">N/A</p>\r\n        <form class=\"guessForm\" id=\"${id}GuessForm\" action=\"/addGuess\" method=\"post\">\r\n            <label for=\"guess\">Is it The Onion?</label>\r\n            <div class=\"guessRadioButtons\">\r\n                <input type=\"radio\" id=\"onionY${id}\" name=\"isItOnion${id}\" value=\"y\">\r\n                <label for=\"onionY\">yes</label><br>\r\n                <input type=\"radio\" id=\"onionN${id}\" name=\"isItOnion${id}\" value=\"n\">\r\n                <label for=\"onionN\">no</label><br>\r\n            </div>\r\n            <input type=\"submit\" value=\"Post Guess Method\" />\r\n        </form>\r\n        <div class=\"pointsAndStreaks\">\r\n            <div>\r\n                <label>Points:</label>\r\n                <p class=\"points\" id=\"${id}Points\"></p>\r\n            </div>\r\n            <div>\r\n                <label>Streak:</label>\r\n                <p class=\"streaks\" id=\"${id}Streak\"></p>\r\n            </div>\r\n        </div>\r\n        <button id=\"remove${id}Button\" action=\"/removeUser\" method=\"post\" type=\"button\">Stop playing?</button>\r\n    `\r\n}\r\n\r\n// Called when front-end UI makes a user-related POST request.\r\nconst userPostRemove = async (nfValue, roomID) => {\r\n    \r\n    // Build your data string.\r\n    const formData = `name=${nfValue}&roomID=${roomID}`;\r\n\r\n    // Make and wait for your fetch response.\r\n    let response = await fetch('/removeUser', {\r\n        method: 'post',\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json',\r\n        },\r\n        body: formData,\r\n    });\r\n\r\n    if (response.status == 202) {\r\n        const user = document.getElementById(nfValue);\r\n        user.remove();\r\n    }\r\n\r\n    // Handled returned response and display on the front end.\r\n    responseHandling.handleResponse(response, true);\r\n};\r\n\r\n// Called when front-end UI makes a guess-related POST request.\r\nconst guessPost = async (nfValue, roomID) => {\r\n    \r\n    // Grab the form info.\r\n    const guessField = document.getElementsByName('isItOnion' + nfValue);\r\n    let guess;\r\n    for (let g of guessField)\r\n    {\r\n        if (g.checked) {\r\n            guess = g.value;\r\n        }\r\n    }\r\n    // Build your data string.\r\n    const formData = `name=${nfValue}&isOnion=${guess}&roomID=${roomID}`;\r\n\r\n    // Make and wait for your fetch response.\r\n    let response = await fetch('/addGuess', {\r\n        method: 'post',\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json',\r\n        },\r\n        body: formData,\r\n    });\r\n\r\n    if (response.status == 201) {\r\n        const userCurrentGuess = document.getElementById(nfValue + \"Guess\");\r\n        if (guess == 'y') {\r\n            userCurrentGuess.innerHTML = '... is The Onion.';\r\n        } else {\r\n            userCurrentGuess.innerHTML = '... is not The Onion.';\r\n        }\r\n    }\r\n\r\n    // Handled returned response and display on the front end.\r\n    responseHandling.handleResponse(response, true);\r\n};\r\n\r\n// Change UI to reflect new player.\r\nconst createPlayer = (nfValue, roomID) => {\r\n    // Reflect the new player within the UI.\r\n    const newPlayer = document.createElement('div');\r\n    newPlayer.classList.add('player');\r\n    newPlayer.setAttribute('id', nfValue);\r\n    newPlayer.innerHTML = createPlayerHTML(nfValue);\r\n    const currentUsers = document.getElementById(\"currentUsers\");\r\n    currentUsers.appendChild(newPlayer);\r\n\r\n    // Set up the form's created for the new player.\r\n    const removeUserButton = document.getElementById('remove' + nfValue + 'Button');\r\n    const guessForm = document.getElementById(nfValue + 'GuessForm');\r\n\r\n    const removeUser = () => {\r\n        userPostRemove(nfValue, roomID);\r\n        return false;\r\n    }\r\n    const addGuess = (e) => {\r\n        e.preventDefault();\r\n        guessPost(nfValue, roomID);\r\n        return false;\r\n    }\r\n\r\n    removeUserButton.addEventListener('click', removeUser);\r\n    guessForm.addEventListener('submit', addGuess);\r\n\r\n    // Add data to the new UI added for the player.\r\n    const playerNameHolder = document.getElementById(nfValue + 'Name');\r\n    playerNameHolder.innerHTML = nfValue;\r\n\r\n    const playerPoints = document.getElementById(nfValue + \"Points\");\r\n    playerPoints.innerHTML = 0;\r\n    const playerStreak = document.getElementById(nfValue + \"Streak\");\r\n    playerStreak.innerHTML = 0;\r\n\r\n    // const hiddenElements = document.getElementsByClassName(\"hide\");\r\n    // for(const e of hiddenElements) {\r\n    //     e.classList.remove(\"hide\");\r\n    // };\r\n}\n\n//# sourceURL=webpack://onion-or-not/./client/functionSets/playerFunctions.js?");

/***/ }),

/***/ "./client/functionSets/responseHandling.js":
/*!*************************************************!*\
  !*** ./client/functionSets/responseHandling.js ***!
  \*************************************************/
/***/ ((module) => {

eval("let debugValue = false;\r\n\r\n// Handle responses on the front end.\r\nconst handleResponse = async (response, parseResponse) => {\r\n    if (parseResponse) {\r\n        // Parse the response to JSON.\r\n        let obj = await response.json();\r\n        console.log(obj);\r\n\r\n        if (debugValue) {\r\n            const content = document.querySelector('#responseHandler');\r\n    \r\n            // Pick HTML message to display based on response status\r\n            switch (response.status) {\r\n                case 200:\r\n                    content.innerHTML = `<b>Success</b>`;\r\n                    break;\r\n                case 201:\r\n                    content.innerHTML = `<b>Created</b>`;\r\n                    break;\r\n                case 202:\r\n                    content.innerHTML = `<b>Accepted</b>`\r\n                case 204:\r\n                    content.innerHTML = `<b>Updated (No Content)</b>`;\r\n                    return;\r\n                case 400:\r\n                    content.innerHTML = `<b>Bad Request</b>`;\r\n                    break;\r\n                case 404:\r\n                    content.innerHTML = `<b>Not Found</b>`;\r\n                    break;\r\n                default:\r\n                    content.innerHTML = `<b>Response code not implemented by client.</b>`;\r\n                    break;\r\n            }\r\n\r\n            // If we have a message, display it.\r\n            if(obj.message){\r\n                content.innerHTML += `<p>${obj.message}</p>`;\r\n            } else if (obj) {\r\n                content.innerHTML += `<p>${JSON.stringify(obj)}</p>`;\r\n            }\r\n        }\r\n\r\n    }\r\n}\r\n\r\nconst enableDebug = () => {\r\n    debugValue = true;\r\n}\r\n\r\nmodule.exports = {\r\n    handleResponse,\r\n    enableDebug\r\n}\n\n//# sourceURL=webpack://onion-or-not/./client/functionSets/responseHandling.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/client.js");
/******/ 	
/******/ })()
;