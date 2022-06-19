// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application(1000,700);
//document.body.appendChild(app.view);
let p3 = document.querySelector("#project3");
p3.appendChild(app.view);


// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let stage;

let bulletSound, ghostHitSound, playerDeathSound, newWaveSound, music;

let pause;
let startScene;
let gameScene;
let gameOverScene;
let startCount;
let endCount;

let startImage;
let endImage;
let startButton;
let scoreLabel;
let waveLabel;
let endButton;
let highScoreLabel;

let current;    //Current ghostbuster for storage	
let players = [];
let player1;
let player2;
//let player3;
//let player4;

let oldPlayerX;
let oldPlayerY;

let mousePosition;
let bullets = [];
let ghosts = [];
let walls = [];
let doors = [];

let waveCounter;
let score;
let previousScore;

let spawns = [];
let spawn2;
let spawn3;
let spawn4;
let spawn5;
let spawn6;
let spawn7;
let spawn8;

let timer; //Used for door opening

let savedDataNum;

window.onload = ()=>{
    pause = true;
    stage = app.stage;

    startCount = 0;
    endCount = 0;

    //Get sound files
    //Thanks to howler's documentation! https://github.com/goldfire/howler.js#global-options

    //Thank you so much to Eric Skiff for the free to use music. Here is his website! https://ericskiff.com/music/
    music = new Howl({
        src: ['sounds/music.mp3'],
        volume: .25
    });

    bulletSound = new Howl({
        src: ['sounds/shoot.wav'],
        volume: .6
    });

    ghostHitSound = new Howl({
        src: ['sounds/hit.wav'],
        volume: .3
    });

    playerDeathSound = new Howl({
        src: ['sounds/playerDeath.wav'],
        volume: .5
    });

    newWaveSound = new Howl({
        src: ['sounds/newWave.wav'],
        volume: .5
    });

    //Play music, loop it :D
    music.loop = true;
    music.play();

    // START SCREEN ITEMS
    startScene = new PIXI.Container();
    stage.addChild(startScene);
    startScene.visible = true;

    let texture = PIXI.Texture.from('media/HauntedHoldupStartScreen.gif');
    startImage = new PIXI.Sprite(texture);
    startImage.anchor.set(0);
    startScene.addChild(startImage);

    // GAME SCREEN ITEMS
    gameScene = new PIXI.Container();
    stage.addChild(gameScene);
    gameScene.visible = false;

    waveCounter = 0;
    score = 0;

    // END SCREEN ITEMS
    gameOverScene = new PIXI.Container();
    stage.addChild(gameOverScene);
    gameOverScene.visible = false;

    texture = PIXI.Texture.from('media/HauntedHoldupEndScreen.gif');
    endImage = new PIXI.Sprite(texture);
    endImage.anchor.set(0);
    gameOverScene.addChild(endImage);

    // creation of ghost spawns (doesn't need repeated between reboots)
    spawn2 = new spawnPoint(-80, 415);
    spawn3 = new spawnPoint(1080, 440);
    spawn4 = new spawnPoint(120, 680);
    spawn5 = new spawnPoint(840,680);
    spawn6 = new spawnPoint(160, -80);
    spawn7 = new spawnPoint(440,-80);
    spawn8 = new spawnPoint(650, -80);

    spawns.push(spawn2);
    spawns.push(spawn3);
    spawns.push(spawn4);
    spawns.push(spawn5);
    spawns.push(spawn6);
    spawns.push(spawn7);
    spawns.push(spawn8);

    createLabelsAndButtons();

    // menu loop
    app.ticker.add(startGame);
}

function createLabelsAndButtons(){

    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: "Harlow",
        stroke: 0xff0000,
        strokeThickness:4,
    });

    let startButton = new PIXI.Text("");
    startButton.style = textStyle;
    startButton.x = 225;
    startButton.y = 425;
    startButton.width = 550;
    startButton.height = 80;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on('pointerup', loadLevel);
    startScene.addChild(startButton);

    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 625;
    gameScene.addChild(scoreLabel);

    waveLabel = new PIXI.Text();
    waveLabel.style = textStyle;
    waveLabel.x = 300;
    waveLabel.y = 625;
    gameScene.addChild(waveLabel);

    let highScoreStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 60,
        fontFamily: "Harlow",
        stroke: 0xff0000,
        strokeThickness:4,
    });

    highScoreLabel = new PIXI.Text();
    highScoreLabel.style = highScoreStyle;
    highScoreLabel.x = 600;
    highScoreLabel.y = 100;
    gameOverScene.addChild(highScoreLabel);

    let endButton = new PIXI.Text("");
    endButton.style = textStyle;
    endButton.x = 100;
    endButton.y = 425;
    endButton.width = 375;
    endButton.height = 80;
    endButton.interactive = true;
    endButton.buttonMode = true;
    endButton.on('pointerup', loadLevel);
    gameOverScene.addChild(endButton);
}

