//TODO: clone props and attrs
var Attack = function(owner, props, attrs) {
    this.owner = owner;
    this.props = props;
    this.attrs = attrs;

    this.currentTarget = null;

    this.engaged = [];
    this.engagedEvents = {};

    this.attackActive = false;
    this.attacking = false;
    this.attackCooldown = 0;

    this.inRange = [];

    return this;
};

Attack.prototype.update = function(dt, activeAttackName) {
    if(this.inRange.length <= 0 || (activeAttackName && activeAttackName != this.name))
        return;

    this.updateTarget();
    if(!this.attacking && this.attackCooldown <= 0) {   //we just started preparing for our attack then.
        this.prepareAttack();
    }

    if(!this.attacking && (this.attackCooldown -= dt) <= 0) {
        this.startAttack();
        this.owner.modules.forEach(function(module) {
            if(module.startAttack)
                module.startAttack.call(this, this.currentTarget);
        }, this);
        return this.name;   //starting attack, set activeAttackName
    }
};

Attack.prototype.updateTarget = function() {
    if(!this.currentTarget && this.inRange.length)
        this.currentTarget = this.inRange[0];

    this.inRange.forEach(function(enemy) {
        this.currentTarget = this.owner.considerTarget(this.currentTarget, enemy, this);
    });
};

Attack.prototype.engage = function(theAttack, enemy) {
    this.engagedEvents[enemy.id] = {
        enter: this.onFenceEnter(enemy, theAttack.stats.range, function(enemy, distance) {
            theAttack.inRange.push(enemy);
        }),
        exit: this.onFenceExit(enemy, theAttack.stats.range, function(enemy, distance) {
            theAttack.inRange.splice(theAttack.inRange.indexOf(enemy), 1);
        }),
    };
    this.modules.forEach(function(module) {
        if(module.engage)
            module.engage.call(this, enemy);
    }, this);
};

Attack.prototype.disengage = function(theAttack, enemy) {
    theAttack.currentTarget = null;
    this.fenceEvents.splice(this.fenceEvents.indexOf(theAttack.engagedEvents[enemy.id].enter), 1);
    this.fenceEvents.splice(this.fenceEvents.indexOf(theAttack.engagedEvents[enemy.id].exit), 1);
    this.modules.forEach(function(module) {
        if(module.engage)
            module.disengage.call(this, enemy);
    }, this.owner);
};

Attack.prototype.prepareAttack: function(theAttack) {
    theAttack.attackActive = true;
    theAttack.attackCooldown = theAttack.stats.attackCooldown;
};

Attack.prototype.startAttack: function(theAttack) {
    theAttack.attacking = true;
    this.attackAnimationCooldown = theAttack.stats.attackAnimationCooldown;
};

Attack.prototype.finishAttack: function(theAttack, victim) {
    theAttack.attackActive = false;
    theAttack.attacking = false;

    theAttack.attackCooldown = theAttack.stats.attackCooldown;
};
