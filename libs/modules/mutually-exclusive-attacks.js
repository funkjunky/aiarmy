//TODO: add a second option for the selection process. Ie. highest damage attack.
//TODO: currently we just choose the first attack active.
var MutuallyExclusiveAttacks = function(attacks, comp) {
    var activeAttack = null;
    //default comparison is to simply return a.
    if(!comp)
        comp = function(a, b) {
            return a;
        };
    return {
        prepareAttack: function(theAttack) {
            if(activeAttack && comp(activeAttack, theAttack)) //if another activeAttack and not stronger, then turn off
                theAttack.attacking = false;
            else
                activeAttack = theAttack;
        },
    };
};