function startGame(){
    startScene.visible = true;
    gameScene.visible = false;
    gameOverScene.visible = false;

    // check to stop repeat keyboard presses
    startCount++;
}

function loadLevel(){

    if(startCount > 0)
    {
        app.ticker.remove(startGame);
        startCount=0;
    }

    if(endCount > 0)
    {
        waveCounter = 0;
        score = 0;
        app.ticker.remove(end);
        endCount = 0;
    }


    player1 = new Ghostbuster(0xFF0000,100,200);
    player2 = new Ghostbuster(0x00FF00, 500, 500);
    //player3 = new Ghostbuster(0xFFFF00, 500,500);
    //player4 = new Ghostbuster(0x0000EE, 900,100);

    current = player1;
    players.push(player1);
    players.push(player2);
    //players.push(player3);
    //players.push(player4);

    gameScene.addChild(player1);
    gameScene.addChild(player2);
    //gameScene.addChild(player3);
    //gameScene.addChild(player4);

    // make bullet fire later
    app.view.onclick = fireBullet;

    newWave();

    app.ticker.add(gameLoop);
    startScene.visible = false;
    gameScene.visible = true;
    gameOverScene.visible = false;
    pause = false;
    levelCreation(); 
}

function gameLoop(){
    if (pause) return;

    // #1 - Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    // #2 - keep score
    increaseScore(1/dt);
    
    // #3 - check for player change
    if(players.length > 1)
    {
        if(keys[keyboard.ONE])
        {
            current = player1;
        }
        else if(keys[keyboard.TWO])
        {
            current = player2;
        }
    }

    //Future possibility? Gameplay was a little clunky
    /*
    else if(keys[keyboard.THREE])
    {
        current = player3;
    }
    else if(keys[keyboard.FOUR])
    {
        current = player4;
    }*/

    //Clear outlines
    for(let p of players)
    {
        p.alpha = .3;
    }
    
    current.alpha =1;

    // #4 - check keys for movement
    if(keys[keyboard.RIGHT]){
        current.dx = current.speed;
    }else if(keys[keyboard.LEFT]) {
        current.dx = -current.speed;
    }else{
        current.dx = 0;
    }
    
    if(keys[keyboard.DOWN]){
        current.dy = current.speed;
    }else if(keys[keyboard.UP]) {
        current.dy = -current.speed;
    }else{
        current.dy = 0;
    }
    
    // #5 - move current player
    current.update(dt); 

    // #6
    //Collision 

    //Wall and door collision calls with 
    structBulletCollision(walls,bullets);
    structBulletCollision(doors,bullets);


    //Wall and door collision calls with entities
    structEntityCollision(walls,players);
    structEntityCollision(walls,ghosts);
    structEntityCollision(doors,players);
    structEntityCollision(doors,ghosts);

    // #7 - check for bullet/ghost collisions
    for(let b of bullets){
        for(let g of ghosts){
            if(rectsIntersect(b,g)){
                gameScene.removeChild(b);
                b.isAlive = false;

                g.takeDamage();

                //Play Sound
                ghostHitSound.play();
            }
        }
    }

    // #8 - check for ghost/player collisions
    for(let g of ghosts){
        for(let p of players){
            if(rectsIntersect(g,p)){
                gameScene.removeChild(p);
                p.isAlive = false;

                //Play Sound!
                playerDeathSound.play();
            }
        }
    }

    // #9 - change current player if current is dead
    if(current.isAlive == false){
        for(let p of players){
            current = p;
        }
    }

    // #10 - move bullets
    for(let b of bullets){
        b.move(dt);

        if(b.x > sceneWidth + 3 || b.x < -3 || b.y > sceneHeight +3 || b.y < -3)
        {
            b.isAlive = false;
        }
    }

    // #11 - create new wave if needed
    if(ghosts.length == 0)
    {
        newWave();
    }

    // #12 - move Ghosts
    for(let g of ghosts){
        g.update(dt,players,ghosts,walls,doors);   
    }

    // #13 - get rid of dead items
    bullets = bullets.filter(b=>b.isAlive);
    ghosts = ghosts.filter(g=>g.health > 0);
    players = players.filter(p=>p.isAlive);

    if(players.length == 0)
    {
        previousScore = score;
        app.ticker.remove(gameLoop);
        app.ticker.add(end);
    }
}

