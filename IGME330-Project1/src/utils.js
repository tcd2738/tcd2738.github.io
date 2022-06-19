import {Fighter} from "./classes/Fighter.js";
import {FighterList} from "./classes/FighterList.js";
import * as RandomizedFighterList from "./../randomizedFighterList.js";
import * as message from "./message.js";
import { Vector } from "./classes/Vector.js";

/* Fighter Creation */

// similar to template engine
// creates fighter table based off of current fighterList
function generateFighterTable(fighterList,table) {
    let html = "<table border='1|1'><tr><th>Fighters:</th></tr>";

    fighterList.forEach(element => {
        html+="<tr style='" + (element.isDead ? "opacity:.6;'" : "opacity:1;'") + ">";      
        html+="<td style='color:" + element.color + ";font-weight:bold;'>"+element.name+"</td>";
        html+="<td> Remaining Health: " + (element.health < 0 ? "0" : element.health) + "</td>";
        html+="<td><img id='fighterImage' src='"+element.img+"' alt='Image of fighter: '" + element.name + "'></img></td>";
        html+="<td>Total Kills: " + element.kills +"</td>";
        html+="</tr>";
    });

    html+="</table>";
    table.innerHTML = html;
}

// Makes sure the fighter stats are valid
function fighterStatChange(statSliders) {
    let totalPoints = 0;
    let sliderLabel;

    statSliders.forEach((slider) => {
        sliderLabel = document.querySelector("#" + slider.name + "Label");
        sliderLabel.innerHTML = slider.value;

        totalPoints += +slider.value;
    });

    let statErrorLabel = document.querySelector("#statError");
    if (totalPoints <= 15) {
        statErrorLabel.innerHTML = "";
    } else {
        statErrorLabel.innerHTML = "Your stats cannot exceed 15 points!";
    }
}

function fighterUpdates(typeUpdate, nameFighter1, nameFighter2=null)
{
    if(typeUpdate == "death" && nameFighter2 != null)
        return message.deathMessage(nameFighter1, nameFighter2);
    else if(typeUpdate == "attack" && nameFighter2 != null)
        return message.attackMessage(nameFighter1, nameFighter2);
    else if(typeUpdate == "defend" && nameFighter2 != null)
        return message.defendMessage(nameFighter1, nameFighter2);
    else if(typeUpdate == "event")
        return message.eventMessage(nameFighter1);
    else
        return "Sorry, I don't understand what type of update you wanted...";
}

function randomEvent(fighterList)
{
    let i = getRandomInt(0, fighterList.length - 1);
    while(fighterList[i].isDead)
    {
        i = getRandomInt(0, fighterList.length - 1);
    }

    document.querySelector("#fighterUpdateList").innerHTML += fighterUpdates("event", fighterList[i].name);
}

// Returns an array of positions of the living fighters 
function livingMembers(fighterList)
{
    let alive = new Array();
    for(let i = 0; i < fighterList.length; i++)
    {
        if(fighterList[i].isDead == false)
        {
            alive.push(i);
        }
    }
    return alive;
}

/* General Helpers */
function flipWeightedCoin(weight = 0.5){
    return Math.random() < weight;
}

// creates thumbnail image for before fighter is uploaded
function imageThumbnail() {

    // check for file uploads
    if (this.files && this.files[0]) { 

        // image uploading
        let img = document.querySelector('#fImage');
        img.onload = () => {
              // no longer needed, free memory
            URL.revokeObjectURL(img.src);
        }

        // set src to blob url
        img.src = URL.createObjectURL(this.files[0]);

        // check if error messages need to be uploaded
        let errMsg = document.querySelector("#imageError");
        if (!this.files[0].name.match(/.(jpg|jpeg|png)$/i)) {
            img.style.display = "none";
            errMsg.innerHTML = "That file is not an image!";
        } else if (this.files[0].size >= 500000) {
            img.style.display = "none";
            errMsg.innerHTML = "That file is too large!"
        } else {
            img.style.display = "block";
            errMsg.innerHTML = "";
        }
    }
}

// Creates a fighter at a random position on the map.
function createFighter(name, canvasWidth, canvasHeight, speed, health, attack, color = getRandomColor(), size=10, img=null) {
    // Doing this so that it appears at on of the random spots.
    let xPos = getRandomInt(0, canvasWidth/size) * size;
    let yPos = getRandomInt(0, canvasHeight/size) * size;
    let fighter = new Fighter(name, speed, health, attack, canvasWidth, canvasHeight, color, xPos, yPos, size, img);
    return fighter;
}

function createRandomFighter(canvasWidth, canvasHeight) {
    // grab a random fighter from the json object
    let randomInt = getRandomInt(0,RandomizedFighterList.default.length - 1);

    // Randomizing stats so that they always add to 9.
    let speed = 1 + getRandomInt(0, 9);
    let health = 1 + getRandomInt(0, 10-speed);
    let attack = 15 - (speed+health);

    return createFighter(RandomizedFighterList.default[randomInt].name, canvasWidth, canvasHeight, speed, health, attack, undefined, undefined, RandomizedFighterList.default[randomInt].img);
}

function bloodSplots(ctx, x, y)
{
    drawCircle(ctx, x+1, y+1, 4, '#FF00D4');
    drawCircle(ctx, x, y+7, 2, '#FF00D4');
    drawCircle(ctx, x+5, y+5, 3, '#FF00D4');
}

// Helpful Helpers!
function getRandomColor(){
    function getByte(){
      return 155 + Math.round(Math.random() * 100);
    }
    return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",0.8)";
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawCircle(ctx, x, y, radius, color){
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function clearScreen(ctx, canvasWidth, canvasHeight)
{
    //ctx.globalAlpha = 0.3; // Let's the fighters leave a fading trail behind them.
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
}

export {fighterStatChange, flipWeightedCoin, imageThumbnail, createFighter, createRandomFighter, clearScreen, getRandomInt, fighterUpdates, 
    livingMembers, generateFighterTable, randomEvent, bloodSplots};
