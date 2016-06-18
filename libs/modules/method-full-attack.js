var MethodFullAttack = function(character) {
    var startAttackWhenReady = false;
    var attackInstance = null;
    //Note: should i attach fullAttack to attack or character? sorta crappy either way
    character.fullAttack = function(attack, target) {
        startAttackWhenReady = true;

        //we were attacking a different monster, then cancel that attack.
        //TODO: perhaps this should be a party of choosing to attack a monster? Should be handled by the character?
        //console.log('target, character.target: ', attack.activeAttack, target, character.target);
        if(attack.activeAttack && target != character.target)
            character.cancelAttack(attack.activeAttack);

        character.target = target;

        //if prepare returns false, we probably were already attacking.
        //TODO: these few lines are wordy...
        var instance = character.prepareAttack(attack, target);
        if(instance)
            attackInstance = instance;
        else
            return false;

        Event.subscribeOnce('attackPreparedAndInRange', attackInstance, function(data) {
            //console.log('full attack: prepared called! CALLING START ATTACK');
            character.startAttack(attackInstance, target);
        });
    };

    character.cancelFullAttack = function() {
        startAttackWhenReady = false;
        if(attackInstance)
            character.cancelAttack(attackInstance);
    };

    return {};
};
