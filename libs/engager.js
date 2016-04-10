var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    stats: {
        range: 1,
        attackCooldown: 1,          //Time before we begin executing the attack
        attackAnimationCooldown, 1, //time before we finish executing the attack
    },
    engaged: [],
    engagedEvents: {},
    inRange: [],
    currentTarget: null,
    modules: [],
    ctor: function(resource, tags) {
        this._super(resource, tags);

        this.id = _EngagerIncrement++;
        tags.push('engager');

        this.scheduleUpdate();
    },
    update: function(dt) {
        if(!this.attacking)
            this.updateTarget();

        if((this.attackCooldown -= dt) <= 0)
            this.startAttack();
        
        if((this.attacking && (this.attackAnimationCooldown -= dt) <= 0)
            this.finishAttack();
    },

    startAttack: function() {
        this.attacking = true;
    },
    finishAttack: function() {
        this.attacking = false;

        this.attackCooldown = this.stats.attackCooldown;
        this.attackAnimationCooldown = this.stats.attackAnimationCooldown;
    },

    updateTarget: function() {
        if(!this.currentTarget && this.inRange.length)
            this.currentTarget = this.inRange[0];

        this.inRange.forEach(function(enemy) {
            this.considerTarget(enemy);
        });
    },
    considerTarget: function(enemy) {
        //default is to attack the closest target
        if(MathHelper.dist(this.currentTarget, this) < MathHelper.dist(enemy, this))
            this.currentTarget = enemy;
    },

    engage: function(enemy) {
        this.engagedEvents[enemy.id] = {
            enter: this.onFenceEnter(enemy, this.stats.range, function(enemy, distance) {
                this.inRange.push(enemy);
            }),
            exit: this.engagedEvents[enemy.id] = this.onFenceExit(enemy, this.stats.range, function(enemy, distance) {
                this.inRange.splice(this.inRange.indexOf(enemy), 1);
            }),
        };
    },
    disengage: function(enemy) {
        this.fenceEvents.splice(this.fenceEvents.indexOf(this.engagedEvents[enemy.id].enter), 1);
        this.fenceEvents.splice(this.fenceEvents.indexOf(this.engagedEvents[enemy.id].exit), 1);
    },

    takeAttack: function(attack, attacker) {
        console.error('takeAttack hasn\'t been implemented!', attack, attacker);
    },
});
