var DoubleAttack = function(chance) {
    return {
        finishAttack: function(victim) {
            if(Math.random() < chance)      //if chance has it...
                this.attackCooldown = 0;    //then start another attack!
        },
    };
};
