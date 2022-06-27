import * as utils from "./utils.js";
import { FighterList } from "./classes/FighterList.js";
import { Map } from "./classes/Map.js";
import { Fighter } from "./classes/Fighter.js";
import * as RandomizedFighterList from "./../randomizedFighterList.js";
import { Vector } from "./classes/Vector.js";

let ctx, canvas;
let fps = 6;
const canvasWidth = 660;
const canvasHeight = 340;
const spaceSize = 10;
let map;
let runningSimulation = false;
// Intervals.
let clearScreenInterval, drawInterval, collisionInterval, eventInterval;

function init () {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1.0;

    setupUI(ctx, canvasWidth, canvasHeight, fps);
}

function setupUI() {
    let fighterElements = document.querySelector('#fighterForm').elements;
    let fImageInput, submitFighter;
    let randomizedFighterButton;
    let statSliders;
    let startButton, pauseButton; 
    let terrainDropdown, terrainSlider; 
    let fighterList;
    let iCollapsible, instructions;

    fImageInput = document.querySelector('#fImageUpload');
    fImageInput.addEventListener('change', utils.imageThumbnail);

    fighterList = new FighterList();
    submitFighter = document.querySelector('#fighterSubmit');
    submitFighter.addEventListener('click', function() {
        formSubmission(fighterElements, fighterList);
    });

    
    map = new Map(spaceSize, (canvasWidth/spaceSize), (canvasHeight/spaceSize));
    map.drawMap(ctx);
    canvas.onclick = canvasClicked; 

    randomizedFighterButton = document.querySelector('#randomizedFighter');
    randomizedFighterButton.addEventListener('click', function (e) {
        let randomFighter = utils.createRandomFighter(canvasWidth, canvasHeight);

        // push and add random fighter to table
        fighterList.push(randomFighter);
        utils.generateFighterTable(fighterList, document.querySelector('#fighterTable'));
    });

    statSliders = document.querySelectorAll('.statSlider');
    statSliders.forEach((slider) => {
        // default value for sliders
        slider.value = 5;
        utils.fighterStatChange(statSliders);
        slider.addEventListener('input', function() {
            utils.fighterStatChange(statSliders);
        });
    });

    startButton = document.querySelector('#startButton');
    pauseButton = document.querySelector('#pauseButton');
    terrainDropdown = document.querySelector('#mTerrain');
    terrainSlider = document.getElementById("tSize");
    pauseButton.disabled = true;

    startButton.addEventListener('click', function () {
        setButtonIntervals(fighterList);
        
        // lock form
        for (let i = 0; i< fighterElements.length; i++) {
            fighterElements[i].disabled = true;  
        }
        startButton.disabled = true;
        randomizedFighter.disabled = true;
        terrainDropdown.disabled = true;
        terrainSlider.disabled = true;
        pauseButton.disabled = false;
        runningSimulation = true;
    });

    pauseButton.addEventListener('click', function () {
        startButton.disabled = false;
        pauseButton.disabled = true;
        clearButtonIntervals();
    });

    iCollapsible = document.querySelector("#iCollapsible");
    instructions = document.querySelector("#instructions");
    iCollapsible.addEventListener("click", function() {
        this.classList.toggle("active");
        if (instructions.style.display === "block") {
            iCollapsible.innerHTML = "How to Play ▼"
            instructions.style.display = "none";
        } else {
            iCollapsible.innerHTML = "How to Play ▲"
            instructions.style.display = "block";
        }
    });
}

function formSubmission(fighterElements, fighterList) {
    // make sure that the image and stats selected are valid
    let imageErrorLabel = document.querySelector('#imageError').innerText;
    let statErrorLabel = document.querySelector("#statError").innerHTML;

    if (imageErrorLabel == "" && statErrorLabel == "") {
        // use form elements to create fighter
        let fighterImage = fighterElements["fImageUpload"].value;
        let fighterImageFixed = fighterImage.replace('C:\\fakepath\\', "./uploads/");

        let tempFighter = utils.createFighter(fighterElements["fName"].value, canvasWidth, canvasHeight, fighterElements["fSpeed"].value, 
            fighterElements["fHealth"].value, fighterElements["fDamage"].value, fighterElements["fColor"].value, undefined, fighterImageFixed);
        fighterList.push(tempFighter);

        setTimeout(function () {         
            utils.generateFighterTable(fighterList, document.querySelector('#fighterTable'));
        }, 1000)
    }
}

function setButtonIntervals(fighterList) {
    clearButtonIntervals();

    // Clears the screen periodically so that the fighters don't leave a trail.
    clearScreenInterval = setInterval(function() {
        map.drawMap(ctx); //utils.clearScreen(ctx, canvasWidth, canvasHeight);
        radioCheckInterval(fighterList);
    }, 1000/fps);

    // Draws all fighters periodically.
    drawInterval = setInterval(function () {
        fighterList.drawFighters(ctx)
        fighterList.terrainCheck(map);
    }, 1000/fps);

    // Checks the collision off the fighters as they move.
    collisionInterval = setInterval(function () {
        fighterList.collisionFighters()
    }, 1000/fps);

    eventInterval = setInterval(function () {
        utils.randomEvent(fighterList);
    }, 30000/fps);
}

function clearButtonIntervals() 
{
    // Clears previous intervals.
    clearInterval(clearScreenInterval);
    clearInterval(drawInterval);
    clearInterval(collisionInterval);
    clearInterval(eventInterval);
}

function radioCheckInterval(fighterList) 
{
    let speedSlider = document.querySelector("#dSpeed");
    if (fps != +speedSlider.value) {     
        fps = +speedSlider.value;
        setButtonIntervals(fighterList);
    }
}

function canvasClicked(e){
    if(!runningSimulation)
    {
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;

        let position = new Vector(mouseX, mouseY);
        let terrain = document.querySelector('#mTerrain').value;
        map.drawNewTerrain(position, terrain, ctx);
    }
}

export {init};