function end(){
    startScene.visible = false;
    gameScene.visible = false;
    gameOverScene.visible = true;
    pause = true;
    
    //Gets rid of all of items in arrays
    if(endCount == 0){
        bullets.forEach(b=>gameScene.removeChild(b));
        bullets = [];
    
        ghosts.forEach(g=>gameScene.removeChild(g));
        ghosts = [];
    
        players.forEach(p=>gameScene.removeChild(p));
        players = [];

        walls.forEach(w=>gameScene.removeChild(w));
        walls = [];

        doors.forEach(d=>gameScene.removeChild(d));
        doors = [];

        saveData(score); //Saves latest score and prints top 5 to the end screen
    }

    // check to stop repeat keyboard presses
    endCount++;
}

//Called when player is firing bullet
function fireBullet(e){
    if(endCount == 0 && startCount == 0 && players.length > 0)
    {
        mousePosition = app.renderer.plugins.interaction.mouse.global;
        let fireVect = new Vector(current.x,current.y,mousePosition.x,mousePosition.y);
        fireVect.normalize();
        let b = new Bullet(0xFFFFFF, current.x, current.y,fireVect.xMagnitude,fireVect.yMagnitude);
        bullets.push(b);
        gameScene.addChild(b);

        //Play sound!
        bulletSound.play();
    }
}

//Function to simplify creation of ghost
function addGhosts(color,x,y,health,speed,radius){
    let g = new Ghost(color,x,y,health,speed, radius);
    ghosts.push(g);
    gameScene.addChild(g);
}

// handles waves and spawning of ghosts
function newWave(){

    //Switches all open doors to closed, and all closed doors to open in a nice transition
    if(waveCounter > 0)
    {
        let j = 0; //Keeps track of time
        timer = window.setInterval(function()
        {
        for(let i = 0; i < doors.length; i++)
        {
            doors[i].doorOpening(.1);
        }
        j++;

        if(j == 10)
        {
            clearInterval(timer);
        }
        },100);
    }

    //Play sound
    newWaveSound.play();
    
    let nextSpawn = spawns[getRandomRange(spawns.length)];
    let ghostsToSpawn = (waveCounter/5) + 3;
    
    let numExtraSpawns = Math.trunc(waveCounter / 4); //Thanks geeksforgeeks.org for the idea ! https://www.geeksforgeeks.org/javascript-math-trunc-function/
    let extraSpawn;
    for(let i = 0; i < numExtraSpawns; i++)
    {
        extraSpawn = spawns[getRandomRange(spawns.length)];
        for(let j = 0; j < ghostsToSpawn; j++)
        {
            addGhosts(0xFFFFFF, extraSpawn.x + getRandomRange(120), extraSpawn.y + getRandomRange(120),3,50, 15);
        } 
    }

    if(waveCounter%5 == 0 && waveCounter != 0)
    {
        let secondSpawn = spawns[getRandomRange(spawns.length)];
        let specialSpawn = getRandomRange(2);
        if(specialSpawn == 0)
        {
            for(let j = 0; j < ghostsToSpawn; j++)
            {
                addGhosts(0xFFFFFF, nextSpawn.x + getRandomRange(120), nextSpawn.y + getRandomRange(120),3,50, 15);
            }

            // extra tiny ghost bonus wave
            for(let j = 0; j < (waveCounter/5)*10; j++)
            {
                addGhosts(0xFFFFFF, secondSpawn.x + getRandomRange(120), secondSpawn.y + getRandomRange(120),1,80,5);
            }
        }
        else
        {
            for(let j = 0; j < ghostsToSpawn; j++)
            {
                addGhosts(0xFFFFFF, nextSpawn.x + getRandomRange(120), nextSpawn.y + getRandomRange(120),3,50, 15);
            }

            // extra big ghost bonus wave
            for(let j = 0; j < waveCounter/5; j++)
            {
                addGhosts(0xFFFFFF, secondSpawn.x + getRandomRange(120), secondSpawn.y + getRandomRange(120),10,30,30);
            }
        }
    }
    else
    {
        for(let j = 0; j < ghostsToSpawn; j++)
        {
            addGhosts(0xFFFFFF, nextSpawn.x + getRandomRange(120), nextSpawn.y + getRandomRange(120),3,50, 15);
        }
    }


    waveCounter++;
    waveLabel.text = `Wave:  ${waveCounter}`;
}

