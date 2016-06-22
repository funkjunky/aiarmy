var MethodSeek = function()
{
    var secondsTillNextCheck = 0;
    var secondsBetweenChecks = 0.5;

    var target;
    var self;

    //update cycle to update seek if target moves.
    this.update = function(dt) {
        if(oldTargetPos && (secondsTillNextCheck += dt) >= secondsBetweenChecks) {
            if(!MathHelper.eq(oldTargetPos, target)) {
                self.doNewSeek(target);
                secondsTillNextCheck = 0;
            }
        }
    };
    cc.director.getScheduler().scheduleUpdateForTarget(this, 99999999);

    var pathingActionSequence = null;
    var oldTargetPos = null;
    var cb = null;
    var range = null;
    return {
        seek: function(newTarget, seekRange, seekcb) {
            self = this; //TODO: not sure about this...
            if(oldTargetPos)
                this.cancelSeek();

            if(seekRange)
                range = seekRange;
            if(seekcb)
                cb = seekcb;

            this.doNewSeek(newTarget);
        },
        cancelSeek: function() {
            oldTargetPos = null;
            this.stopAction(pathingActionSequence);
            pathingActionSequence = null;
        },
        doNewSeek: function(newTarget) {
            target = newTarget;
            this.stopAction(pathingActionSequence);
            pathingActionSequence = _globals.gameMap.move(this, target, this.speed, range, cb);  //TODO: the speed should be put somewhere for the character in general.
            oldTargetPos = {
                x: target.x,
                y: target.y,
            };
        },
    };
}
