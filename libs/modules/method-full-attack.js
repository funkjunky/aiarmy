var MethodFullAttack = function() {
    var startAttackWhenReady = false;
    var attackInstance = null;

    return {
        fullAttack: function(attack, target) {
            startAttackWhenReady = true;

            //we were attacking a different monster, then cancel that attack.
            //TODO: perhaps this should be a party of choosing to attack a monster? Should be handled by the character?
            //console.log('target, character.target: ', attack.activeAttack, target, character.target);
            if(attack.activeAttack && target != this.target)
                this.cancelAttack(attack.activeAttack);

            this.target = target;

            //if prepare returns false, we probably were already attacking.
            //TODO: these few lines are wordy...
            var instance = this.prepareAttack(attack, target);
            if(instance)
                attackInstance = instance;
            else
                return false;

            var self = this;
            Event.subscribeOnce('attackPreparedAndInRange', attackInstance, function(data) {
                //console.log('full attack: prepared called! CALLING START ATTACK');
                self.startAttack(attackInstance, target);
            });
        },
        cancelFullAttack: function() {
            startAttackWhenReady = false;
            if(attackInstance)
                this.cancelAttack(attackInstance);
        },
    };
};
