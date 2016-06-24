var AttackInstance = function(attack, target, attrs) {
    this.attack = attack;
    this.target = target;
    this.attrs = attrs;

    this.attackCooldown = attack.props.attackCooldown;
    this.attackAnimationCooldown = attack.props.attackAnimationCooldown;
    this.range = attack.props.range;

    this.preparing = true;
    this.attacking = false;

    var attackInstance = this;
    this._enterEvent = attack.owner.onFenceEnter(this.target, this.range, function(fenceTarget, distance) {
        Event.trigger('inAttackRange', [[attackInstance, fenceTarget]], {distance: distance});
    });
    //if the character goes out of range, then seek to it.
    this._exitEvent = attack.owner.onFenceExit(this.target, this.range, function(fenceTarget, distance) {
        this.seek(fenceTarget, attack.props.range, function() {
            //console.log('FINISHED SEEK! Attack.js');
        });
    });

    return this;
};

AttackInstance.prototype.update = function(dt) {
    //LiveDebugger.set('animationcooldown' + this.__instanceId, this.__instanceId + ' animation: ' + (Math.round(this.attacks[0].activeAttack.attackAnimationCooldown * 100) / 100));
    if(this.preparing && (this.attackCooldown -= dt) <= 0){ 
        //console.log('attack instance: attack prepared!!');
        this.preparing = false;
        //Event.trigger('attackPrepared', [this, this.attack, this.attack.owner], {target: this.target});
        if(this.targetInRange(this.target))
            Event.trigger('attackPreparedAndInRange', [this, this.attack, this.attack.owner], {target: this.target});
        else
            Event.subscribeOnce('inAttackRange', [this, this.target], function(data) { //trigger is in character/Engager->registerAttack
                var attackInstance = this[0][0];
                Event.trigger('attackPreparedAndInRange', [attackInstance, attackInstance.attack, attackInstance.attack.owner], {target: attackInstance.target});
            });
    }
    else if(this.attacking && (this.attackAnimationCooldown -= dt) <= 0) {
        //console.log('attack instance: FINISHED ATTACK');
        this.attacking = false;
        Event.trigger('attackFinished', [this, this.attack, this.attack.owner], {victim: this.target});
        this.cleanUpAttack();
    }
};

AttackInstance.prototype.startAttack = function() {
    //TODO: in the future, id like startAttack to take a target, potentially you could do the cooldown on one target, and start the animation on another.
    this.attacking = true;
};

AttackInstance.prototype.canStartAttack = function(target) {
    return this.targetIsValid(target);
};

AttackInstance.prototype.targetIsValid = function(target) {
    //console.log('validity: ', target);
    return !!(target && target.parent) && this.targetInRange(target);
};

AttackInstance.prototype.targetInRange = function(target) {
    return MathHelper.dist(target, this.attack.owner) <= this.range;
};

AttackInstance.prototype.done = function() {
    return !this.preparing && !this.attacking;
};

AttackInstance.prototype.cancelAttack = function() {
    this.preparing = this.attacking = false;
    this.cleanUpAttack();
};

AttackInstance.prototype.cleanUpAttack = function() {
    fenceEvents = this.attack.owner.fenceEvents;
    fenceEvents.splice(fenceEvents.indexOf(this._enterEvent), 1);
    fenceEvents.splice(fenceEvents.indexOf(this._exitEvent), 1);
};

