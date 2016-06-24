var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    attacks: null,
    fx: null,

    ctor: function(resource, tags) {
        this._super(resource, tags);

        this.id = ++_EngagerIncrementer;
        this.attacks = [];
        tags.push('engager');

        this.scheduleUpdate();
    },

    update: function(dt) {
        this.attacks.forEach(function(attack) {
            attack.update(dt);
        }, this);
    },

    prepareAttack: function(attack, target) {
        return attack.prepareAttack(target);
    },

    startAttack: function(attackInstance, target) {
        //console.log('STARTING attack: ', attackInstance, target);
        if(attackInstance.canStartAttack(target)) {
            attackInstance.startAttack(target);

            this.startAttackAnimation(attackInstance);
        }
    },

    //TODO: move this somewhere else for graphics... this is in between all the game logic functions...
    startAttackAnimation: function(attackInstance) {
        var frames = this.fx.animations.attacking;
        //console.log('frames: ', frames, this.orientation);
        if(frames.all)
            this.attackAnimation = this.runAction(Animations.getAnimation(frames.all, attackInstance.attackAnimationCooldown, 1));
        else
            this.attackAnimation = this.runAction(Animations.getAnimation(frames[this.orientation], attackInstance.attackAnimationCooldown, 1));

        Event.subscribeOnce('attackFinished', this.attacks[0].activeAttack, function(data) {
            this[2].attackSound = cc.audioEngine.playEffect(this[2].fx.sounds.attackFinished);
            this[2].fx.fxFnc.call(this[2], this[0], data.victim);
        });
    },

    cancelAttack: function(attackInstance) {
        if(this.attackAnimation && this.attackAnimation.target)
            this.stopAction(this.attackAnimation);
        //cc.audioEngine.stopEffect(this.attackSound);
        attackInstance.cancelAttack();

        //console.log('Attack canceled.');
    },

    takeAttack: function(attack, attacker) {
        console.error('takeAttack hasn\'t been implemented!', attack, attacker);
    },

    registerAttack: function(attack) {
       this.attacks.push(attack);
    },
});
