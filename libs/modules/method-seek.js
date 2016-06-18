var MethodSeek = function()
{
    var secondsTillNextCheck = 0;
    var secondsBetweenChecks = 2;

    //update cycle to update seek if target moves.
    this.update = function(dt) {
        if(oldTargetPos && (secondsTillNextCheck += dt) >= secondsBetweenChecks)
            if(!MathHelper.eq(oldTargetPos, target))
                this.doNewSeek(target);
    };
    cc.director.getScheduler().scheduleUpdateForTarget(this, 99999999);


    var pathingActionSequence = null;
    var oldTargetPos = null;
    var cb = null;
    var range = null;
    return {
        seek: function(target, seekRange, seekcb) {
            if(oldTargetPos)
                this.cancelSeek();

            if(seekRange)
                range = seekRange;
            if(seekcb)
                cb = seekcb;

            this.doNewSeek(target);
        },
        cancelSeek: function() {
            oldTargetPos = null;
            this.stopAction(pathingActionSequence);
            pathingActionSequence = null;
        },
        doNewSeek: function(target) {
            this.stopAction(pathingActionSequence);
            pathingActionSequence = _globals.gameMap.move(this, target, this.speed, range, cb);  //TODO: the speed should be put somewhere for the character in general.
            oldTargetPos = {
                x: target.x,
                y: target.y,
            };
        },
    };
}
