var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    attacks: [],
    activeAttack: null,
    modules: [],
    ctor: function(resource, tags) {
        this._super(resource, tags);

        this.id = _EngagerIncrementer++;
        tags.push('engager');

        this.scheduleUpdate();
    },

    update: function(dt) {
        if(this.activeAttack && this.activeAttack.attacking)
            if((this.attackAnimationCooldown -= dt) <= 0) {
                this.trigger('finishAttack', this.activeAttack.currentTarget);
                this.activeAttack.finishAttack();
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
        var args = arguments.splice(1, 1);
        this[moduleEvent].call(this, args);
        this.modules.forEach(function(module) {
            if(module[moduleEvent])
                module[moduleEvent].apply(this, args); 
        }, this);
    },
});
