import * as utils from "../utils.js";
import { Vector } from "./Vector.js";

// Represents a space on the grid.
class Space
{
    constructor(screenX, screenY, size=10)
    {
        // The x-position on the canvas of this grid-space.
        this.x = screenX;
        // The y-position on the canvas of this grid-space.
        this.y = screenY;
        // A wall (saving this for later; currently does nothing).
        this.size = size;
        // The terrain of the space; green by default.
        this.terrain = "#3CC335";
    }

    draw(ctx)
    {
        ctx.save();
        ctx.fillStyle = this.terrain;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

// Represents the grid on the map.
class Grid
{
    constructor(spaceSize, spacesHor, spacesVert)
    {
        // The size of each space on the grid.
        this.size = spaceSize;
        this.numSpaceX = spacesHor;
        this.numSpaceY = spacesVert;

        this.grid = this.buildArray();
    }

    // Builds the grid itself.
    buildArray()
    {
        let array = new Array();

        // Pushing a new array into the array multiple times to make the 2D array (since that can't be done easily here).
        for(let i = 0; i < this.numSpaceX; i++)
        {
            array.push(new Array(this.numSpaceY));
        }

        // Creating the spaces at each position in the array.
        for(let x = 0; x < this.numSpaceX; x++)
        {
            for(let y = 0; y < this.numSpaceY; y++)
            {
                array[x][y] = new Space(x*this.size, y*this.size);
            }
        }

        return array;
    }
}

class Map
{
    constructor(spaceSize, spacesHor, spacesVert)
    {
        this.grid = new Grid(spaceSize, spacesHor, spacesVert);
        this.terrain = "";

        // Used just for finding a space.
        let minBounds, maxBounds;
        // Use this for drawing terrain.
        let spaceSelectedPos;
        let spaceSelectedTerrain;
    }
    
    // Changes the terrain of the space at the position clicked on the screen.
    drawNewTerrain(screenPosition, terrain, ctx)
    {
        this.findSpace(screenPosition);
        let size = document.getElementById("tSize").value;
        if(size == 1)
        {
            this.grid.grid[this.spaceSelectedPos.x][this.spaceSelectedPos.y].terrain = terrain;
            this.grid.grid[this.spaceSelectedPos.x][this.spaceSelectedPos.y].draw(ctx);
        }
        if(size == 2)
        {
            for(let i = -1; i < 2; i++)
            {
                for(let j = -1; j < 2; j++)
                {
                    this.grid.grid[this.spaceSelectedPos.x + i][this.spaceSelectedPos.y + j].terrain = terrain;
                    this.grid.grid[this.spaceSelectedPos.x + i][this.spaceSelectedPos.y + j].draw(ctx);
                }
            }
        }
        if(size == 3)
        {
            for(let i = -2; i < 3; i++)
            {
                for(let j = -2; j < 3; j++)
                {
                    this.grid.grid[this.spaceSelectedPos.x + i][this.spaceSelectedPos.y + j].terrain = terrain;
                    this.grid.grid[this.spaceSelectedPos.x + i][this.spaceSelectedPos.y + j].draw(ctx);
                }
            }
        }
    }
    
    // Finds the space in the grid that this position is in.
    // Returns that position.
    findSpace(screenPosition)
    {
        for(let x = 0; x < this.grid.grid.length; x++)
        {
            for(let y = 0; y < this.grid.grid[x].length; y++)
            {
                let space = this.grid.grid[x][y];

                // Checking if the position is in the space.
                let xS = space.x;
                let yS = space.y;
                let size = space.size;
                let posX = screenPosition.x;
                let posY = screenPosition.y;
                if(posX > xS)
                {
                    if(posX <= xS + size)
                    {
                        if(posY > yS)
                        {
                            if(posY <= yS + size)
                            {
                                // If so, return the position of this space!
                                let position = new Vector(x, y);
                                this.spaceSelectedPos = position;
                                this.spaceSelectedTerrain = this.grid.grid[this.spaceSelectedPos.x][this.spaceSelectedPos.y].terrain;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    // Recursively checks where the position given is to find the quadrant it's in (that way we're not checking every single space).
    // Returns the min and max bounds in the grid of where the position is.
    recursiveAreaCheck(position, minBoundsSpaces, maxBoundsSpaces, layersDown)
    {
        // Halfway points.
        let xHalf = maxBoundsSpaces.x / 2;
        let yHalf = maxBoundsSpaces.y / 2;

        // The new bounds
        let newMinBounds;
        let newMaxBounds;

        // Ends the recursion.
        if(layersDown > 3)
        {
            this.minBounds = minBoundsSpaces;
            this.maxBounds = maxBoundsSpaces;
            return;
        }

        // Right
        if(position.x > xHalf * this.spaceSize)
        {
            // Bottom
            if(position.y > yHalf * this.spaceSize)
            {
                newMinBounds = new Vector(xHalf, yHalf);
                newMaxBounts = maxBoundsSpaces;
                this.recursiveAreaCheck(position, newMinBounds, newMaxBounds, (layersDown+1));
            }
            // Top
            else
            {
                let minY = minBoundsSpaces.y;
                let maxX = maxBoundsSpaces.x;
                newMinBounds = new Vector(xHalf, minY);
                newMaxBounds = new Vector(maxX, yHalf);
                this.recursiveAreaCheck(position, newMinBounds, newMaxBounds, (layersDown+1));
            }
        }
        // Left
        else
        {
            // Bottom
            if(position.y > yHalf * this.spaceSize)
            {
                let minX = minBoundsSpaces.x;
                let maxY = maxBoundsSpaces.y;
                newMinBounds = new Vector(minX, yHalf);
                newMaxBounds = new Vector(xHalf, maxY);
                this.recursiveAreaCheck(position, newMinBounds, newMaxBounds, (layersDown+1));
            }
            // Top
            else
            {
                newMinBounds = minBoundsSpaces;
                newMaxBounds = new Vector(xHalf, yHalf);
                this.recursiveAreaCheck(position, newMinBounds, newMaxBounds, (layersDown+1));
            }
        }
    }

    drawMap(ctx)
    {   
        for(let x = 0; x < this.grid.grid.length; x++)
        {
            for(let y = 0; y < this.grid.grid[x].length; y++)
            {
                this.grid.grid[x][y].draw(ctx);
            }
        }
    }
}

export {Map}