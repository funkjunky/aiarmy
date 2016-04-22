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
        LiveDebugger.set('attack' + this.attrs.baseDamage, this.attrs.baseDamage + ': OFF');
        return;
    }
    LiveDebugger.set('attack' + this.attrs.baseDamage, this.attrs.baseDamage + ': ' + this.idle + ' -> ' + this.attackActive + ' -> ' + this.attacking + '| cd: ' + (Math.round(this.attackCooldown * 100) / 100) + '--inrange: ' + this.inRange[0].__instanceId);

    this.updateTarget();
    if(!this.attacking && this.idle) {   //we just started preparing for our attack then.
        this.prepareAttack();
        this.owner.trigger('prepareAttack', this);
    }

    if(this.attackActive && !this.attacking && (this.attackCooldown -= dt) <= 0) {
        this.startAttack();
        this.owner.trigger('startAttack', this);
    }
};

Attack.prototype.startAttack = function() {
};

Attack.prototype.updateTarget = function() {
    if(!this.currentTarget && this.inRange.length)
        this.currentTarget = this.inRange[0];

    this.inRange.forEach(function(enemy) {
        this.currentTarget = this.owner.considerTarget(this.currentTarget, enemy, this);
    }, this);

    if(!this.currentTarget.parent) //if the node no longer exists, then set the target to null
        this.currentTarget = null;
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
                this.cancelAttack();
        }.bind(this)),
    };

    console.log('engaged events: ', this.engagedEvents);

    this.owner.trigger('engage', this, enemy);
};

Attack.prototype.cancelAttack = function() {
    this.attacking = false;
    console.log(this.attrs.baseDamage + ' attack canceled. inrange: ', this.inRange);
};

Attack.prototype.disengage = function(character, enemy) {
    if(this.currentTarget == enemy)
        this.currentTarget = null;
    character.fenceEvents.splice(character.fenceEvents.indexOf(this.engagedEvents[enemy.id].enter), 1);
    character.fenceEvents.splice(character.fenceEvents.indexOf(this.engagedEvents[enemy.id].exit), 1);
    this.owner.trigger('disengage', this, enemy);
};

Attack.prototype.prepareAttack = function() {
    this.idle = false;
    this.attackActive = true;
    this.attackCooldown = this.props.attackCooldown;
};

Attack.prototype.finishAttack = function() {
    this.attackActive = false;
    this.attacking = false;
    this.idle = true;
};
