var SeekToEngage = function() {
    return {
        engage: function(theAttack, enemy) {
            this.seek(enemy);
        },
        prepareAttack: function(theAttack) {
            if(this.goingToAction && !this.goingToAction.isDone()) {
                this.stopAction(this.goingToAction);
                this.goingToAction = null;
                this.goingTo = null;
            }
        },
    };
};