//Called to increase score over a time
function increaseScore(time){
    // score is calculated as (players left alive * number of waves survived) every second
    score += players.length * waveCounter;

    scoreLabel.text = `Score:  ${score}`;
}

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b)
{
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// Creates walls and doors of level
function levelCreation()
{
    // door - 80 width
    
    
    // Upper Outer walls + spawn walls - Spawn walls are blue, purple is normal wall color
    createWall(0,0,120,25,0x331a00,true);
    createWall(120,0,80,25,0xFFFF00,false, true);     // Spawn wall
    createWall(200,0,160,25,0x331a00,true);
    createWall(360,0,80,25,0xFFFF00,false, true);     // Spawn wall
    createWall(440,0,170,25,0x331a00,true);
    createWall(610,0,80,25,0xFFFF00,false, true);     // Spawn wall
    createWall(690,0,310,25,0x331a00,true);

    // Right Outer Walls
    createWall(975,25,25,375,0x331a00,true);
    createWall(975,400,25,80,0xFFFF00,false, true);   // Spawn wall
    createWall(975,480,25,120,0x331a00,true);

    //Bottom Outer walls + spawn walls
    createWall(0,575,80,25,0x331a00,true);
    createWall(80,575,80,25,0xFFFF00,false, true);    // Spawn wall
    createWall(160,575,600,25,0x331a00,true);
    createWall(760,575,80,25,0xFFFF00,false, true);   // Spawn wall
    createWall(840,575,160,25,0x331a00,true);

    //Left Outer Walls
    createWall(0,25,25,350,0x331a00,true);
    createWall(0,375,25,80,0xFFFF00,false, true); // Spawn wall
    createWall(0,455,25,145,0x331a00,true);

    ///////////////////////////////////////////////////////////////////////

    //Top left Room ('Red set of doors')
    createWall(25,125,160,25,0x331a00,false);
    createWall(185,125,25,275,0x331a00,false);
    createDoor(210,125,80,25,0xb5651d,false);   //Horizontal, starts visible
    createWall(290,105,25,150,0x331a00,false);
    createDoor(290,25,25,80,0xb5651d,true); //Vertical

    //Top middle room (continuation of previous walls + doors)
    createWall(290,255,150,25,0x331a00,false);
    createDoor(440,255,120,25,0xb5651d,false); //Horizontal
    createWall(560,255,175,25,0x331a00,false);
    createWall(735,25,25,60,0x331a00,false);
    createDoor(735,85,25,100,0xb5651d,true);  //Vertical, starts visible
    createWall(735,185,25,95,0x331a00,false);

    //Right hallway (blue doors hallway) 7 or 8 walls/doors combined
    createDoor(865,150,110,25,0xb5651d,false); //Horizontal
    createWall(840,150,25,140,0x331a00,false);
    createDoor(840,290,25,90,0xb5651d,true);  //Vertical, starts visible
    createWall(840,380,25,50,0x331a00,false);
    createWall(350,405,515,25,0x331a00,false);
    createWall(350,430,25,30,0x331a00,false);
    createDoor(350,460,25,85,0xb5651d,true);  //Vertical, starts visible
    createWall(350,545,25,30,0x331a00,false);
}

//Simplifies making walls (as simple as it can be without stand-alone editor!)
function createWall(x,y,width=50,height=100,color=0xFFFFFF,ghostCollision=true,spawnWall=false)
{
    let wall = new Wall(x,y,width,height,color,ghostCollision,spawnWall);
    walls.push(wall);
    gameScene.addChild(wall);
}

//Simplifies making doors (as simple as it can be without stand-alone editor!)
function createDoor(x,y,width=50,height=100,color=0xFF0000, collision=true)
{
    let door = new Door(x,y,width,height,color,collision);
    doors.push(door);
    gameScene.addChild(door);
}

//Collision detection between doors/walls and players/ghosts
function structBulletCollision(structures,bullets)
{
    for(let s of structures)
    {
        for(let b of bullets)
        {
            if(s.hasCollision == true && rectsIntersect(s,b))
            {
                gameScene.removeChild(b);
                b.isAlive = false;
            }
        }
    }
}

//Collision detection and handling between walls/doors and players/ghosts
function structEntityCollision(structures,entities)
{    
    for(let s of structures)
    {
        for(let e of entities)
        {
            // Checking for either non-ghost, or it is a ghost and the wall has collision
            if(e.isGhost == false || (e.isGhost == true && s.ghostCollision == true))
            {
                // Check s isnt an open door and e is colliding with it
                if(s.hasCollision == true && rectsIntersect(s,e))
                {
                    // Top of wall
                    if(s.upperY < e.y + e.radius && e.y < (s.upperY + e.radius) && e.x > s.leftX - (e.radius/2) && e.x< s.rightX+(e.radius/2))
                    {
                        e.y = s.upperY-e.radius;
                    }
    
                    // Bottom of wall
                    if(s.lowerY > e.y - e.radius && e.y > (s.lowerY -e.radius) && e.x > s.leftX -(e.radius/2) && e.x< s.rightX+(e.radius/2))
                    {
                        e.y = s.lowerY + e.radius;
                    } 

                    // Left of wall
                    if(s.leftX < e.x + e.radius && e.x < (s.leftX + e.radius) && e.y > s.upperY -(e.radius/2) && e.y < s.lowerY +(e.radius/2))
                    {
                        e.x = s.leftX - e.radius; 
                    }

                    // Right of wall
                    if(s.rightX > e.x - e.radius && e.x > (s.rightX - e.radius) && e.y > s.upperY -(e.radius/2) && e.y < s.lowerY +(e.radius/2))
                    {
                        e.x = s.rightX + e.radius;
                    } 
                }
            }
        }
    }
}

// function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomRange(max){
    return Math.floor(Math.random() * Math.floor(max));
}

