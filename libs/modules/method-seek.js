var MethodSeek = function(character)
{
    var secondsTillNextCheck = 0;
    var secondsBetweenChecks = 2;

    var target = null;
    var pathingActionSequence = null;
    var oldTargetPos = {x: -999, y: -999};
    var cb = null;
    var range = null;
    character.seek = function(seekTarget, seekRange, seekcb) {
        if(target)
            cancelSeek();

        if(seekRange)
            range = seekRange;
        if(seekcb)
            cb = seekcb;

        target = seekTarget;
        doNewSeek();
    };

    function cancelSeek() {
        character.stopAction(pathingActionSequence);
        target = null;
        pathingActionSequence = null;
    }
    function doNewSeek() {
        character.stopAction(pathingActionSequence);
        pathingActionSequence = _globals.gameMap.move(character, target, character.speed, range, cb);  //TODO: the speed should be put somewhere for the character in general.
        oldTargetPos = {
            x: target.x,
            y: target.y,
        };
    }

    return {
        update: function(dt) {
            if(target && (secondsTillNextCheck += dt) >= secondsBetweenChecks)
                if(!MathHelper.eq(oldTargetPos, target))
                    doNewSeek();
        },
    };
}
