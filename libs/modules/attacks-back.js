var AttacksBack = function() {
    return {
        takeAttack: function(attack, attacker) {
            console.log('attacking back: ', this.attacks);
            this.attacks.forEach(function(attack) {
                if(!attack.engagedEvents[attacker.id])
                    attack.engage(this, attacker);
            }, this);
        },
    };
};
