var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    attacks: null,

    modules: null,      //Note: don't put defaults here. ONLY in ctor. Otherwise shared.
    ctor: function(resource, tags) {
        this._super(resource, tags);

        this.id = ++_EngagerIncrementer;
        this.attacks = [];
        tags.push('engager');

        this.scheduleUpdate();
        this.modules = [];
    },

    update: function(dt) {
        this.attacks.forEach(function(attack) {
            attack.update(dt);
        }, this);

        //Unique module. called on it's own.
        this.modules.forEach(function(module) {
            if(module.update)
                module.update.call(this, dt);
        }, this);
    },

    startAttack: function(attackInstance, target) {
        //console.log('STARTING attack: ', attackInstance, target);
        if(attackInstance.canStartAttack(target)) {
            attackInstance.startAttack(target);

            this.startAttackAnimation(attackInstance);

            //TODO: the sound effect should play at 'finishAttack', also if slime is obviously terrible
            if(this.name == 'slime')
                setTimeout(function() {
                    this.attackSound = cc.audioEngine.playEffect(res[this.name + '_sfx']);
                }.bind(this), 800);
            else
                this.attackSound = cc.audioEngine.playEffect(res[this.name + '_sfx']);
        }
    },

    //TODO: move this somewhere else for graphics... this is in between all the game logic functions...
    startAttackAnimation: function(attackInstance) {
        var frames = Animations.frames[this.name].attacking;
        //console.log('frames: ', frames, this.orientation);
        if(frames.all)
            this.attackAnimation = this.runAction(Animations.getAnimation(frames.all, attackInstance.attackAnimationCooldown, 1));
        else
            this.attackAnimation = this.runAction(Animations.getAnimation(frames[this.orientation], attackInstance.attackAnimationCooldown, 1));
    },

    cancelAttack: function(attackInstance) {
        this.stopAction(this.attackAnimation);
        cc.audioEngine.stopEffect(this.attackSound);
        attackInstance.cancelAttack();

        console.log('Attack canceled.');
    },

    takeAttack: function(attack, attacker) {
        console.error('takeAttack hasn\'t been implemented!', attack, attacker);
    },

    registerAttack: function(attack) {
       //inAttackRange 
       this.attacks.push(attack);
       this.onFenceEnter('monster', attack.props.range, function(monster, distance) {
            Event.trigger('inAttackRange', [attack, monster], {distance: distance});
       });
    },
});
