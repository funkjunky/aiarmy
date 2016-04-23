var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    attacks: null,
    startedAttack: null,
    attackAnimationCooldown: null,
    modules: null,      //Note: don't put defaults here. ONLY in ctor. Otherwise shared.
    ctor: function(resource, tags) {
        this._super(resource, tags);

        this.id = ++_EngagerIncrementer;
        tags.push('engager');

        this.scheduleUpdate();
        this.modules = [];
    },

    update: function(dt) {
        if(this.tags.indexOf('leveler') != -1)
            LiveDebugger.set('animationcooldown' + this.__instanceId, this.__instanceId + ' animation: ' + (Math.round(this.attackAnimationCooldown * 100) / 100));
        if(this.startedAttack && this.startedAttack.attacking)
            if((this.attackAnimationCooldown -= dt) <= 0) {
                var finishedAttack = this.startedAttack;
                var attackedTarget = this.startedAttack.currentTarget;
                this.startedAttack.finishAttack();
                this.finishAttack();
                this.trigger('doneAttack', finishedAttack, attackedTarget);
            }
                
        this.attacks.forEach(function(attack) {
            attack.update(dt);
        }, this);
        //Unique module. called on it's own.
        this.modules.forEach(function(module) {
            if(module.update)
                module.update.call(this, dt);
        }, this);
    },

    canPrepareAttack: function(theAttack) {
        return this.trigger('canPrepareAttack', theAttack);
    },

    canStartAttack: function(theAttack) {
        console.log('canstart: ', !this.startedAttack, theAttack.canStartAttack(), this.trigger('canStartAttack', theAttack));
        return !this.startedAttack && theAttack.canStartAttack() && this.trigger('canStartAttack', theAttack);
    },

    startAttack: function(theAttack) {
        if(this.canStartAttack(theAttack)) {
            theAttack.attacking = true;
            this.attackAnimationCooldown = theAttack.props.attackAnimationCooldown;
            this.startedAttack = theAttack;
        }
    },

    finishAttack: function() {
        this.startedAttack = null;
    },

    considerTarget: function(currentTarget, consideredTarget, attack) {
        var found = false;
        //Special case, shouldn't use trigger. TODO: this seems messy?
        this.modules.forEach(function(module) {
            if(module.considerTarget)
                found = module.considerTarget(currentTarget, consideredTarget, attack);
        }, this);
        if(found)
            return found;
        //default is to attack the closest target
        if(MathHelper.dist(currentTarget, this) < MathHelper.dist(consideredTarget, this))
            return currentTarget;
        else
            return consideredTarget;
    },

    takeAttack: function(attack, attacker) {
        console.error('takeAttack hasn\'t been implemented!', attack, attacker);
    },

    trigger: function(moduleEvent) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.modules.every(function(module) {
            if(module[moduleEvent])
                return module[moduleEvent].apply(this, args); 
            else
                return true;
        }, this);
    },
});
