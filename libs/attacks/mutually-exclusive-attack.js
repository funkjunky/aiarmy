function MutuallyExclusiveAttack(attacks) {
    this.activeAttack = null;
    this.attacks = attacks;

    return this;
};

MutuallyExclusiveAttack.prototype.update = function(dt) {
    this.attacks.forEach(function(attack) {
        var activeAttack = null;
        if(activeAttack = attack.update(dt, this.activeAttack)) {
            if(activeAttack === true)
                this.activeAttack = null;
            else
                this.activeAttack = activeAttack;
        }
    }, this);
};

MutuallyExclusiveAttack.prototype.engage = function(enemy) {
    this.attacks.forEach(function(attack) {
        attack.engage(enemy);
    }, this);
};

MutuallyExclusiveAttack.prototype.disengage = function(enemy) {
    this.activeAttack = null;
    this.attacks.forEach(function(attack) {
        attack.disengage(enemy);
    }, this);
};

MutuallyExclusiveAttack.prototype.updateTarget =  function() {
    this.attacks.forEach(function(attack) {
        attack.updateTarget();
    }, this);
};
