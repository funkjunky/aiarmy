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
        this.owner.trigger('prepareAttack', this);
    }

    if(!this.attacking && (this.attackCooldown -= dt) <= 0) {
        this.startAttack();
        this.owner.trigger('startAttack', this);
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

Attack.prototype.engage = function(character, enemy) {
    this.engagedEvents[enemy.id] = {
        enter: character.onFenceEnter(enemy, theAttack.stats.range, function(enemy, distance) {
            this.inRange.push(enemy);
        }.bind(this)),
        exit: character.onFenceExit(enemy, theAttack.stats.range, function(enemy, distance) {
            this.inRange.splice(this.inRange.indexOf(enemy), 1);
        }.bind(this)),
    };
    this.owner.trigger('engage', this, enemy);
};

Attack.prototype.disengage = function(character, enemy) {
    theAttack.currentTarget = null;
    character.fenceEvents.splice(character.fenceEvents.indexOf(this.engagedEvents[enemy.id].enter), 1);
    character.fenceEvents.splice(character.fenceEvents.indexOf(this.engagedEvents[enemy.id].exit), 1);
    this.owner.trigger('disengage', this, enemy);
};

Attack.prototype.prepareAttack = function() {
    this.attackActive = true;
    this.attackCooldown = this.stats.attackCooldown;
};

Attack.prototype.startAttack = function() {
    this.attacking = true;
    this.owner.attackAnimationCooldown = this.stats.attackAnimationCooldown;
};

Attack.prototype.finishAttack = function() {
    this.attackActive = false;
    this.attacking = false;

    this.attackCooldown = this.stats.attackCooldown;
};
