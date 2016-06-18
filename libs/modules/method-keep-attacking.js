//TODO: relentless-attack seems to do the same thing.
var MethodKeepAttacking = function(character, characterAttack) {
    var currentTarget;
    character.keepAttacking = function(target) {
        currentTarget = target;
        var attackInstance = target.fullAttack(character, target);

        Event.subscribe('attackFinished', attackInstance, function(data) {
            if(data.victim == currentTarget && currentTarget._parent)
                characterAttack.fullAttack(character, data.victim);
        });
    };
    character.cancelKeepAttacking = function() {
        currentTarget = null;
    };

    return {};
};
