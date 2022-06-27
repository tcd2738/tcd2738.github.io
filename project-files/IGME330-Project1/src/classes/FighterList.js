import * as utils from "../utils.js";
import * as Fighter from "./Fighter.js";
import { Vector } from "./Vector.js";

class FighterList extends Array{

    drawFighters(ctx) {
        this.combatWeights();
        let alive = new Array();
        for(let i = 0; i < this.length; i++)
        {
            if(this[i].isDead == false)
                alive.push(i);
            else
                utils.bloodSplots(ctx, this[i].x, this[i].y);
        }
        for(let j = 0; j < alive.length; j++)
        {
            let aliveF = this[alive[j]];
            aliveF.draw(ctx);
        }
    }

    collisionFighters()
    {
        // If there is one fighter, don't run!
        if(this.length > 1)
        {
            // Checking each fighter against each other to see if they're colliding.
            for(let i = 0; i < this.length; i++)
            {
                for(let j = i+1; j < this.length; j++)
                {
                    let fighter1 = this[i];
                    let fighter2 = this[j];
                    
                    // make sure both fighters are alive before checking for collisions
                    if (fighter1.isDead == false && fighter2.isDead == false) {
                        // If the fighters are colliding...
                        if (fighter1.x < fighter2.x + (fighter2.size+fighter2.size/2) &&
                        fighter1.x + (fighter1.size*1.5) > fighter2.x &&
                        fighter1.y < fighter2.y + (fighter2.size+fighter2.size/2) &&
                        fighter1.y + (fighter1.size*1.5) > fighter2.y) {
                        // "Combat" begins!
                            if(utils.flipWeightedCoin())
                                this.combatTime(fighter1, i, fighter2, j);
                            else
                                this.combatTime(fighter2, j, fighter1, i);
                        }
                    }
                }
            }
        }
    }
    
    combatTime(first, arrayPos1, second, arrayPos2)
    {
        let fighterUpdates = document.querySelector("#fighterUpdateList");

        // The first one attacks!
        fighterUpdates.innerHTML += utils.fighterUpdates("attack", first.name, second.name);
        second.health = second.health - first.attack;
        // If the fighter is dead...
        if(second.health <= 0)
        {
            second.isDead = true;
            first.kills ++;
            // Write a message saying so.
            fighterUpdates.innerHTML += utils.fighterUpdates("death", first.name, second.name);
        }
        else
        {
            // Else the second fighter retaliates!
            fighterUpdates.innerHTML += utils.fighterUpdates("defend", first.name, second.name);
            first.health = first.health - second.attack;
            // If the fighter is dead...
            if(first.health <= 0)
            {
                first.isDead = true;
                second.kills ++;
                // Write a message saying so.
                fighterUpdates.innerHTML += utils.fighterUpdates("death", second.name, first.name);
            }
        }

        // update fighter table to reflect death
        utils.generateFighterTable(this, document.querySelector('#fighterTable'));
    }

    combatWeights()
    {
        let range = this.deadBalance();

        // If there is one fighter, don't run!
        if(this.length <= 1)
            return;
        // If there is more than one fighter and range is greater than 0...
        if(this.length > 1 && range > 0)
        {
            // Checking If there are fighters close to each other that should be weighted towards one another.
            for(let i = 0; i < this.length; i++)
            {
                for(let j = i+1; j < this.length; j++)
                {
                    let fighter1 = this[i];
                    let fighter2 = this[j];

                    // make sure both fighters are alive before weighting
                    if (fighter1.isDead == false && fighter2.isDead == false) {

                        // The distance between the two.
                        let distance = Math.sqrt(Math.pow(fighter2.x-fighter1.x, 2) + Math.pow(fighter2.y-fighter1.y, 2));

                        if(distance <= fighter1.size * range)
                        {   
                            fighter1.weights(fighter2.x, fighter2.y);
                            fighter2.weights(fighter1.x, fighter1.y);
                        }
                    }
                }
            }
        }
    }

    // Balances everything based on the number of dead/living fighters.
    deadBalance()
    {
        // Finding out how many are alive and what their positions in the array are.
        let alivePos = utils.livingMembers(this);
        let len = alivePos.length;

        // If more than 3 are alive then don't change anything and set the range to 5...
        if(len > 3)
            return 5;
        // Else if there are 3 fighters alive, set the range to 50...
        else if (len == 3)
            return 50;
        // Else if their are 2 fighters alive, set their range to 100 and have them only steering towards each other...
        else if(len == 2) {
            this[alivePos[0]].finalTwo = true;
            this[alivePos[1]].finalTwo = true;
            return 100;
        }
        // Else there aren't enough fighters and collision shouldn't be run any more.
        else
            return 0;
    }

    // Checking the terrain that each fighter is on.
    terrainCheck(map)
    {
        let coreFighter;
        let coreX, coreY;
        for(let i = 0; i < this.length; i++)
        {
            coreX = this[i].x + (this[i].size/2);
            coreY = this[i].y + (this[i].size/2);
            coreFighter = new Vector(coreX, coreY);
            map.findSpace(coreFighter);
            this[i].currentTerrain = map.spaceSelectedTerrain;
        }
    }
}

export {FighterList};