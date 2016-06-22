//TODO: clone props and attrs
var Attack = function(owner, props, attrs) {
    this.owner = owner;
    this.props = props;
    this.attrs = attrs;

    this.activeAttack = null;

    return this;
};

Attack.prototype.update = function(dt) {
    if(this.activeAttack)
        this.activeAttack.update(dt);
};

//Note: if you override this function, you must call this parent function ie.:
// return result && Attack.prototype.canPrepareAttack.apply(this, arguments);
Attack.prototype.canPrepareAttack = function() {
    return !this.activeAttack || this.activeAttack.done();
};

Attack.prototype.prepareAttack = function(target) {
    if(!this.canPrepareAttack())
        return false;

    this.activeAttack = this.createAttackInstance(target, this.attrs);

    Event.trigger('preparingAttack', [this, this.owner], {attackInstance: this.activeAttack});

    return this.activeAttack;
};

//Each attack should define it's own createAttackInstance
Attack.prototype.createAttackInstance = function(target, attrs) {
    attrs = attrs || {};
    for(var k in this.attrs[k])
        if(!attrs[k])
            attrs[k] = this.attrs[k];

    var instance = new AttackInstance(this, target, attrs);
    return instance;
};

//TODO: this may no longer be needed
Attack.prototype.targetInRange = function(target) {
    return MathHelper.dist(target, this.owner) <= this.props.range;
};
