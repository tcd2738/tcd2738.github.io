import * as utils from "../utils.js";

class Fighter{
    constructor(name, speed, health, attack, canvasWidth, canvasHeight, color="white", x=0, y=0, size=10, img=null)
    {
        // Movement
        this.cWidth = canvasWidth;
        this.cHeight = canvasHeight;
        this.centerX = canvasWidth/2;
        this.centerY = canvasHeight/2;
        this.horizontalWeight = 0.5;
        this.verticalWeight = 0.5
        this.finalTwo = false; // If this is in the final two, it won't move towards the center anymore.

        // Drawing
        this.color = color;
        this.x = x;
        this.y = y;
        this.size = size;
        this.altSprite;

        // Listing
        this.name = name;
        this.img = img;

        // Combat Stats
        this.speed = speed;
        this.health = health;
        this.attack= attack; 

        // Combat Generic
        this.isDead = false;
        this.kills = 0;

        // Terrain
        // How many "rounds" have passed since this fighter entered their rough terrain.
        this.terrainTimer = 0;
        // Determinining how much of a setback different terrains will be for this fighter. 
        this.rockSetBack = 2;
        if(this.speed <= 3)
            this.rockSetBack++;
        this.waterSetBack = 2;
        if(this.speed <= 6)
            this.waterSetBack++;
        if(this.speed <= 9)
            this.waterSetBack++;
        // The current terrain being traversed.
        this.currentTerrain;
    }

    draw(ctx)
    {
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;

        
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x+1, this.y, this.size-2, this.size);
       
        // Outline
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        
        // Center
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        //Drawing the base (no matter which sprite it is, this needs to be drawn).
        ctx.fillRect(this.x+3, this.y, 4, 4);
        ctx.fillRect(this.x+4, this.y+4, 2, 4);
        // Draws one of the two sprites (animates the fighter!)
        if(this.altSprite)
        {
            ctx.beginPath();
            ctx.moveTo(this.x+2, this.y+2);
            ctx.lineTo(this.x+3, this.y+2);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+1, this.y+7);
            ctx.lineTo(this.x+3, this.y+6);
            ctx.lineTo(this.x+6, this.y+6);
            ctx.lineTo(this.x+7, this.y+5);
            ctx.closePath();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x+2, this.y+8);
            ctx.lineTo(this.x+3, this.y+8);
            ctx.lineTo(this.x+3, this.y+7);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+5, this.y+8);
            ctx.lineTo(this.x+5, this.y+9);
            ctx.lineTo(this.x+6, this.y+9);
            ctx.closePath();
            ctx.stroke();
        }
        else
        {
            ctx.beginPath();
            ctx.moveTo(this.x+8, this.y+2);
            ctx.lineTo(this.x+7, this.y+2);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+3, this.y+4);
            ctx.lineTo(this.x+5, this.y+6);
            ctx.lineTo(this.x+7, this.y+6);
            ctx.lineTo(this.x+8, this.y+7);
            ctx.closePath();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x+3, this.y+9);
            ctx.lineTo(this.x+4, this.y+9);
            ctx.lineTo(this.x+4, this.y+8);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+6, this.y+7);
            ctx.lineTo(this.x+6, this.y+8);
            ctx.lineTo(this.x+7, this.y+8);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();

        this.altSprite = !this.altSprite;
        
        if(!this.finalTwo)
        {
            this.weights(this.centerX, this.centerY);
            this.move();
        }
        else
            this.moveInward();
    }

    move()
    {
        // Slight chance it won't move at all...
        if(utils.flipWeightedCoin(0.2))
        {
            return;
        }

        // Doing terrain checks; will move through difficult terrain slower based on speed.
        // If they just moved into difficult terrain...
        if((this.currentTerrain == "#515151" || this.currentTerrain == "#6FE5D7") && this.terrainTimer == 0)
        {
            // Start the terrain timer.
            this.terrainTimer++;
        }
        // If they're on rock and the timer has started...
        if(this.currentTerrain == "#515151" && this.terrainTimer >= 1)
        {
            // Increase the timer.
            this.terrainTimer++;

            // If in the next round the timer will be up...
            if(this.terrainTimer >= this.rockSetBack)
            {
                // Reset the terrain timer so that it can move next round.
                this.terrainTimer = 0;
            }
            else
                // Nothing happens while the fighter takes a penalty.
                return;
        }
        // If they're on water and the timer has started...
        else if(this.currentTerrain == "#6FE5D7" && this.terrainTimer >= 1)
        {
            // Increase the timer.
            this.terrainTimer++;

            // If in the next round the timer will be up...
            if(this.terrainTimer >= this.waterSetBack)
            {
                // Reset the terrain timer so that it can move next round.
                this.terrainTimer = 0;
            }
            else
                // Nothing happens while the fighter takes a penalty.
                return;
        }
        // Else they move ahead as normal!

        // If [let's say heads]...
        if(utils.flipWeightedCoin()){
            // The fighter will move either left or right (depends on another "coin toss").
            this.x += utils.flipWeightedCoin(this.horizontalWeight) ? -this.size : this.size;
            // Keeping the fighters in bounds.
            if(this.x >= this.cWidth - this.size)
                this.x = this.cWidth - this.size;
            else if(this.x <= 0)
                this.x = 0;
        }
        // Else [let's say tails]...
        else{
            // The fighter will move either up or down (depends on another "coin toss").
            this.y += utils.flipWeightedCoin(this.verticalWeight) ? -this.size : this.size;
            // Keeping the fighters in bounds.
            if(this.y >= this.cHeight - this.size) 
                this.y = this.cHeight - this.size;
            else if(this.y <= 0)
                this.y = 0;
        }
    }
    
    // The further from the center that this fighter gets, the more compelled it will be to move there.
    weights(goalX, goalY)
    {
        /* Horizontal Weight */
        // How much the horizontal weight will increment by depending on the distance.
        let horizontalInc = 0.5/(goalX*this.size);
        // If the fighter is to the right of the center...
        if(this.x < goalX){
            // Than the fighter will need to to move left...
            horizontalInc *= -1
        }
        // Else the fighter is going to be moving to the right because it's left of the center.

        // Changing the weight.
        this.horizontalWeight += (horizontalInc * Math.abs(this.x-goalX));
        if(this.horizontalWeight > 1)
            this.horizontalWeight = 1;
        if(this.horizontalWeight < 0)
            this.horizontalWeight = 0;

        /* Vertical Weight */
        // How much the vertical weight will increment by depending on the distance.
        let verticalInc = 0.5/(goalY*this.size);
        // If the fighter is above of the center...
        if(this.y < goalY){
            // Than the fighter will need to to move below...
            verticalInc *= -1
        }
        // Else the fighter is going to be moving to up because it's below the center.

        // Changing the weight.
        this.verticalWeight += (verticalInc * Math.abs(this.y-goalY));
        if(this.verticalWeight > 1)
            this.verticalWeight = 1;
        if(this.verticalWeight < 0)
            this.verticalWeight = 0;
    }

    // Moves this fighter to the center for the final duel.
    moveInward()
    {
        if(this.x < this.centerX)
            this.x += this.size;
        else if(this.x > this.centerX)
            this.x -= this.size;
        if(this.y < this.centerY)
            this.y += this.size;
        else if(this.y > this.centerY)
            this.y -= this.size;
    }
}

export {Fighter}