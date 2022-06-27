import * as utils from "./utils.js";

/* Holds all of the randomized messages for convenience sake */

// Returns a random death message.
function deathMessage(nameKiller, nameDead)
{
    switch(utils.getRandomInt(1, 6))
    {
        case 1:
            return "<li style='font-weight:bolder;'>" + nameKiller + " has slain " + nameDead + "!</li>";
            break;
        case 2:
            return "<li style='font-weight:bolder;'>" + nameKiller + " put down " + nameDead + "!</li>";
            break;
        case 3:
            return "<li style='font-weight:bolder;'>" + nameDead + " has been taken out by " + nameKiller + "!</li>";
            break;
        case 4:
            return "<li style='font-weight:bolder;'>" + nameKiller + " has " + nameDead + "'s blood on their hands now...</li>";
            break;
        case 5:
            return "<li style='font-weight:bolder;'>" + nameKiller + " took out " + nameDead + "!</li>";
            break;
        case 6:
            return "<li style='font-weight:bolder;'>" + nameKiller + " gacked " + nameDead + "!</li>";
            break;
    }
}

function attackMessage(attacker, defender)
{
    switch(utils.getRandomInt(1, 6))
    {
        case 1:
            return "<li>" + attacker + " attacks " + defender + "!</li>";
            break;
        case 2:
            return "<li>" + attacker + " moves in to take out " + defender + "!</li>";
            break;
        case 3:
            return "<li>" + attacker + " strikes " + defender + " while they weren't looking!</li>";
            break;
        case 4:
            return "<li>" + attacker + " goes for a surprise attack on " + defender + "!</li>";
            break;
        case 5:
            return "<li>" + attacker + " aims at " + defender + " and takes a shot!</li>";
            break;
        case 6:
            return "<li>" + attacker + " charges " + defender + "!</li>";
            break;
    }
}

function defendMessage(attacker, defender)
{
    switch(utils.getRandomInt(1, 5))
    {
        case 1:
            return "<li>" + defender + " retaliates against " + attacker + "!</li>";
            break;
        case 2:
            return "<li>" + defender + " swings back at " + attacker + "!</li>";
            break;
        case 3:
            return "<li>" + defender + " gracefully retortes with an attack on " + attacker + "!</li>";
            break;
        case 4:
            return "<li>" + defender + " shrugs off " + attacker + "'s attack and comes at them with full force!</li>";
            break;
        case 5:
            return "<li>" + defender + " counters " + attacker + "'s hit!</li>";
            break;
    }
}

function eventMessage(nameFighter)
{
    switch(utils.getRandomInt(1, 15))
    {
        case 1:
            return "<li>" + nameFighter + " has decided to take a break and go fishing.</li>";
            break;
        case 2:
            return "<li>" + nameFighter + " is putting on a puppet show for an audience of none.</li>";
            break;
        case 3:
            return "<li>" + nameFighter + " is having an existential conversation with a nearby frog.</li>";
            break;
        case 4:
            return "<li>" + nameFighter + " is wondering what they'll have for dinner...</li>";
            break;
        case 5:
            return "<li>" + nameFighter + " is practicing their cool fighting moves.</li>";
            break;
        case 6:
            return "<li>" + nameFighter + " is looking for the nearest bathroom.</li>";
            break;
        case 7:
            return "<li>" + nameFighter + " is doing nothing in particular.</li>";
            break;
        case 8:
            return "<li>" + nameFighter + " says \"fuzzy-pickles!\" and makes a peace sign.</li>";
            break;
        case 9:
            return "<li>" + nameFighter + " is loafing around.</li>";
            break;
        case 10:
            return "<li>" + nameFighter + " would rather be somewhere else...</li>";
            break;
        case 11:
            return "<li>" + nameFighter + " is craving a hot dog right now.</li>";
            break;
        case 12:
            return "<li>" + nameFighter + " literally can't even...</li>";
            break;
        case 13:
            return "<li>" + nameFighter + " wouldn't hurt a fly, but would hurt a person.</li>";
            break;
        case 14:
            return "<li>" + nameFighter + " is pretty sure they left their oven on...</li>";
            break;
        case 15:
            return "<li>" + nameFighter + " is a neural-net processor; a learning computer.</li>";
            break;
    }
}

export {deathMessage, attackMessage, defendMessage, eventMessage}