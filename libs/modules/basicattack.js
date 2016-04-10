var BasicAttack = function(stats) {
    return {
        finishAttack: function() {
            var attack = {
                dmg: stats.dmg,
            };
            this.currentTarget.takeAttack(attack, this);
        },
    };
};
