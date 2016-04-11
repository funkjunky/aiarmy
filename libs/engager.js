var _EngagerIncrementer = 0;
var Engager = Interactive.extend({
    id: -1, //TODO: check to see if sprites already had ids... I don't want to overwrite something they already had.
    attacks: [],
    modules: [],
    ctor: function(resource, tags) {
        this._super(resource, tags);

        this.id = _EngagerIncrement++;
        tags.push('engager');

        this.scheduleUpdate();
    },

    update: function(dt) {
        this.attacks.forEach(function(attack) {
            attack.update(dt);
        }, this);
    },

    considerTarget: function(currentTarget, consideredTarget, attack) {
        //default is to attack the closest target
        if(MathHelper.dist(currentTarget, this) < MathHelper.dist(consideredTarget, this))
            return enemy;
        else
            return currentTarget;
    },

    takeAttack: function(attack, attacker) {
        console.error('takeAttack hasn\'t been implemented!', attack, attacker);
    },
});
