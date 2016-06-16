//TODO: relentless-attack seems to do the same thing.
var MethodKeepAttacking = function(characterAttack) {
    var currentTarget;
    characterAttack.keepAttacking = function(target) {
        currentTarget = target;
        var attackInstance = target.fullAttack(target);

        Event.subscribe('attackFinished', attackInstance, function(data) {
            if(data.victim == currentTarget && currentTarget._parent)
                characterAttack.fullAttack(data.victim);
        });
    };
    characterAttack.cancelKeepAttacking = function() {
        currentTarget = null;
    };

    return {};
};
