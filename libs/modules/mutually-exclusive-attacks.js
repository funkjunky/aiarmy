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
            }
            else if(theAttack.inRange.length && (!activeAttack || !activeAttack.attacking)) { //as long as we aren't in the middle of an attack
                if(activeAttack) {
                    activeAttack.attackActive = false;  //deactive the crappier attack, so the cooldown stops
                    activeAttack.attackCooldown = activeAttack.props.attackCooldown;    //reset cooldown
                }

                LiveDebugger.set('activeattack', 'ACTIVE: ' + theAttack.attrs.baseDamage);
                activeAttack = theAttack;
            }
        },
    };
};
