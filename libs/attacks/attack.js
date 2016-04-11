//TODO: clone props and attrs
var Attack = function(owner, props, attrs) {
    this.owner = owner;
    this.props = props;
    this.attrs = attrs;

    this.currentTarget = null;

    this.engaged = [];
    this.engagedEvents = {};

    this.attackActive = false;
    this.attackCooldown = 0;
    this.attackAnimationCooldown = this.props.attackAnimationCooldown;

    this.inRange = [];

    return this;
};

Attack.prototype.update = function(dt, activeAttackName) {
    if(this.inRange.length <= 0 || (activeAttackName && activeAttackName != this.name))
        return;

    this.updateTarget();

    if((this.attackActive && (this.attackAnimationCooldown -= dt) <= 0) {
        //TODO: make a function to handle calling another function, but also for modules.
        this.finishAttack(this.currentTarget);
        this.owner.modules.forEach(function(module) {
            if(module.finishAttack)
                module.finishAttack.call(this, this.currentTarget);
        }, this);
        return true; //Done attack, release activeAttackName for mutuallyExclusiveAttack
        //TODO: i shouldn't have mutually exclusive code in here?? hmmm
    }
    else if((this.attackCooldown -= dt) <= 0) {
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

Attack.prototype.engage = function(enemy) {
    this.owner.engagedEvents[enemy.id] = {
        enter: this.owner.onFenceEnter(enemy, this.stats.range, function(enemy, distance) {
            this.inRange.push(enemy);
        }),
        exit: this.owner.onFenceExit(enemy, this.stats.range, function(enemy, distance) {
            this.inRange.splice(this.inRange.indexOf(enemy), 1);
        }),
    };
    this.owner.modules.forEach(function(module) {
        if(module.engage)
            module.engage.call(this, enemy);
    }, this.owner);
};

Attack.prototype.disengage = function(enemy) {
    this.currentTarget = null;
    this.owner.fenceEvents.splice(this.owner.fenceEvents.indexOf(this.engagedEvents[enemy.id].enter), 1);
    this.owner.fenceEvents.splice(this.owner.fenceEvents.indexOf(this.engagedEvents[enemy.id].exit), 1);
    this.owner.modules.forEach(function(module) {
        if(module.engage)
            module.disengage.call(this, enemy);
    }, this.owner);
};

Attack.prototype.startAttack: function() {
    this.attackActive = true;
};

Attack.prototype.finishAttack: function(victim) {
    this.attackActive = false;

    this.attackCooldown = this.stats.attackCooldown;
    this.attackAnimationCooldown = this.stats.attackAnimationCooldown;
};
