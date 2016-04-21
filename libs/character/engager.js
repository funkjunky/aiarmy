var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    attacks: null,
    activeAttack: null,
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
        LiveDebugger.set('animationcooldown' + this.__instanceId, this.__instanceId + ' animation: ' + (Math.round(this.attackAnimationCooldown * 100) / 100));
        if(this.activeAttack && this.activeAttack.attacking)
            if((this.attackAnimationCooldown -= dt) <= 0) {
                this.activeAttack.finishAttack();
                this.trigger('finishAttack', this.activeAttack, this.activeAttack.currentTarget);
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

    startAttack: function(theAttack) {
        if(!this.activeAttack) {
            theAttack.attacking = true;
            this.attackAnimationCooldown = theAttack.props.attackAnimationCooldown;
            this.activeAttack = theAttack;
        }
    },

    finishAttack: function(theAttack) {
        this.activeAttack = null;
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
            return enemy;
        else
            return currentTarget;
    },

    takeAttack: function(attack, attacker) {
        console.error('takeAttack hasn\'t been implemented!', attack, attacker);
    },

    trigger: function(moduleEvent) {
        var args = Array.prototype.slice.call(arguments, 1);

        if(this[moduleEvent])
            this[moduleEvent].apply(this, args);

        this.modules.forEach(function(module) {
            if(module[moduleEvent])
                module[moduleEvent].apply(this, args); 
        }, this);
    },
});
