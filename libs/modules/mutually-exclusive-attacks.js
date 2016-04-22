var MutuallyExclusiveAttacks = function(attacks, comp) {
    var activeAttack = null;
    //default comparison is to simply return a.
    if(!comp)
        comp = function(a, b) {
            return a;
        };
    return {
        prepareAttack: function(theAttack) {
            if(activeAttack == theAttack)
                return;

            if(activeAttack && comp(activeAttack, theAttack)) //if another activeAttack and not stronger, then turn off
            {
                theAttack.attacking = false;
                theAttack.attackActive = false;
                theAttack.idle = true;
            }
            else if(theAttack.inRange.length && (!activeAttack || !activeAttack.attacking)) { //as long as we aren't in the middle of an attack
                if(activeAttack) {
                    activeAttack.attackActive = false;  //deactive the crappier attack, so the cooldown stops
                    activeAttack.idle = true;
                }

                LiveDebugger.set('activeattack', 'ACTIVE: ' + theAttack.attrs.baseDamage);
                activeAttack = theAttack;
            }
        },
        finishAttack: function(theAttack) {
            //TODO: this is specifically for double attack... this kind of coupling is bad...
            if(!activeAttack.attacking) {
                activeAttack = null;
                LiveDebugger.set('activeattack', 'ACTIVE: null');
            }
        },
    };
};