//MADE USING OUR CODE FROM PROJECT 2 :D
//Used to save a non-trending search after it
function saveData(score)
{
    //Check if any data is there already
    let savedDataNum = 0;
    if(localStorage.getItem("bwb2109p3-storedNum") == null)
    {
        localStorage.setItem("bwb2109p3-storedNum", savedDataNum);
    }
    else
    {
        savedDataNum = parseInt(localStorage.getItem("bwb2109p3-storedNum"),10);
    }
    
    localStorage.setItem("bwb2109p3-storedNum-" +savedDataNum,score);

    //Increment data, hold number of items in storage
    savedDataNum++;
    localStorage.setItem("bwb2109p3-storedNum", savedDataNum);

    //Gather data to sort in descending order
    let data = [];
    for(let i = 0; i < savedDataNum; i++)
    {
        let tempScore = parseInt(localStorage.getItem("bwb2109p3-storedNum-"+i),10);
        data.push(tempScore);
    }

    //Sorting data array in descending order - bubble sort!
    for(let i = 0; i < data.length - 1; i++)
    {
        for(let j = 0; j < data.length - 1 - i; j++)
        {
            if(data[j] < data[j+1])
            {
                let temp = data[j + 1];
                data[j+1] = data[j];
                data[j] = temp;
            }
        }
    }

    displayScores(data);
}

//MADE USING OUR CODE FROM PROJECT 2 :D
//Used to display history buttons on side after each search and on page load
function displayScores(sortedScores)
{

    highScoreLabel.text = "High Scores:\n"
    for(let i = 0; i < 5; i ++)
    {
        if(sortedScores[i] != null)
        {
            if(sortedScores[i] == previousScore){
                highScoreLabel.text += `${sortedScores[i]} < You! \n`;
            }
            else
            {
                highScoreLabel.text += `${sortedScores[i]} \n`;
            }
        }
    }
}