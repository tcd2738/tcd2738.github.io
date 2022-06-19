//Player class!
class Ghostbuster extends PIXI.Graphics{
	constructor(color=0xFFFFFF, x=0, y=0){
		super();
		this.x = x;
		this.y = y;
        this.speed = 75;
        this.radius = 15;
		this.beginFill(color);
		this.drawCircle(0,0,15);
		this.endFill();
		
		// movement
		this.dx = 0; 
        this.dy = 0; 

        this.isAlive = true;
        this.isGhost = false;
	}
    
    // used for movement
	update(dt){
		this.x += this.dx * dt;
		this.y += this.dy * dt;
	}
}

//Base bullet class very similar to cirlce blasts
class Bullet extends PIXI.Graphics{
    constructor(color=0xFFFFFF, x=0,y=0, fwdX = 0, fwdY = -1){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,4,6);
        this.endFill();
        this.x = x;
        this.y = y;
        // variables
        this.fwd = {x:fwdX,y:fwdY};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }
}

//Used for movement of objects in game
class Vector{
    constructor(x,y, x2, y2)
    {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;

        this.xMagnitude = x2 - x;
        this.yMagnitude = y2 - y;

        this.magnitude = Math.sqrt((this.xMagnitude*this.xMagnitude) + (this.yMagnitude*this.yMagnitude));
    }

    normalize()
    {
        this.xMagnitude = this.xMagnitude / this.magnitude;
        this.yMagnitude = this.yMagnitude / this.magnitude;
        this.magnitude = 1;    
    }

    //Subtract vect 2 from vect 1 (vect 1 - vect 2)
    subtract(vec2)
    {
        // X2 and Y2 remain the same
        this.x = vec2.x2;
        this.y = vec2.y2;
        
        //Recalculate the magnitudes
        this.xMagnitude = (this.xMagnitude - vec2.xMagnitude);
        this.yMagnitude = (this.yMagnitude - vec2.yMagnitude);
        this.magnitude = Math.sqrt((this.xMagnitude*this.xMagnitude) + (this.yMagnitude*this.yMagnitude));
    }

    //Add vector 2 to vector 1
    add(vec2)
    {
        // X and Y remain the same
        this.x2 = vec2.x2;
        this.y2 = vec2.y2;
        
        //Recalculate the magnitudes
        this.xMagnitude = (this.xMagnitude + vec2.xMagnitude);
        this.yMagnitude = (this.yMagnitude + vec2.yMagnitude);
        this.magnitude = Math.sqrt((this.xMagnitude*this.xMagnitude) + (this.yMagnitude*this.yMagnitude));
    }

    //Multiply by scalar
    multiplyBy(num)
    {
        //X and y remain the same
        this.x2 = this.x2 * num;
        this.y2 = this.y2 * num;

        //Recalculate the magnitudes
        this.xMagnitude = this.x2 - this.x;
        this.yMagnitude = this.y2 - this.y;
        this.magnitude = Math.sqrt((this.xMagnitude*this.xMagnitude) + (this.yMagnitude*this.yMagnitude));
    }
}

//Enemy of the game
class Ghost extends PIXI.Graphics{
    //Health, speed, appearance, spawn (4/5/6 options)
    constructor(color, x, y, health, speed, radius){

        super();
		this.beginFill(color);
		this.drawCircle(0,0,radius);
        this.endFill();
        
        this.originalHealth = health;
        this.health = health;
        this.speed = speed;

        this.x = x;
        this.y = y;
        this.radius = radius
        this.fwd = {x:0,y:0};
        this.isGhost = true;
    }

    // used for movement
	update(dt, players, ghosts, walls){

        let ultimateForce = new Vector(0,0,0,0);

        //If out of the bounds of the level, make it move towards the closest 'spawn' door
        if(this.x > 990 || this.y > 590 || this.x < 10 || this.y < 10)
        {
            let closestValue = 9007199254740990; //Max int - 1 :)
            let spawnVector;
            for(let w of walls)
            {
                if(w.spawnWall == true)
                {
                    let distance = new Vector(this.x, this.y, w.x + (w.width/2), w.y + (w.height/2));
                    if(distance.magnitude < closestValue)
                    {
                        closestValue = distance.magnitude;
                        spawnVector = distance;
                    }    
                }
            }
            ultimateForce.add(spawnVector);
        }
        else
        {
            //Finding closest player to chase if inside the level
            let closestValue = 9007199254740990; //Max int - 1 :)
            let playerToChaseVector;
            for(let p of players)
            {
                let distance = new Vector(this.x, this.y, p.x, p.y);
                if(distance.magnitude < closestValue)
                {
                    closestValue = distance.magnitude;
                    playerToChaseVector = distance;
                }
            }
            playerToChaseVector.normalize();
            ultimateForce.add(playerToChaseVector);


        }

        ultimateForce.normalize();

        this.fwd = ultimateForce;
        this.x += ultimateForce.xMagnitude * this.speed * dt;
        this.y += ultimateForce.yMagnitude * this.speed * dt;
    }
    
    takeDamage(){
        this.health -= 1;

        this.alpha = this.alpha - (this.alpha/this.originalHealth);

        if(this.health == 0)
        {
            this.alpha = 0;
        }
    }
}
//Used for ghost spawning
class spawnPoint{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

//Used for level creation
class Wall extends PIXI.Graphics
{
    constructor(x,y,width=50,height=100,color=0xFFFFFF,ghostCollision=true, spawnWall=false)
    {
        super();
        this.beginFill(color);
        this.drawRect(0,0,width,height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.leftX = x;    
        this.rightX = x + width;
        this.upperY = y;
        this.lowerY = y + height;
        this.height = height;
        this.width = width;
        this.hasCollision = true; //Used to check for open door in collision tests
        this.ghostCollision = ghostCollision; //Used for blocking off spawn points
        this.spawnWall = spawnWall;
    }
}

//Used for doors that open and close after each wave
class Door extends PIXI.Graphics
{
    constructor(x,y,width=50,height=100,color=0xFF0000, collision=true)
    {
        super();
        this.beginFill(color);
        this.drawRect(0,0,width,height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.leftX = x;
        this.rightX = x + width;
        this.upperY = y;
        this.lowerY = y + height;
        this.height = height;
        this.width = width;
        this.hasCollision = collision;
        this.ghostCollision = false;
        let timer;

        //If initially the door is invisible
        if(collision == false)
        {
            this.alpha = 0;
        }
    }

    // Ability for doors to essentially open and close, called 10 times to fully close or open
    //Thanks to https://www.w3schools.com/jsref/met_win_setinterval.asp for the timer
    doorOpening(increment)
    {
        if(this.hasCollision)
        {
            this.alpha -= increment;
        }

        else
        {
            this.alpha += increment;
        }

        //'Finalizing' door state

        if(this.alpha < .1)
        {
            this.alpha = 0;
            this.hasCollision = false;
        }

        else if(this.alpha > .9)
        {
            this.alpha = 1;
            this.hasCollision = true;
        }
    }

    //Used for opening and closing doors
    alphaChange(increment,positive)
    {
        if(this.hasCollision == false)
        {
            timer = window.setInterval(this.alphaChange(.1,true),1000);
            this.hasCollision = true;
        }
        else
        {
            timer = window.setInterval(this.alphaChange(-.1,false),1000);
            this.hasCollision = false;
        }
        if((this.alpha > .9 && positive == true) ||(this.alpha < .1 && positive == false))
        {
            window.clearInterval(timer);
        }
        else
        {
            this.alpha += increment;
        }
    }
}