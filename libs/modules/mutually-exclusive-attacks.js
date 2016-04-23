var MutuallyExclusiveAttacks = function(attacks, comp) {
    var activeAttack = null;
    //default comparison is to simply return a.
    if(!comp)
        comp = function(a, b) {
            return a;
        };
    return {
        canPrepareAttack: function(theAttack) {
            if(activeAttack && activeAttack.inRange.length == 0) {
                activeAttack = null;
                //TODO: I don't want to have this code...I should check if it ever happens, then remove it if it doesn't.
                if(theAttack.inRange.length == 0)
                    return false;
            }

            if(!activeAttack) { //there was no activeAttack yet, then set this and continue.
                activeAttack = theAttack;
                LiveDebugger.set('activeattack', '~ Active Attack: ' + activeAttack.attrs.baseDamage);
            }

            if(activeAttack == theAttack) //if this is the active attack already, then continue.
                return true;

            if(activeAttack.attacking) //if we are animating an attack, then we must follow-through and we can't do this attack.
                return false;

            var theAttackIsBetter = comp(theAttack, activeAttack);

            if(theAttackIsBetter) { //if this attack is better than the other attack
                LiveDebugger.set('activeattack', '* Active Attack: ' + activeAttack.attrs.baseDamage);
                activeAttack.cancelAttack();
                activeAttack = theAttack;
            }

            LiveDebugger.set('activeattack', 'Active Attack: ' + activeAttack.attrs.baseDamage);
            
            return theAttackIsBetter;
        },
    };
};
