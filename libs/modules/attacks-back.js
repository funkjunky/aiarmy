var AttacksBack = function() {
    return {
        takeAttack: function(attack, attacker) {
            this.engage(attacker);
        },
    };
};
