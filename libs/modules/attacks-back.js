var AttacksBack = function() {
    return {
        takeAttack: function(attack, attacker) {
            this.attacks.forEach(function(attack) {
                if(!attack.engagedEvents[attacker.id]) {
                    attack.engage(this, attacker);
                }
            }, this);
        },
    };
};
