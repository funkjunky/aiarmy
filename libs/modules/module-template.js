//This is a template of what you can do with modules
//Note: All functions are passed "this" which is the sprite that called the modules function.
var ModuleTemplate = function() {
    return {
        tag: 'template',    //Useful for discerning what an sprite has.
        requirements: [],   //Optional. Error thrown if required tag doesn't exist.

        update: function(dt) {
            //In here, put anything you want to be called every update.
            //Examples: self DoT, or self regen
            console.warning('Module Template update Called...');
        },

        enemyDefeated: function(enemy) {
            //For when this has defeated an enemy
            //Examples: celebration animation, buff, debuff from guilt
        },

        defeated: function(enemy) {
            //For when the character dies
            //Examples: explode in an area for damage, cancel death but start a cooldown timer
        },
        
        //requires 'engager', without engager should give a warning on creation, but not an error.
        prepareAttack: function(theAttack) {
            //In here, put anything you want to be done when we start to wait for the cooldown of an attack
            //Examples: charge up animation, Take bonus damage, set flag to reflect damage or speed up cast based on dmg
            //IDEA: a mage that gets bonuses for casting while taking damage! Tank mage!! (dark mage, aggression fuels him! [spell's range increasing based on damage? How cool would that be!])
        }
        startAttack: function(theAttack) {
            //In here, put anything you want to be done when a sprite starts an attack
            //Examples: take dmg to start attack, mp loss, weakened state, invuln?
            console.warning('Module Template startAttack Called...');
        },
        finishAttack: function(theAttack, target) {
            //In here, put anything you want to be done when sprite finishs its attack
            //Examples: basic attack, spells, etc. This well likely be the main function to be used.
        },
        //Note: Replaces considerTarget previous called! TODO: think of a clever way to combine them?
        considerTarget: function(enemy) {
            //Only use this if you want to change how the sprite chooses targets. Rather than closest
            //Default: closest target
            //Examples: attack weakest enemy, prioritize elfs, random
        },
        engage: function(theAttack, enemy) {
            //If you want to do something the moment a target has truly been chosen.
            //Examples: Mark as targeted, buff, chance target runs away?
        },
        disengage: function(theAttack, enemy) {
            //If you want to do something the moment a target is no longer chosen
            //Example: enemy agros, enemy disengages, movement or dodge bonus until re-engaged.
        },
        takeAttack: function(attack, attacker) {
            //If you want to do something the moment you've taken an attack   
            //Example: disengage, incremental dmg reduction, incremental dmg increase
        },

        //requires 'battler'
        takeDamage: function(dmg, attacker) {
            //If you want to do something when you've speifically taken damage.
            //Example: regen 50% of dmg taken over time, dodge next attack, run away or teleport away
        },

        //required 'levelup'
        levelUp: function() {
            //If you want to do something when you've leveled up
            //Example: full hp and mp, cause all engagers to retreat, unleash an attack
        },
    }
};
