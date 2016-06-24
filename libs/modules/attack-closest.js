var count = 0;
var AttackClosest = function(character) {
    return (function() {
        this.anid = ++count;
        this.update = function() {
            var closestTarget = _globals.game.closestTaggedInteractive(character, 'monster');
            var attackInstance = character.attacks[0].activeAttack;
            if(!attackInstance || attackInstance.done() || attackInstance.target != closestTarget) {
                if(attackInstance)
                    character.cancelAttack(attackInstance);
                character.fullAttack(character.attacks[0], closestTarget);
            }
        };
        cc.director.getScheduler().scheduleCallbackForTarget({__instanceId: -character.__instanceId}, this.update, 1, cc.REPEAT_FOREVER, false);

        //TODO: SUPER hacky... and if I want to add more schedulecallbacks and cancel them, I'll have to think of a different unique identifier.
        return {__instanceId: -character.__instanceId};
    }.bind({}))();
};
