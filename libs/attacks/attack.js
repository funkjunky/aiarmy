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
    //return !this.activeAttack && this.owner.canPrepareAttack(this);
    return !this.activeAttack || this.activeAttack.done();
};

Attack.prototype.prepareAttack = function(target) {
    if(!this.canPrepareAttack())
        return false;

    this.activeAttack = this.createAttackInstance(target, this.attrs);

    Event.trigger('preparingAttack', [this, this.owner], {attackInstance: this.activeAttack});

    if(!this.activeAttack.targetInRange(target))
        this.owner.seek(target, this.props.range, function() {
            //console.log('FINISHED SEEK! Attack.js');
        });

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

Attack.prototype.targetInRange = function(target) {
    return MathHelper.dist(target, this.owner) <= this.props.range;
};

//TODO: this is SUPER ugly... i dunno...
//If this EVER causes a problem. Then no more stacked callbacks in attackPrepared or attackFinished, or ANYWHERE
function shoehornCallbacks(callbacks, newCallbacks) {
    for(var k in newCallbacks)
        if(callbacks[k])
            callbacks[k] = function(oldCallback, newCallback) {
                var realArguments = arguments.slice(2);
                oldCallback.apply(this, realArguments);
                newCallback.apply(this, realArguments);
            }.bind(this, callbacks[k], newCallbacks[k]);
        else
            callbacks[k] = newCallbacks[k];

    return callbacks;
};
