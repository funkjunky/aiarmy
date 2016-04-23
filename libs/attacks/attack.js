//TODO: clone props and attrs
var Attack = function(owner, props, attrs) {
    this.owner = owner;
    this.props = props;
    this.attrs = attrs;

    this.currentTarget = null;

    this.engaged = [];
    this.engagedEvents = {};

    this.idle = true;
    this.attackActive = false;
    this.attacking = false;
    this.attackCooldown = this.props.attackCooldown;

    this.inRange = [];

    return this;
};

Attack.prototype.update = function(dt) {
    if(this.inRange.length <= 0) {
        //this.resetAttackAnimation();
        LiveDebugger.set('attack' + this.attrs.baseDamage, this.attrs.baseDamage + ': OFF');
        if(this.attackActive || this.attacking)
            this.cancelAttack();
        return;
    }
    LiveDebugger.set('attack' + this.attrs.baseDamage, this.attrs.baseDamage + ': ' + this.idle + ' -> ' + this.attackActive + ' -> ' + this.attacking + '| cd: ' + (Math.round(this.attackCooldown * 100) / 100) + '--inrange: ' + this.inRange[0].__instanceId);

    this.updateTarget();
    if(this.idle) {
        this.prepareAttack();
    }

    if(this.attackActive && !this.attacking && (this.attackCooldown -= dt) <= 0)
        this.owner.startAttack(this);
};

Attack.prototype.updateTarget = function() {
    if(!this.currentTarget && this.inRange.length)
        this.currentTarget = this.inRange[0];

    this.inRange.forEach(function(enemy) {
        this.currentTarget = this.owner.considerTarget(this.currentTarget, enemy, this);
    }, this);

    if(!this.currentTarget.parent) //if the node no longer exists, then set the target to null
        this.currentTarget = null;

    if(this.currentTarget)
        LiveDebugger.set(this.attrs.baseDamage + 'currentTarget', this.attrs.baseDamage + ' currentTarget: ' + this.currentTarget.__instanceId);
    else
        LiveDebugger.set(this.attrs.baseDamage + 'currentTarget', this.attrs.baseDamage + ' currentTarget: null');
};

Attack.prototype.engage = function(character, enemy) {
    console.log('engaging: ', character, enemy, enemy.id);
    this.engagedEvents[enemy.id] = {
        enter: character.onFenceEnter(enemy, this.props.range, function(enemy, distance) {
            if(!enemy.parent) //TODO: if this isn't in the layer, then immediately disengage. Needed for after a monster dies.
                return this.disengage(character, enemy);
            console.log('in range: ', enemy.__instanceId);

            this.inRange.push(enemy);
        }.bind(this)),
        exit: character.onFenceExit(enemy, this.props.range, function(enemy, distance) {
            this.inRange.splice(this.inRange.indexOf(enemy), 1);
            if(enemy == this.currentTarget)
                this.resetAttackAnimation();
        }.bind(this)),
    };

    console.log('engaged events: ', this.engagedEvents);

    this.owner.trigger('engage', this, enemy);
};

Attack.prototype.resetAttackAnimation = function() {
    this.attacking = false;
    console.log(this.attrs.baseDamage + ' attack reset.');
};

Attack.prototype.cancelAttack = function() {
    this.attacking = false;
    this.attackActive = false;
    this.idle = true;
    console.log(this.attrs.baseDamage + ' attack canceled.');
};

Attack.prototype.disengage = function(character, enemy) {
    if(this.currentTarget == enemy)
        this.currentTarget = null;
    character.fenceEvents.splice(character.fenceEvents.indexOf(this.engagedEvents[enemy.id].enter), 1);
    character.fenceEvents.splice(character.fenceEvents.indexOf(this.engagedEvents[enemy.id].exit), 1);
    this.owner.trigger('disengage', this, enemy);
};

//Note: if you override this function, you must call this parent function ie.:
// return result && Attack.prototype.canPrepareAttack.apply(this, arguments);
Attack.prototype.canPrepareAttack = function() {
    LiveDebugger.set(this.attrs.baseDamage + 'currentTargett', this.attrs.baseDamage + ' canprepare: ' + this.targetIsValid() + " " + this.owner.canPrepareAttack(this));
    return this.idle && this.targetIsValid() && this.owner.canPrepareAttack(this);
};

Attack.prototype.prepareAttack = function() {
    if(!this.canPrepareAttack())
        return false;

    this.idle = false;
    this.attackActive = true;
    this.attackCooldown = this.props.attackCooldown;
};

Attack.prototype.canStartAttack = function() {
    return this.targetIsValid();
};

Attack.prototype.targetIsValid = function() {
    return !!(this.currentTarget && this.currentTarget.parent);
};

Attack.prototype.finishAttack = function() {
    this.attackActive = false;
    this.attacking = false;
    this.idle = true;
};
